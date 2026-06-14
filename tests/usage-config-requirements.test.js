const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const commonJs = read('js/common.js');
const supplierJs = read('js/supplier.js');

assert(fs.existsSync(path.join(root, 'usage-config.html')), 'usage config management page should exist');
assert(fs.existsSync(path.join(root, 'js/usage-config.js')), 'usage config management script should exist');

const usageHtml = read('usage-config.html');
const usageJs = read('js/usage-config.js');

assert(commonJs.includes('用量配置管理'), 'sidebar should include usage config management');
assert(commonJs.includes('usage-config.html'), 'sidebar should link to usage config page');

assert(usageHtml.includes('用量配置管理'), 'usage page should render title');
assert(usageHtml.includes('filterUsageConfigName'), 'usage page should support name filter');
assert(usageHtml.includes('搜索配置名称/内容'), 'usage filter should search config name and content');
assert(usageHtml.includes('添加用量配置'), 'usage page should support creating configs');
assert(usageHtml.includes('usage-config.js'), 'usage page should load its script');
assert(usageHtml.includes('<th style="width:160px">创建时间</th>'), 'usage config list should include created time column');

assert(usageJs.includes('MOCK_USAGE_CONFIGS'), 'usage configs should have mock data');
assert(usageJs.includes('muses_usage_configs'), 'usage configs should persist to localStorage');
assert(usageJs.includes('renderUsageConfigs'), 'usage page should render list');
assert(usageJs.includes('saveUsageConfig'), 'usage page should support add/edit save');
assert(usageJs.includes('deleteUsageConfig'), 'usage page should support deletion');
assert(usageJs.includes('createdAt'), 'usage configs should carry created time');
assert(usageJs.includes('JSON.stringify(item.content)'), 'usage filter should search content');

const mockCount = (usageJs.match(/id: 'usage-/g) || []).length;
assert(mockCount >= 3 && mockCount <= 5, 'usage config mock data should contain 3-5 items');

assert(supplierJs.includes('getUsageConfigs'), 'supplier model drawer should read usage configs');
assert(supplierJs.includes('<select'), 'usage config in supplier model should be a select');
assert(supplierJs.includes('data-protocol-usage'), 'supplier model should store selected usage config per protocol');
assert(supplierJs.includes('protocolUsage'), 'supplier model should persist protocol usage config');
assert(!supplierJs.includes('data-field="usageConfig" value='), 'old usage config text input should be removed');

console.log('usage config requirement checks passed');
