// ========== Status & Billing Helpers ==========
const STATUS_TEXT = { testing: '未上线', online: '已上线', deprecating: '即将下线', offline: '已下线' };
const BILLING_TEXT = { 'pay-per-use': '按量计费', free: '免费', subscription: '包年包月' };

function renderStatusBadge(status, large) {
  if (status === 'online') return '';
  const cls = { testing: 'status-testing', deprecating: 'status-deprecating', offline: 'status-offline' }[status] || '';
  const icons = { testing: '⏳', deprecating: '⚠', offline: '⛔' };
  const sz = large ? 'font-size:14px;padding:4px 12px;' : '';
  return '<span class="status-badge ' + cls + '" style="' + sz + '">' + (icons[status]||'') + ' ' + STATUS_TEXT[status] + '</span>';
}

// ========== Sidebar Rendering ==========
function renderSidebar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navSections = [
    {
      title: '应用开发',
      items: [
        { icon: '📱', label: '应用', href: '#', title: '应用' },
        { icon: '💬', label: '提示词库', href: '#', title: '提示词库' },
        { icon: '📚', label: '知识库', href: '#', title: '知识库' },
        { icon: '🔧', label: '工具', href: '#', title: '工具' },
        { icon: '🏆', label: '效果评测', href: '#', title: '效果评测' }
      ]
    },
    {
      title: '模型服务',
      items: [
        { icon: '🏪', label: '模型广场', href: 'index.html', title: '模型广场' },
        { icon: '⚡', label: '批量推理', href: '#', title: '批量推理' },
        { icon: '🚀', label: '模型部署', href: '#', title: '模型部署' },
        { icon: '🤖', label: '模型管理', href: '#', title: '模型管理' },
        { icon: '🎯', label: '模型精调', href: '#', title: '模型精调' }
      ]
    },
    {
      title: '数据管理',
      items: [
        { icon: '📊', label: '数据集', href: '#', title: '数据集' },
        { icon: '🧹', label: '数据处理', href: '#', title: '数据处理' }
      ]
    },
    {
      title: '管理中心',
      items: [
        { icon: '🔑', label: 'API Key 管理', href: '#', title: 'API Key 管理' },
        { icon: '⚙️', label: '资源管理', href: '#', title: '资源管理' },
        { icon: '⚙️', label: '空间配置', href: '#', title: '空间配置' },
        { icon: '📋', label: '操作记录', href: '#', title: '操作记录' },
        { icon: '📈', label: '用量配置管理', href: 'usage-config.html', title: '用量配置管理' },
        { icon: '🏭', label: '供应商管理', href: 'supplier.html', title: '供应商管理' },
        { icon: '🤖', label: 'Muses 模型管理', href: 'model-management.html', title: 'Muses 模型管理' }
      ]
    }
  ];

  let html = `
    <div class="sb-logo">
      <div class="ico">M</div>
      <span>Muses</span>
    </div>
    <div class="sb-ws">
      <div class="ws-btn" onclick="toggleWsDropdown(event)">
        <span class="ws-av">默</span>
        <span class="ws-name" id="ws-name">默认空间</span>
        <svg class="ws-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 5.5l3 3 3-3" stroke="rgb(135,143,155)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <nav class="sb-nav">
  `;

  navSections.forEach(section => {
    html += `
      <div class="sb-sec">
        <div class="sb-sec-t">${section.title}</div>
    `;
    section.items.forEach(item => {
      const activeClass = item.href === currentPage ? ' on' : '';
      const titleAttr = item.title ? ' title="' + item.title + '"' : '';
      html += `
        <a href="${item.href}" class="sb-i${activeClass}"${titleAttr}>
          <span class="ic">${item.icon}</span>
          <span>${item.label}</span>
        </a>
      `;
    });
    html += '</div>';
  });

  html += `
    </nav>
    <div class="sb-user">
      <div class="sb-user-btn">
        <div class="sb-user-av">王</div>
        <div class="sb-user-info"><span class="sb-user-nm">王颖</span></div>
      </div>
      <div class="sb-user-actions">
        <span class="sb-user-icon" title="设置">⚙️</span>
        <span class="sb-user-icon" title="退出">🚪</span>
      </div>
    </div>
  `;

  return html;
}

const WORKSPACES = [
  { id: 'default', name: '默认空间', initial: '默' },
  { id: 'workspace-a', name: '项目A', initial: 'A' },
  { id: 'workspace-b', name: '项目B', initial: 'B' },
];

function getWorkspaces() {
  try { const d = localStorage.getItem('muses_workspaces'); if (d) return JSON.parse(d); } catch(e) {}
  return [...WORKSPACES];
}

function saveWorkspaces(list) {
  localStorage.setItem('muses_workspaces', JSON.stringify(list));
}

