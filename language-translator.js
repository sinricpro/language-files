const api = '';
const googleTranslate = require('google-translate')(api);
const translate = require('translate'); // Old school
const fs = require('fs');

translate.engine = 'google';
translate.key = api;


const sourceFile = ''; //'website.json'; //'backend.json'; //'portal.json';
const sourceDir = 'en';

const target = 'si';
const targetDir = `./${target}/`;
const targetFile = `./${target}/${sourceFile}`;

var en = require(`./${sourceDir}/${sourceFile}`);

async function gtranslate(text) {
    return new Promise((resolve, reject) => {
        googleTranslate.translate(text, target, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.translatedText);
            }
        });
    });
}

async function recursive(en) {
    for (let item of Object.keys(en)) {
        if (typeof en[item] === 'object') {
            await recursive(en[item]);
        } else {
            en[item] = await gtranslate(en[item]);
        }
    }
}

(async () => {
    console.log("Translating...!");

    await recursive(en);

    const jsonContent = JSON.stringify(en);
    console.log(jsonContent);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    fs.writeFile(targetFile, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });

})();