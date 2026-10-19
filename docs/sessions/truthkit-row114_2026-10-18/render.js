const v=require('verovio'); const fs=require('fs');
const [,, inp, out, width] = process.argv;
v.module.onRuntimeInitialized=()=>{const t=new v.toolkit();
 t.setOptions({pageWidth: Number(width||2100), pageHeight:60000, scale:45, adjustPageHeight:true, breaks:'none', lyricSize:5, footer:'none', header:'none', spacingLinear:0.3, spacingNonLinear:0.55});
 t.loadData(fs.readFileSync(inp,'utf8'));
 let svg=t.renderToSVG(1); svg=svg.replace(/font-family:[^;"]*/g,'font-family:DejaVu Serif').replace(/font-family="[^"]*"/g,'font-family="DejaVu Serif"');
 fs.writeFileSync(out, svg); console.log('rendered', out);
};
