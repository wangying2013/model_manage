const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const modelManagementJs = fs.readFileSync(path.join(root, 'js', 'model-management.js'), 'utf8');
const modelManagementHtml = fs.readFileSync(path.join(root, 'model-management.html'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

assertIncludes(modelManagementJs, '<h4 class="offline-usage-title">使用用户名单</h4>', 'offline dialog should show usage users directly');
assertNotIncludes(modelManagementJs, '查看使用用户名单', 'offline dialog should not require clicking to view usage users');
assertNotIncludes(modelManagementJs, 'toggleUsageUserList', 'offline dialog should not keep usage list toggle behavior');
assertNotIncludes(modelManagementJs, 'style="display:none;margin-top:12px"', 'usage user list should not be hidden by default');

assertIncludes(modelManagementJs, '<th>使用详情</th>', 'usage user list should include usage detail column');
assertIncludes(modelManagementJs, 'u.detail', 'usage user list should render usage detail');
assertIncludes(modelManagementJs, "type: '应用'", 'usage user mock should include application usage');
assertIncludes(modelManagementJs, "type: 'API Key'", 'usage user mock should include API key usage');
assertIncludes(modelManagementJs, "detail: '默认空间 / 智能招聘助手'", 'application usage detail should include workspace and app name');
assertIncludes(modelManagementJs, "detail: '个人'", 'personal API key usage detail should be represented');
assertIncludes(modelManagementJs, "detail: '空间（招聘助手空间）'", 'workspace API key usage detail should be represented');

assertIncludes(modelManagementJs, '使用用户拉群', 'offline dialog group chat copy should be updated');
assertNotIncludes(modelManagementJs, '将使用模型的用户发起群聊', 'old group chat copy should be removed');
assertIncludes(modelManagementJs, 'md-f md-f-split', 'group chat option should move into footer action row');
assertIncludes(modelManagementHtml, '.md-f-split', 'footer split style should exist');

console.log('model management offline dialog requirement checks passed');
