const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const modelsJs = fs.readFileSync(path.join(root, 'js', 'models.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertNotIncludes(indexHtml, 'id="statusFilter"', 'marketplace should not render status filter');
assertNotIncludes(indexHtml, '全部状态', 'marketplace should not render all status option');
assertNotIncludes(modelsJs, 'statusFilter', 'marketplace filter logic should not read status filter');
assertIncludes(modelsJs, 'isMarketplaceVisibleModel', 'marketplace should explicitly filter model status');
assertIncludes(modelsJs, "m.status === 'online' || m.status === 'deprecating'", 'marketplace should only show online and deprecating models');
assertIncludes(modelsJs, 'getModelOnlineTime', 'marketplace should sort by online time');
assertIncludes(indexHtml, '最新上线', 'default sort copy should use latest online');
assertIncludes(indexHtml, '最新发布', 'sort options should include latest release');
assertIncludes(modelsJs, 'getModelReleaseTime', 'marketplace should sort latest release by release time');
assertIncludes(modelsJs, 'case \'release\'', 'marketplace sort should support release option');
assertIncludes(modelsJs, 'a.outputPrice - b.outputPrice', 'lowest price should sort by reference output price');
assertNotIncludes(modelsJs, '(a.inputPrice + a.outputPrice) - (b.inputPrice + b.outputPrice)', 'lowest price should not sort by input plus output price');
assertIncludes(modelsJs, '发布日期', 'marketplace cards should use release date copy');
assertIncludes(modelsJs, '外部采购', 'hybrid service type should display as external purchase');
assertNotIncludes(modelsJs, '混合服务', 'marketplace should not use old hybrid service copy');
assertNotIncludes(modelsJs, '上线日期', 'marketplace should not use old online date copy');
assertNotIncludes(modelsJs, '热门', 'marketplace card should remove hot badge');
assertIncludes(modelsJs, 'card-badge-new">上新', 'marketplace card should keep new badge copy');
assertNotIncludes(modelsJs, 'card-badge-new">上线', 'online models should not show online badge');
['status: "testing"', 'status: "online"', 'status: "deprecating"', 'status: "offline"'].forEach(text => {
  assertIncludes(dataJs, text, `mock data should include ${text}`);
});

console.log('marketplace page requirement checks passed');
