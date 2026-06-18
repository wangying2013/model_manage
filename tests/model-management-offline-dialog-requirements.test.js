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

assertIncludes(modelManagementJs, '<h4 class="offline-usage-title">模型使用名单</h4>', 'offline dialog should show model usage list title');
assertNotIncludes(modelManagementJs, '<h4 class="offline-usage-title">使用清单</h4>', 'offline dialog should not keep old usage checklist title');
assertNotIncludes(modelManagementJs, '<h4 class="offline-usage-title">使用用户名单</h4>', 'offline dialog should not use old usage user list title');
assertNotIncludes(modelManagementJs, '查看使用用户名单', 'offline dialog should not require clicking to view usage users');
assertNotIncludes(modelManagementJs, 'toggleUsageUserList', 'offline dialog should not keep usage list toggle behavior');
assertNotIncludes(modelManagementJs, 'style="display:none;margin-top:12px"', 'usage user list should not be hidden by default');

assertIncludes(modelManagementJs, '<th>使用类型</th><th>使用详情</th><th>负责人</th><th>最近一次使用时间</th>', 'usage checklist columns should use requested order');
assertIncludes(modelManagementJs, '<th>使用详情</th>', 'usage user list should include usage detail column');
assertNotIncludes(modelManagementJs, '<th>用户名称</th>', 'usage checklist should not keep old user name column');
assertIncludes(modelManagementJs, 'u.detail', 'usage user list should render usage detail');
assertIncludes(modelManagementJs, 'u.owner', 'usage checklist should render owner');
assertIncludes(modelManagementJs, "type: '应用'", 'usage user mock should include application usage');
assertIncludes(modelManagementJs, "type: 'API Key'", 'usage user mock should include API key usage');
assertIncludes(modelManagementJs, "detail: '默认空间 / 智能招聘助手'", 'application usage detail should include workspace and app name');
assertIncludes(modelManagementJs, "detail: '个人'", 'personal API key usage detail should be represented');
assertIncludes(modelManagementJs, "detail: '空间（招聘助手空间）'", 'workspace API key usage detail should be represented');

assertIncludes(modelManagementJs, '将使用用户发起 BossHi 群聊', 'offline dialog group chat copy should be updated');
assertNotIncludes(modelManagementJs, '用户拉群', 'offline dialog should not keep old short group chat copy');
assertNotIncludes(modelManagementJs, '使用用户拉群', 'offline dialog should not use old group chat copy');
assertNotIncludes(modelManagementJs, '将使用模型的用户发起群聊', 'old group chat copy should be removed');
assertIncludes(modelManagementJs, 'offlineMessageField', 'offline dialog should show message content when group chat is checked');
assertIncludes(modelManagementJs, 'offlineNotifyMessage', 'offline dialog should include notification message textarea');
assertIncludes(modelManagementJs, 'generateOfflineNotifyMessage', 'offline notification message should be generated from model/date/replacement');
assertIncludes(modelManagementJs, 'toggleOfflineMessageField', 'offline notification message should toggle with group chat');
assertIncludes(modelManagementJs, 'updateOfflineNotifyMessage', 'offline notification message should update when date or replacement changes');
assertIncludes(modelManagementHtml, '.md-f-split', 'footer split style should exist');
assertIncludes(modelManagementHtml, '.offline-usage-table {', 'offline usage table should have local styles');
assertIncludes(modelManagementHtml, 'min-width: 0', 'offline usage table should override global table min width');
assertIncludes(modelManagementHtml, 'table-layout: fixed', 'offline usage table should fit inside the dialog');
assertIncludes(modelManagementHtml, 'overflow-wrap: anywhere', 'offline usage table cells should wrap long content');
assertIncludes(modelManagementJs, '发起下线', 'online model action should use initiate offline copy');
assertNotIncludes(modelManagementJs, '>下线</span>', 'online model action should not use short offline copy');
assertIncludes(modelManagementJs, '完成下线', 'final offline action should use complete offline copy');
assertNotIncludes(modelManagementJs, '>确认下线</span>', 'final offline action should not use old confirm copy');
assertIncludes(modelManagementJs, '<button class="btn bp" onclick="applyFinalOffline', 'final offline primary button should be blue');
assertNotIncludes(modelManagementJs, 'btn btn-danger" onclick="applyFinalOffline', 'final offline action should not use danger button styling');

console.log('model management offline dialog requirement checks passed');
