// Render one system's MusicXML to SVG with Verovio.
// Changes of 2026-10-19: (1) glyph symbols get overflow="visible" (cairosvg clipped SMuFL glyphs to their viewBox:
// clefs, flags, flats, and fermatas lost their tops); (2) a <time print-object="no"> is removed from the SVG
// (Verovio's importer draws it anyway); (3) a trailing courtesy measure (key change only, no notes) has its staff
// lines cut just after the courtesy signature, as printed at a system's end; (4) Verovio's default spacing (the
// tight spacingLinear 0.3 / spacingNonLinear 0.55 compressed the music, Dann 2026-10-19), on a page wide enough to
// keep the system on one line (adjustPageWidth trims it to the system); proof.py scales the row to the sheet;
// (5) lyrics in Liberation Serif, metric-compatible with the Times that Verovio spaces them by (DejaVu Serif is wider,
// so the syllables ran into each other).
const v=require('verovio'); const fs=require('fs');
const [,, inp, out, width] = process.argv;
v.module.onRuntimeInitialized=()=>{const t=new v.toolkit();
 t.setOptions({pageWidth: Math.max(Number(width||2100), 60000), pageHeight:60000, scale:45, adjustPageHeight:true, adjustPageWidth:true, breaks:'none', lyricSize:5, footer:'none', header:'none'});
 const src=fs.readFileSync(inp,'utf8');
 t.loadData(src);
 let svg=t.renderToSVG(1); svg=svg.replace(/font-family:[^;"]*/g,'font-family:Liberation Serif').replace(/font-family="[^"]*"/g,'font-family="Liberation Serif"');
 svg=svg.replace(/overflow="inherit"/g,'overflow="visible"');
 // hidden time signatures, matched in document order
 const hidden=[...src.matchAll(/<time( print-object="no")?>/g)].map(m=>!!m[1]);
 let k=0; svg=svg.replace(/<g [^>]*class="meterSig"[^>]*>[\s\S]*?<\/g>/g, m=>(hidden[k++]?'':m));
 // trailing courtesy measure: cut the staff lines after the signature
 if (/<measure number="courtesy">/.test(src)) {
   const i=svg.lastIndexOf('class="measure"'); let tail=svg.slice(i);
   const xs=[...tail.matchAll(/class="keyAccid"[^>]*>\s*<use [^>]*x="(\d+)"/g)].map(m=>Number(m[1]));
   if (xs.length) { const x2=Math.max(...xs)+260;
     tail=tail.replace(/<path d="M(\d+) (\d+) L(\d+) (\d+)"/g,(m,a,b,c,d)=>(b===d?`<path d="M${a} ${b} L${x2} ${d}"`:m));
     svg=svg.slice(0,i)+tail; }
 }
 fs.writeFileSync(out, svg); console.log('rendered', out);
};
