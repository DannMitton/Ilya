import type { SourceOrigin } from '@ilya/score-parser';
import type { IngestProvenance } from './ingestion/ingest';

/**
 * QUEUE row 122. Which `upload.format.*` string the arrival receipt draws.
 *
 * The singer's scan route hands homr's reading back as a `.musicxml` file, so
 * it ingests as `via: 'direct'` and the provenance alone would say "MusicXML
 * (direct)", which is what a dropped `.musicxml` file says and not what the
 * singer did. The score's own `source.origin` says a homr reading, and the
 * kind of scan rides on the `arrived` state of the uploader. A homr origin
 * with no known kind keeps the direct key. A pure function because the
 * component is inert under vitest.
 */
export type FormatLabelKey =
	| 'upload.format.mnxDirect'
	| 'upload.format.musicxmlDirect'
	| 'upload.format.mxl'
	| 'upload.format.musxDenigma'
	| 'upload.format.pdfReader'
	| 'upload.format.imageReader'
	| 'upload.format.msczWebmscore';

export function formatLabelKey(p: IngestProvenance, origin: SourceOrigin, scanKind?: 'image' | 'pdf'): FormatLabelKey {
	if (p.via === 'direct') {
		if (origin === 'homr-musicxml-from-image' && scanKind) {
			return scanKind === 'pdf' ? 'upload.format.pdfReader' : 'upload.format.imageReader';
		}
		return p.format === 'mnx' ? 'upload.format.mnxDirect' : 'upload.format.musicxmlDirect';
	}
	if (p.via === 'mxl') return 'upload.format.mxl';
	if (p.via === 'denigma') return 'upload.format.musxDenigma';
	if (p.via === 'reader') return p.sourceFormat === 'pdf' ? 'upload.format.pdfReader' : 'upload.format.imageReader';
	return 'upload.format.msczWebmscore'; // via === 'webmscore'
}
