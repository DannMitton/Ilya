/**
 * A tiny, dependency-free XML reader for MusicXML fixtures in tests.
 *
 * vitest runs in node, where there is no `DOMParser`, and the parser says so
 * itself rather than guessing: "String MusicXML needs a DOM parser; pass a
 * pre-parsed Document in this environment." This is the same mini-DOM the
 * score-parser's own musicxml-parser.test.ts carries, for the same reason, and
 * it implements only the small structural surface the parser reads. It stays
 * copied from that package rather than shared with it, because moving it would
 * touch a 539-test suite; it is shared HERE so the app carries one copy rather
 * than one per test file. Lifted verbatim out of
 * `recognized-to-musicxml.test.ts` by N.111, which needed the same reader.
 */

type MiniNode = { t: 'e'; el: MiniEl } | { t: 't'; s: string };

function decodeEntities(s: string): string {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
		.replace(/&amp;/g, '&');
}

class MiniEl {
	tagName: string;
	attrs = new Map<string, string>();
	nodes: MiniNode[] = [];
	constructor(tagName: string) {
		this.tagName = tagName;
	}
	getAttribute(name: string): string | null {
		return this.attrs.has(name) ? (this.attrs.get(name) as string) : null;
	}
	get children(): MiniEl[] {
		return this.nodes.filter((n): n is { t: 'e'; el: MiniEl } => n.t === 'e').map((n) => n.el);
	}
	get textContent(): string {
		return this.nodes.map((n) => (n.t === 't' ? n.s : n.el.textContent)).join('');
	}
	getElementsByTagName(tag: string): MiniEl[] {
		const out: MiniEl[] = [];
		const rec = (el: MiniEl) => {
			for (const c of el.children) {
				if (tag === '*' || c.tagName === tag) out.push(c);
				rec(c);
			}
		};
		rec(this);
		return out;
	}
}

function parseXml(src: string): MiniEl {
	const cleaned = src
		.replace(/<\?xml[\s\S]*?\?>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<!DOCTYPE[\s\S]*?>/g, '');
	const doc = new MiniEl('#document');
	const stack: MiniEl[] = [doc];
	const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	let pos = 0;
	const addText = (text: string) => {
		if (text.length === 0) return;
		stack[stack.length - 1].nodes.push({ t: 't', s: decodeEntities(text) });
	};
	while (pos < cleaned.length) {
		const lt = cleaned.indexOf('<', pos);
		if (lt < 0) {
			addText(cleaned.slice(pos));
			break;
		}
		if (lt > pos) addText(cleaned.slice(pos, lt));
		const gt = cleaned.indexOf('>', lt);
		if (gt < 0) break;
		const raw = cleaned.slice(lt + 1, gt);
		pos = gt + 1;
		if (raw.startsWith('/')) {
			if (stack.length > 1) stack.pop();
			continue;
		}
		const selfClose = raw.endsWith('/');
		const inner = selfClose ? raw.slice(0, -1) : raw;
		const nameMatch = /^([^\s/]+)([\s\S]*)$/.exec(inner);
		if (!nameMatch) continue;
		const el = new MiniEl(nameMatch[1]);
		attrRe.lastIndex = 0;
		let am: RegExpExecArray | null;
		while ((am = attrRe.exec(nameMatch[2])) !== null) {
			el.attrs.set(am[1], decodeEntities(am[2] !== undefined ? am[2] : am[3]));
		}
		stack[stack.length - 1].nodes.push({ t: 'e', el });
		if (!selfClose) stack.push(el);
	}
	return doc;
}

export { MiniEl, parseXml };
export type { MiniNode };