function toggleWsDropdown(e) {
  if (e) e.stopPropagation();
  const dd = document.getElementById('ws-dropdown');
  if (!dd) return;
  const opened = dd.classList.contains('on');
  if (opened) {
    dd.classList.remove('on');
    return;
  }
  document.querySelectorAll('.ws-dropdown.on').forEach(d => d.classList.remove('on'));

  const btn = document.querySelector('.ws-btn');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    dd.style.position = 'fixed';
    dd.style.left = rect.left + 'px';
    dd.style.top = (rect.bottom + 4) + 'px';
    dd.style.width = rect.width + 'px';
    dd.style.minWidth = '180px';
  }

  dd.classList.add('on');
  renderWsList();
  setTimeout(() => {
    document.addEventListener('click', function handler(ev) {
      if (!dd.contains(ev.target) && !ev.target.closest('.ws-btn')) {
        dd.classList.remove('on');
        document.removeEventListener('click', handler);
      }
    });
  }, 0);
}

function renderWsList(filter) {
  const list = document.getElementById('ws-list');
  if (!list) return;
  const ws = getWorkspaces();
  const current = document.querySelector('.ws-name')?.textContent || '默认空间';
  list.innerHTML = ws.filter(w => !filter || w.name.includes(filter)).map(w =>
    '<div class="ws-item' + (w.name === current ? ' on' : '') + '" onclick="selectWs(\'' + w.id + '\')">' +
      '<span class="ws-item-av">' + w.initial + '</span>' +
      '<span>' + w.name + '</span>' +
    '</div>'
  ).join('');
}

function filterWsList(val) {
  renderWsList(val);
}

function closeWsDropdown() {
  document.querySelectorAll('.ws-dropdown.on').forEach(d => d.classList.remove('on'));
}

function selectWs(id) {
  const ws = getWorkspaces().find(w => w.id === id);
  if (!ws) return;
  document.querySelector('.ws-name').textContent = ws.name;
  document.querySelector('.ws-av').textContent = ws.initial;
  closeWsDropdown();
}

function createWs() {
  const name = prompt('输入工作空间名称：');
  if (!name || !name.trim()) return;
  const list = getWorkspaces();
  const id = 'ws-' + Date.now();
  list.push({ id, name: name.trim(), initial: name.trim().charAt(0) });
  saveWorkspaces(list);
  renderWsList();
  selectWs(id);
}

function renderWsDropdown() {
  return '<div class="ws-dropdown" id="ws-dropdown">' +
    '<div class="ws-search">' +
      '<svg class="ws-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#999" stroke-width="1.3"/><path d="M9.5 9.5L13 13" stroke="#999" stroke-width="1.3" stroke-linecap="round"/></svg>' +
      '<input class="ws-search-input" id="ws-search-input" placeholder="搜索空间名称" oninput="filterWsList(this.value)">' +
    '</div>' +
    '<div class="ws-list" id="ws-list"></div>' +
    '<div class="ws-create" onclick="event.stopPropagation();createWs()">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round"/></svg>' +
      '<span>创建空间</span>' +
    '</div>' +
  '</div>';
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = renderSidebar();
    if (!document.getElementById('ws-dropdown')) {
      sidebar.insertAdjacentHTML('afterend', renderWsDropdown());
    }
  }
}

// ========== Compare Selection (localStorage) ==========
function getCompareList() {
  try {
    const data = localStorage.getItem('muses_compare_list');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function setCompareList(list) {
  localStorage.setItem('muses_compare_list', JSON.stringify(list));
  updateCompareButton();
}

function toggleCompare(modelId) {
  let list = getCompareList();
  const idx = list.indexOf(modelId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    if (list.length >= 4) {
      alert('最多可对比 4 个模型');
      return;
    }
    list.push(modelId);
  }
  setCompareList(list);
  return list.indexOf(modelId) >= 0;
}

function isInCompare(modelId) {
  return getCompareList().includes(modelId);
}

function updateCompareButton() {
  const btn = document.getElementById('compareBtn');
  if (!btn) return;
  btn.innerHTML = '模型对比';
}

function goToCompare() {
  window.location.href = 'compare.html';
}

// ========== Utility Functions ==========
function getModelById(id) {
  return MODELS.find(m => m.id === id);
}

function formatContextLength(len) {
  if (len >= 1048576) return (len / 1048576).toFixed(0) + 'M';
  if (len >= 1024) return (len / 1024).toFixed(0) + 'K';
  return len.toString();
}

function formatPrice(price) {
  if (price === 0) return '免费';
  if (price < 0.01) return '$' + price.toFixed(3);
  if (price < 1) return '$' + price.toFixed(2);
  return '$' + price.toFixed(2);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('已复制到剪贴板');
  });
}

function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#1A1E26;color:#fff;padding:10px 24px;border-radius:8px;font-size:14px;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}

