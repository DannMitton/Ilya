// apps/web/src/routes/api/shane/spike-denigma/+server.ts
//
// Vercel spike for the denigma-runner integration.
//
// Purpose: confirm the denigma binary executes in Vercel's serverless runtime,
// /tmp is writable, timeouts behave, and response payloads fit Vercel's 4.5 MB
// limit before committing to the full denigma-runner implementation.
//
// Spec: Kimi's spike contract (2026-05-16). One documented deviation:
// the spike also checks for file-based output at /tmp/test.mnx, since denigma's
// README indicates output may be written to a .mnx file rather than stdout.
// The response includes outputSource: 'stdout' | 'file' so the actual behaviour
// is revealed rather than assumed.

import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { INCLUDE_SHANE } from '$lib/wall';
import { spawn } from 'node:child_process';
import { writeFile, readFile, unlink, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

interface SpikeDiagnostics {
	binaryPath: string;
	binaryExists: boolean;
	binarySizeBytes: number;
	tmpWritable: boolean;
	spawnExitCode: number | null;
	spawnSignal: string | null;
	stdoutLength: number;
	stderrLength: number;
	durationMs: number;
	timeoutHit: boolean;
	// Extensions beyond Kimi's spec, for file-output detection:
	outputFileExists: boolean;
	outputFileSizeBytes: number;
}

interface SpikeResult {
	success: boolean;
	diagnostics: SpikeDiagnostics;
	mnxPreview?: string;
	outputSource?: 'stdout' | 'file';
	stderrPreview?: string;
	error?: string;
}

const VERCEL_RESPONSE_LIMIT_BYTES = 4_500_000;
const SPAWN_TIMEOUT_MS = 30_000;
const MNX_PREVIEW_LENGTH = 500;
const STDERR_PREVIEW_LENGTH = 500;

export const POST: RequestHandler = async ({ request }) => {
	// Step 1: Wall check. hooks.server.ts also blocks /api/shane/* when the wall
	// is off, but defence in depth is cheap here.
	if (!INCLUDE_SHANE) {
		throw error(404, 'Not Found');
	}

	// Resolve binary path relative to project root.
	// Vercel's serverless functions run with cwd at the project root after build,
	// assuming the monorepo workspace files are included in the function bundle.
	// If the binary is missing, the spike will report BINARY_MISSING and we will
	// know to adjust include patterns or copy the binary into the app at build.
	const projectRoot = process.cwd();
	const binaryPath = join(projectRoot, 'packages/score-parser/bin/denigma');

	const diagnostics: SpikeDiagnostics = {
		binaryPath,
		binaryExists: false,
		binarySizeBytes: 0,
		tmpWritable: false,
		spawnExitCode: null,
		spawnSignal: null,
		stdoutLength: 0,
		stderrLength: 0,
		durationMs: 0,
		timeoutHit: false,
		outputFileExists: false,
		outputFileSizeBytes: 0
	};

	const tmpInputPath = '/tmp/test.musx';
	const tmpOutputPath = '/tmp/test.mnx';
	const tmpProbePath = '/tmp/shane-spike-probe';

	try {
		// Step 2: Verify binary presence and size.
		diagnostics.binaryExists = existsSync(binaryPath);
		if (!diagnostics.binaryExists) {
			return json({
				success: false,
				diagnostics,
				error: 'BINARY_MISSING'
			} satisfies SpikeResult);
		}
		const binaryStat = await stat(binaryPath);
		diagnostics.binarySizeBytes = binaryStat.size;

		// Step 3: Probe /tmp writability with a write-read-delete cycle.
		try {
			await writeFile(tmpProbePath, new Uint8Array([0]));
			const probeRead = await readFile(tmpProbePath);
			await unlink(tmpProbePath);
			diagnostics.tmpWritable = probeRead.byteLength === 1;
		} catch {
			diagnostics.tmpWritable = false;
			return json({
				success: false,
				diagnostics,
				error: 'TMP_NOT_WRITABLE'
			} satisfies SpikeResult);
		}

		// Step 4: Read uploaded .musx and write to /tmp.
		const formData = await request.formData();
		const file = formData.get('file');
		if (!(file instanceof File)) {
			return json({
				success: false,
				diagnostics,
				error: 'NO_FILE_UPLOADED'
			} satisfies SpikeResult);
		}
		const fileBuffer = new Uint8Array(await file.arrayBuffer());
		await writeFile(tmpInputPath, fileBuffer);

		// Steps 5-6: Spawn denigma; capture stdout, stderr, exit, signal, duration.
		const startMs = performance.now();
		const spawnResult = await spawnDenigma(binaryPath, tmpInputPath, SPAWN_TIMEOUT_MS);
		diagnostics.durationMs = Math.round(performance.now() - startMs);
		diagnostics.spawnExitCode = spawnResult.exitCode;
		diagnostics.spawnSignal = spawnResult.signal;
		diagnostics.stdoutLength = spawnResult.stdout.length;
		diagnostics.stderrLength = spawnResult.stderr.length;
		diagnostics.timeoutHit = spawnResult.timedOut;

		// Check for file-based output (denigma's README suggests .mnx file output).
		diagnostics.outputFileExists = existsSync(tmpOutputPath);
		if (diagnostics.outputFileExists) {
			const outputStat = await stat(tmpOutputPath);
			diagnostics.outputFileSizeBytes = outputStat.size;
		}

		const stderrPreview = spawnResult.stderr.slice(0, STDERR_PREVIEW_LENGTH);

		// Steps 7-8: Decide outcome.
		if (spawnResult.timedOut) {
			return json({
				success: false,
				diagnostics,
				error: 'TIMEOUT',
				stderrPreview
			} satisfies SpikeResult);
		}

		if (spawnResult.exitCode !== 0) {
			return json({
				success: false,
				diagnostics,
				error: `EXECUTION_FAILED (exit code ${spawnResult.exitCode})`,
				stderrPreview
			} satisfies SpikeResult);
		}

		// Determine output source. Prefer stdout if non-empty; fall back to file.
		let mnxContent = '';
		let outputSource: 'stdout' | 'file' | null = null;

		if (spawnResult.stdout.length > 0) {
			mnxContent = spawnResult.stdout;
			outputSource = 'stdout';
		} else if (diagnostics.outputFileExists && diagnostics.outputFileSizeBytes > 0) {
			mnxContent = await readFile(tmpOutputPath, 'utf-8');
			outputSource = 'file';
		} else {
			return json({
				success: false,
				diagnostics,
				error: 'EMPTY_OUTPUT (no stdout content and no output file)',
				stderrPreview
			} satisfies SpikeResult);
		}

		// Stress-test guard: Vercel response payload limit.
		if (mnxContent.length > VERCEL_RESPONSE_LIMIT_BYTES) {
			return json({
				success: false,
				diagnostics,
				outputSource,
				error: `PAYLOAD_TOO_LARGE: MNX output of ${mnxContent.length} bytes exceeds Vercel's 4.5 MB response limit. Streaming or two-step pattern required.`,
				stderrPreview
			} satisfies SpikeResult);
		}

		return json({
			success: true,
			diagnostics,
			outputSource,
			mnxPreview: mnxContent.slice(0, MNX_PREVIEW_LENGTH),
			stderrPreview: stderrPreview.length > 0 ? stderrPreview : undefined
		} satisfies SpikeResult);
	} catch (err) {
		return json({
			success: false,
			diagnostics,
			error: `UNEXPECTED: ${err instanceof Error ? err.message : String(err)}`
		} satisfies SpikeResult);
	} finally {
		// Step 9: Clean up /tmp files.
		for (const path of [tmpInputPath, tmpOutputPath]) {
			try {
				await unlink(path);
			} catch {
				// Ignore: file may not exist if we failed before writing it.
			}
		}
	}
};

interface SpawnResult {
	exitCode: number | null;
	signal: string | null;
	stdout: string;
	stderr: string;
	timedOut: boolean;
}

function spawnDenigma(
	binaryPath: string,
	inputPath: string,
	timeoutMs: number
): Promise<SpawnResult> {
	return new Promise((resolve) => {
		const proc = spawn(binaryPath, [inputPath], { timeout: timeoutMs });
		let stdout = '';
		let stderr = '';
		let timedOut = false;

		proc.stdout?.on('data', (chunk: Buffer) => {
			stdout += chunk.toString('utf-8');
		});
		proc.stderr?.on('data', (chunk: Buffer) => {
			stderr += chunk.toString('utf-8');
		});
		proc.on('close', (exitCode, signal) => {
			// proc.killed is true when Node terminated the process (typically via
			// the timeout option, which sends SIGTERM and may escalate to SIGKILL).
			// We treat any Node-initiated termination as timedOut for diagnostic
			// purposes, regardless of which signal was actually sent.
			if (proc.killed) {
				timedOut = true;
			}
			resolve({ exitCode, signal, stdout, stderr, timedOut });
		});
		proc.on('error', (err) => {
			resolve({
				exitCode: null,
				signal: null,
				stdout,
				stderr: stderr + `\nspawn error: ${err.message}`,
				timedOut: false
			});
		});
	});
}
