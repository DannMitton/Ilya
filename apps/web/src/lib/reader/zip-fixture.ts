/**
 * Byte-level ZIP fixture builder, shared by the ingestion test suites
 * (handover v35 §E.3). Real CRC-32, real local headers, real central
 * directory, real EOCD, so the fixtures are honest ZIP files and nothing
 * copyrighted enters the tree.
 *
 * N.67 step 5: THE WRITER ITSELF NOW LIVES IN `$lib/library/zip-writer.ts`,
 * promoted to app code because the `.ilya` binder needs it. This file is what
 * remains that is genuinely test-only: the two `lieAbout*` options, which
 * fabricate corrupt archives to prove the reader refuses them. Everything
 * honest is imported rather than copied, so CRC-32 and the central directory
 * exist in exactly one place and the fixtures cannot drift from the writer the
 * app actually ships.
 */
export { utf8, buildZip } from '$lib/library/zip-writer';
export type { ZipMember, ZipMemberOverrides } from '$lib/library/zip-writer';

import type { ZipMember, ZipMemberOverrides } from '$lib/library/zip-writer';

/** What the suites build: an honest member, optionally lying about itself. */
export type FixtureMember = ZipMember & ZipMemberOverrides;
