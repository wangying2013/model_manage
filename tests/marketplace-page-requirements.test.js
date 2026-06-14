const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const modelsJs = fs.readFileSync(path.join(root, 'js', 'models.js'), 'utf8');

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertNotIncludes(indexHtml, 'id="statusFilter"', 'marketplace should not render status filter');
assertNotIncludes(indexHtml, '全部状态', 'marketplace should not render all status option');
assertNotIncludes(modelsJs, 'statusFilter', 'marketplace filter logic should not read status filter');

console.log('marketplace page requirement checks passed');
