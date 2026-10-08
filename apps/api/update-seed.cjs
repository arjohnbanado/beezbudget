const fs = require('fs');
const path = 'c:/Users/Arjohn Banado/Documents/mainProject/beezbudget/apps/api/src/database/seeds/currencies.seed.ts';
const content = fs.readFileSync(path, 'utf8');

const apiDataPath = 'C:/Users/Arjohn Banado/.gemini/antigravity/brain/ac71aa6f-afa2-42a4-a85f-f1f5ba5f5117/.system_generated/steps/111/content.md';
const mdContent = fs.readFileSync(apiDataPath, 'utf8');
const jsonStr = mdContent.split('---')[1].trim();
const apiCurrencies = JSON.parse(jsonStr);

let newContent = content.replace(/const currencies = \[\s*([\s\S]*?)\] as const;/, (match, arrayContent) => {
  let newArrayContent = arrayContent.replace(/\{([^}]+)\}/g, (objMatch, objContent) => {
    const codeMatch = objContent.match(/code:\s*'([A-Z]{3})'/);
    if (!codeMatch) return objMatch;
    const code = codeMatch[1];
    const apiObj = apiCurrencies.find(c => c.iso_code === code);
    let symbolStr = 'null';
    if (apiObj && apiObj.symbol) {
      symbolStr = "'" + apiObj.symbol.replace(/'/g, "\\'") + "'";
    }
    // ensure we don't duplicate
    if (objContent.includes('symbol:')) return objMatch;
    
    return '{' + objContent.trim() + ', symbol: ' + symbolStr + ' }';
  });
  return 'const currencies = [\n  ' + newArrayContent + '\n] as const;';
});

// Fix the upsert
if (!newContent.includes('symbol: currency.symbol')) {
  newContent = newContent.replace(/minorUnit: currency\.minorUnit,\n\s*isSelectable: currency\.isSelectable,/, 'minorUnit: currency.minorUnit,\n        isSelectable: currency.isSelectable,\n        symbol: currency.symbol,');
}

fs.writeFileSync(path, newContent);
console.log('Seed updated');