function getCategoryTagClass(cat) {
  const map = {
    '文本生成': 'tag-info',
    '图像理解': 'tag-warning',
    '工具调用': 'tag-success',
    '深度思考': 'tag-purple',
    '结构化输出': 'tag-default',
    'Chat': 'tag-info',
    'MoE': 'tag-purple',
    'Reasoning': 'tag-warning',
    'Long Context': 'tag-success',
    'Multimodal': 'tag-info',
    'Open Weight': 'tag-default',
    'Fast': 'tag-success',
    'Compact': 'tag-default',
    'Chinese': 'tag-error',
    'Multilingual': 'tag-info'
  };
  return map[cat] || 'tag-default';
}

function parseWeeklyTokens(s) {
  const num = parseFloat(s);
  if (s.includes('B')) return num * 1000;
  if (s.includes('M')) return num;
  return num;
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ========== Chart Helpers ==========
let chartInstances = [];

function destroyAllCharts() {
  chartInstances.forEach(c => { try { c.destroy(); } catch(e) {} });
  chartInstances = [];
}

function createG2Chart(container, options) {
  if (!window.G2) {
    console.error('G2 library not loaded');
    return null;
  }
  const { Chart } = window.G2;
  const chart = new Chart({
    container: container,
    autoFit: true,
    height: options.height || 300,
    paddingLeft: options.paddingLeft || 40,
    paddingBottom: options.paddingBottom || 40,
  });
  return chart;
}

function renderBarChart(containerId, data, xField, yField, colorField, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || !window.G2) return;
  container.innerHTML = '';
  const { Chart } = window.G2;
  const chart = new Chart({
    container: containerId,
    autoFit: true,
    height: options.height || 300,
  });

  const interval = chart.interval().data(data);
  interval.encode('x', xField).encode('y', yField);
  if (colorField) {
    interval.encode('color', colorField);
  }
  if (options.color) {
    interval.style('fill', options.color);
  }
  chart.axis('x', { title: false }).axis('y', { title: false });
  if (options.legend === false) chart.legend(false);
  chart.render();
  return chart;
}

function renderLineChart(containerId, data, xField, yField, colorField, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || !window.G2) return;
  container.innerHTML = '';
  const { Chart } = window.G2;
  const chart = new Chart({
    container: containerId,
    autoFit: true,
    height: options.height || 300,
  });

  const line = chart.line().data(data);
  line.encode('x', xField).encode('y', yField);
  if (colorField) {
    line.encode('color', colorField);
  }
  line.style('strokeWidth', options.strokeWidth || 2);
  chart.axis('x', { title: false }).axis('y', { title: false });
  if (options.legend === false) chart.legend(false);
  chart.render();
  return chart;
}

function renderAreaChart(containerId, data, xField, yField, colorField, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || !window.G2) return;
  container.innerHTML = '';
  const { Chart } = window.G2;
  const chart = new Chart({
    container: containerId,
    autoFit: true,
    height: options.height || 300,
  });

  const area = chart.area().data(data);
  area.encode('x', xField).encode('y', yField);
  if (colorField) {
    area.encode('color', colorField);
  }
  area.style('fillOpacity', options.fillOpacity || 0.3);

  const line = chart.line().data(data);
  line.encode('x', xField).encode('y', yField);
  if (colorField) {
    line.encode('color', colorField);
  }
  line.style('strokeWidth', options.strokeWidth || 2);

  chart.axis('x', { title: false }).axis('y', { title: false });
  if (options.legend === false) chart.legend(false);
  chart.render();
  return chart;
}

function renderHorizontalBarChart(containerId, data, nameField, valueField, options = {}) {
  const container = document.getElementById(containerId);
  if (!container || !window.G2) return;
  container.innerHTML = '';
  const { Chart } = window.G2;
  const chart = new Chart({
    container: containerId,
    autoFit: true,
    height: options.height || 300,
  });

  chart.coordinate({ type: 'cartesian', transform: [{ type: 'transpose' }] });
  const interval = chart.interval().data(data);
  interval.encode('x', valueField).encode('y', nameField);
  if (options.colorField) {
    interval.encode('color', options.colorField);
  }
  if (options.color) {
    interval.style('fill', options.color);
  }
  chart.axis('x', { title: false }).axis('y', { title: false });
  if (options.legend === false) chart.legend(false);
  chart.render();
  return chart;
}

// ========== Generate Time Series Data ==========
function generateTimeSeriesData(days, baseValue, variance, providers) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = (date.getMonth() + 1) + '/' + date.getDate();
    providers.forEach(p => {
      data.push({
        date: dateStr,
        value: Math.max(0, baseValue[p] + (Math.random() - 0.5) * variance),
        provider: p
      });
    });
  }
  return data;
}

function generateSimpleTimeSeries(days, baseValue, variance) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = (date.getMonth() + 1) + '/' + date.getDate();
    data.push({
      date: dateStr,
      value: Math.max(0, baseValue + (Math.random() - 0.5) * variance)
    });
  }
  return data;
}
