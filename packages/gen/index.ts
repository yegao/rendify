import { parseArgv } from './options';
import { browser, page, generate }  from './generator';
import path from 'path';
import fs from 'fs';

const parsed = parseArgv(process.argv);
(async function () {
    if (parsed === null) {
        process.exitCode = 2;
        return;
    }
    const { content, opts } = parsed;
    const config = JSON.parse(content);
    const staticPaths = Object.keys(config);
    for (const staticPath of staticPaths) {
        const uri = config[staticPath];
        const staticContent = await generate(uri);
        console.log(uri + '->' + staticPath);
        const absoluteStaticPath = path.resolve(opts.dir, staticPath);
        const chunks = absoluteStaticPath.split('/');
        const filename = chunks.pop();
        const absoluteStaticDirectory = chunks.join('/');
        fs.mkdirSync(absoluteStaticDirectory, {recursive: true});
        fs.writeFileSync(absoluteStaticPath, staticContent);
    }
    await page.close();
    await browser.close();
    process.exit();
})();

