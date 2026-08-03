const { translate } = require('@vitalets/google-translate-api');
const path = require('path');
const fs = require('fs');

const enJsonPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const taJsonPath = path.join(__dirname, 'src', 'i18n', 'locales', 'ta.json');

const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// We need to recursively translate string values
async function translateObject(obj) {
    const keys = Object.keys(obj);
    const result = {};
    for (const key of keys) {
        if (typeof obj[key] === 'string') {
            try {
                const res = await translate(obj[key], {to: 'ta'});
                result[key] = res.text;
                console.log(`Translated ${key}: ${res.text}`);
            } catch (err) {
                console.error(`Error translating ${key}:`, err);
                result[key] = obj[key]; // fallback to english
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = await translateObject(obj[key]);
        } else {
            result[key] = obj[key];
        }
        // Small delay to avoid rate limit
        await new Promise(r => setTimeout(r, 150));
    }
    return result;
}

async function run() {
    console.log('Starting translation of en.json to Tamil...');
    const translatedData = await translateObject(enData);
    
    // Convert to JSON and escape all non-ASCII characters as \uXXXX
    const jsonStr = JSON.stringify(translatedData, null, 2);
    const escapedStr = jsonStr.replace(/[\u007F-\uFFFF]/g, function(chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
    });
    
    fs.writeFileSync(taJsonPath, escapedStr, 'utf8');
    console.log('Translation complete and saved to ta.json');
}

run().catch(console.error);

async function main() {
    console.log('Starting translation of en.json to Tamil...');
    const translatedData = await translateObject(enData);
    fs.writeFileSync(taJsonPath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log('Finished translating to ta.json!');
}

main().catch(console.error);
