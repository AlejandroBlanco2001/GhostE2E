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
    writeFileSync('diff.png', PNG.sync.write(diff));

    const diffPath = '../screenshots/playwright/NON_VRT/EP006 Create Member/diff.png';
    writeFileSync(diffPath, PNG.sync.write(diff));

    console.log(`Imagen de diferencias guardada en: ${diffPath}`);

};

pixelRunner();