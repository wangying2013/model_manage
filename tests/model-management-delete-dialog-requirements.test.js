const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const modelManagementJs = fs.readFileSync(path.join(root, 'js', 'model-management.js'), 'utf8');

function assertIncludes(source, text, message) {
  assert(source.includes(text), message || `Expected to include ${text}`);
}

function assertNotIncludes(source, text, message) {
  assert(!source.includes(text), message || `Expected not to include ${text}`);
}

const deleteStart = modelManagementJs.indexOf('function showDeleteConfirm');
const toastStart = modelManagementJs.indexOf('/* ====== Toast ====== */', deleteStart);
const deleteBlock = modelManagementJs.slice(deleteStart, toastStart);

assertIncludes(deleteBlock, "mo.id = 'deleteConfirmMo'", 'delete model should use custom modal id');
assertIncludes(deleteBlock, '<div class="md">', 'delete model should reuse custom modal shell');
assertIncludes(deleteBlock, '<div class="md-h"><h3>删除模型</h3>', 'delete model modal should have custom header');
assertIncludes(deleteBlock, 'closeDeleteConfirm()', 'delete model modal should support closing');
assertIncludes(deleteBlock, 'applyDeleteModel', 'delete model modal should delegate delete action');
assertIncludes(deleteBlock, 'btn btn-danger', 'delete confirm action should use danger button style');
assertNotIncludes(deleteBlock, 'confirm(', 'delete model should not use browser native confirm');

console.log('model management delete dialog requirement checks passed');
