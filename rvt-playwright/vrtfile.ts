import { readFileSync, writeFileSync} from 'fs';
import pixelmatch, { PixelmatchOptions } from 'pixelmatch';
import { PNG } from 'pngjs';


function pixelRunner(){
    const options: PixelmatchOptions = {
        "threshold": 0.1,
        "includeAA": true,
        "alpha": 0.1,
        "aaColor": [255, 0, 0],
        "diffColor": [255, 0, 255]
    }

    let beforePath = '../screenshots/playwright/NON_VRT/EP006 Create Member/Create Member.png';
    let afterPath = '../screenshots/playwright/NON_VRT/EP006 Create Member/Create Member.png';

    const img1 = PNG.sync.read(readFileSync(beforePath));
    const img2 = PNG.sync.read(readFileSync(afterPath));

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    pixelmatch(img1.data, img2.data, diff.data, width, height, options);

    const diffPath = './results/diff.png';
    writeFileSync(diffPath, PNG.sync.write(diff));

    const reportPath = './results/report.html'
    writeFileSync(reportPath, createReport());

    console.log(`Consulte el Reporte en: ${reportPath}`);

};

function createReport(){
    let reportHtml =`
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report VRT PixelMatch</h1>
            
            <div id="visualizer">
            </div>
        </body>
    </html>`
    return reportHtml;
}

function browser(){
    return `<div class=" browser" id="test0">
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference</span>
        <img class="img2" src="before-.png" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test</span>
        <img class="img2" src="after-.png" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="./compare-.png" id="diffImage" label="Diff">
      </div>
    </div>
  </div>`
}



pixelRunner();