const MOCK_USAGE_CONFIGS = [
  {
    id: 'usage-standard',
    name: '标准限流配置',
    createdAt: '2026-06-01 10:12:36',
    content: { window: '1m', maxRequests: 1000, maxTokens: 200000 }
  },
  {
    id: 'usage-high-throughput',
    name: '高吞吐配置',
    createdAt: '2026-06-02 14:25:18',
    content: { window: '1m', maxRequests: 5000, maxTokens: 1200000, burst: 800 }
  },
  {
    id: 'usage-long-context',
    name: '长上下文配置',
    createdAt: '2026-06-03 09:40:52',
    content: { window: '1h', maxRequests: 600, maxTokens: 8000000, contextOptimized: true }
  },
  {
    id: 'usage-low-latency',
    name: '低延迟配置',
    createdAt: '2026-06-04 16:08:21',
    content: { window: '10s', maxRequests: 300, maxTokens: 60000, priority: 'latency' }
  }
];

let usageConfigNameFilter = '';

function getUsageConfigs() {
  try {
    const stored = localStorage.getItem('muses_usage_configs');
    if (stored) return JSON.parse(stored);
  } catch(e) {}
  return MOCK_USAGE_CONFIGS.map(item => ({ ...item }));
}

function saveUsageConfigs(configs) {
  localStorage.setItem('muses_usage_configs', JSON.stringify(configs));
}

function initUsageConfigPage() {
  initSidebar();
  renderUsageConfigs();
}

function applyUsageConfigFilters() {
  const input = document.getElementById('filterUsageConfigName');
  usageConfigNameFilter = input ? input.value.trim() : '';
  renderUsageConfigs();
}

function getFilteredUsageConfigs() {
  let configs = getUsageConfigs();
  if (usageConfigNameFilter) {
    configs = configs.filter(item => {
      const contentText = JSON.stringify(item.content);
      return item.name.includes(usageConfigNameFilter) || contentText.includes(usageConfigNameFilter);
    });
  }
  return configs;
}

function renderUsageConfigs() {
  const tbody = document.getElementById('usageConfigTableBody');
  if (!tbody) return;
  const configs = getFilteredUsageConfigs();
  tbody.innerHTML = configs.map(config => {
    const contentText = JSON.stringify(config.content, null, 2);
    return '<tr>' +
      '<td>' + escapeUsageHtml(config.name) + '</td>' +
      '<td><pre class="usage-content-cell">' + escapeUsageHtml(contentText) + '</pre></td>' +
      '<td>' + escapeUsageHtml(config.createdAt || '-') + '</td>' +
      '<td><div class="table-actions"><span class="table-action-link" onclick="openUsageConfigDrawer(\'' + config.id + '\')">编辑</span><span class="table-action-link table-action-link-del" onclick="deleteUsageConfig(\'' + config.id + '\')">删除</span></div></td>' +
    '</tr>';
  }).join('');
}

function openUsageConfigDrawer(configId) {
  const configs = getUsageConfigs();
  const config = configId ? configs.find(item => item.id === configId) : null;
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'usageConfigOverlay';
  const drawer = document.createElement('div');
  drawer.className = 'drawer';
  drawer.id = 'usageConfigDrawer';
  drawer.innerHTML =
    '<div class="drawer-header"><h3>' + (config ? '编辑用量配置' : '添加用量配置') + '</h3><button class="drawer-close" onclick="closeUsageConfigDrawer()">✕</button></div>' +
    '<div class="drawer-body">' +
      '<div class="form-group"><label class="form-label">配置名称 <span class="required">*</span></label><input type="text" class="form-input" id="usageConfigName" value="' + escapeUsageAttr(config ? config.name : '') + '" placeholder="请输入配置名称" /></div>' +
      '<div class="form-group"><label class="form-label">内容（JSON） <span class="required">*</span></label><textarea class="form-textarea" id="usageConfigContent" placeholder="{ }">' + escapeUsageHtml(config ? JSON.stringify(config.content, null, 2) : '{\n  "window": "1m",\n  "maxRequests": 1000,\n  "maxTokens": 200000\n}') + '</textarea></div>' +
    '</div>' +
    '<div class="drawer-footer"><button class="btn bc" onclick="closeUsageConfigDrawer()">取消</button><button class="btn bp" onclick="saveUsageConfig(\'' + (config ? config.id : '') + '\')">保存</button></div>';
  overlay.appendChild(drawer);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeUsageConfigDrawer(); });
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.classList.add('open');
    drawer.classList.add('open');
  });
}

function closeUsageConfigDrawer() {
  const overlay = document.getElementById('usageConfigOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  const drawer = document.getElementById('usageConfigDrawer');
  if (drawer) drawer.classList.remove('open');
  setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 250);
}

function saveUsageConfig(configId) {
  const name = document.getElementById('usageConfigName').value.trim();
  if (!name) { showToast('请输入配置名称'); return; }
  const contentRaw = document.getElementById('usageConfigContent').value.trim();
  if (!contentRaw) { showToast('请输入 JSON 内容'); return; }
  let content;
  try {
    content = JSON.parse(contentRaw);
  } catch(e) {
    showToast('JSON 格式不正确');
    return;
  }

  const configs = getUsageConfigs();
  const existingIndex = configId ? configs.findIndex(item => item.id === configId) : -1;
  const next = {
    id: configId || ('usage-' + Date.now()),
    name,
    createdAt: existingIndex >= 0 ? (configs[existingIndex].createdAt || formatUsageDateTime(new Date())) : formatUsageDateTime(new Date()),
    content
  };
  if (existingIndex >= 0) configs[existingIndex] = next;
  else configs.push(next);
  saveUsageConfigs(configs);
  closeUsageConfigDrawer();
  renderUsageConfigs();
  showToast('用量配置已保存');
}

function deleteUsageConfig(configId) {
  if (!confirm('确定要删除该用量配置吗？')) return;
  const configs = getUsageConfigs().filter(item => item.id !== configId);
  saveUsageConfigs(configs);
  renderUsageConfigs();
  showToast('用量配置已删除');
}

function formatUsageDateTime(date) {
  const pad = value => String(value).padStart(2, '0');
  return date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());
}

function escapeUsageHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeUsageAttr(str) {
  return escapeUsageHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

if (document.getElementById('usageConfigTableBody')) {
  document.addEventListener('DOMContentLoaded', initUsageConfigPage);
}
