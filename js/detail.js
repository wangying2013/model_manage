let currentModel = null;
let currentTab = 'providers';
let currentCapabilityTaskId = 'resume-screening';

function initDetailPage() {
  initSidebar();
  updateCompareButton();

  const params = new URLSearchParams(window.location.search);
  const modelId = params.get('id');
  if (!modelId) {
    document.querySelector('.main-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-text">未指定模型ID</div></div>';
    return;
  }

  currentModel = findModelFromParam(modelId);
  if (!currentModel) {
    document.querySelector('.main-content').innerHTML = '<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-text">未找到该模型</div></div>';
    return;
  }

  renderDetailHeader();
  renderStatCards();
  bindTabEvents();
  renderTabContent(currentTab);
}

function renderDetailHeader() {
  const m = currentModel;
  const headerEl = document.getElementById('detailHeader');

  let deprecationInline = '';
  if (m.status === 'deprecating' && m.deprecatingInfo) {
    deprecationInline = '<span class="deprecation-inline">将于 ' + m.deprecatingInfo.scheduledOfflineDate + ' 下线，替代模型：' + m.deprecatingInfo.replacementModelName + '</span>';
  }

  headerEl.innerHTML =
    '<div class="detail-topbar">' +
      '<div class="detail-topbar-left">' +
        '<button class="detail-back-btn" onclick="window.location.href=\'index.html\'" aria-label="返回模型广场">←</button>' +
        '<span class="detail-page-title">模型详情</span>' +
      '</div>' +
      '<div class="detail-model-actions">' +
        '<button class="btn bc" onclick="window.location.href=\'compare.html?id=' + encodeURIComponent(m.id) + '\'">模型对比</button>' +
        '<button class="btn bp" onclick="applyAuth()">申请授权</button>' +
      '</div>' +
    '</div>' +
    '<div class="detail-model-header">' +
      '<div class="detail-model-left">' +
        '<div class="model-icon-lg" style="background:' + m.iconColor + '">' + m.icon + '</div>' +
        '<div class="detail-model-info">' +
          '<div class="detail-model-name-row">' +
            '<h1 class="detail-model-name">' + m.name + '</h1>' +
            renderStatusBadge(m.status, true) +
            deprecationInline +
          '</div>' +
          '<div class="detail-model-meta-row">' +
            '<span class="detail-model-id">' + m.id + '</span>' +
            '<button class="btn bt btn-sm copy-id-btn" data-id="' + m.id + '" title="复制ID">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="detail-model-desc">' + m.description + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  headerEl.querySelector('.copy-id-btn').addEventListener('click', function() {
    copyToClipboard(this.dataset.id);
  });
}

function findModelFromParam(modelId) {
  const candidates = [modelId, String(modelId || '').trim()];
  try {
    candidates.push(decodeURIComponent(modelId));
  } catch (e) {}
  try {
    candidates.push(encodeURIComponent(modelId));
  } catch (e) {}

  const models = typeof getModels === 'function' ? [...getModels(), ...MODELS] : MODELS;
  return models.find(model => {
    const ids = [model.id, model._replacesId].filter(Boolean);
    return ids.some(id => candidates.includes(id) || candidates.includes(encodeURIComponent(id)));
  }) || null;
}

function renderStatCards() {
  const m = currentModel;
  const inputCapabilities = formatCapabilityList(m.inputModalities);
  const outputCapabilities = formatCapabilityList(m.outputTypes);
  const statsEl = document.getElementById('statCards');
  statsEl.innerHTML =
    '<div class="stat-card"><div class="stat-card-label">模型来源</div><div class="stat-card-value stat-card-text">' + getModelSource(m) + '</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">上下文长度</div><div class="stat-card-value">' + (m.contextLength > 0 ? formatContextLength(m.contextLength) : 'N/A') + '</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">输入能力</div><div class="stat-card-value stat-card-text">' + inputCapabilities + '</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">输出能力</div><div class="stat-card-value stat-card-text">' + outputCapabilities + '</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">近 7日调用量</div><div class="stat-card-value">' + m.weeklyTokens + ' tokens</div></div>' +
    '<div class="stat-card"><div class="stat-card-label">上线时间</div><div class="stat-card-value stat-card-text">' + m.releasedDate + '</div></div>';
}

function formatCapabilityList(items) {
  const map = { text: '文本', image: '图片', audio: '音频', video: '视频' };
  return (items || []).map(item => map[item] || item).join('、') || 'N/A';
}

function bindTabEvents() {
  document.querySelectorAll('.dtab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.dtab').forEach(t => t.classList.remove('on'));
      this.classList.add('on');
      currentTab = this.dataset.tab;
      renderTabContent(currentTab);
    });
  });
}

function renderTabContent(tab) {
  destroyAllCharts();
  const contentEl = document.getElementById('tabContent');
  if (!contentEl) return;

  switch (tab) {
    case 'capability':
      contentEl.innerHTML = renderCapabilityTab();
      bindCapabilityEvents();
      break;
    case 'apps':
      contentEl.innerHTML = renderAppsTab();
      setTimeout(renderAppsMetricCharts, 100);
      break;
    case 'quota':
      contentEl.innerHTML = renderQuotaTab();
      break;
    case 'providers':
      contentEl.innerHTML = renderProvidersTab();
      break;
    case 'changelog':
      contentEl.innerHTML = renderChangelogTab();
      break;
  }
}

// ========== Providers Tab ==========
function renderProvidersTab() {
  const m = currentModel;

  function formatProviderPrice(value) {
    return typeof value === 'number' ? formatPrice(value) + '/1M tokens' : 'N/A';
  }

  const providerCards = m.providers.map(p => {
    const isAvailable = p.status === 'online' || p.status === 'available';
    const statusText = isAvailable ? '可用' : '异常';
    const statusClass = isAvailable ? 'provider-status-available' : 'provider-status-abnormal';
    const latencyP99 = p.latencyP99 !== undefined ? p.latencyP99 : p.latency;
    const oneDayErrorRate = p.oneDayErrorRate !== undefined ? p.oneDayErrorRate : p.errorRate;
    const currentThroughput = p.currentThroughput !== undefined ? p.currentThroughput : p.throughput;
    const availableThroughput = p.availableThroughput !== undefined ? p.availableThroughput : p.throughput;
    const priceConfig = [
      { label: '输入单价', value: p.inputPrice !== undefined ? p.inputPrice : m.inputPrice },
      { label: '命中缓存输入单价', value: p.cacheHitInputPrice !== undefined ? p.cacheHitInputPrice : m.cacheHitPrice },
      { label: '5m写入缓存输入单价', value: p.cacheWrite5mInputPrice },
      { label: '1h写入缓存输入单价', value: p.cacheWrite1hInputPrice },
      { label: '显式命中缓存输入单价', value: p.explicitCacheHitInputPrice },
      { label: '输出单价', value: p.outputPrice !== undefined ? p.outputPrice : m.outputPrice }
    ];

    return '<div class="card provider-card" style="padding:20px;margin-bottom:12px">' +
      '<div class="provider-card-header">' +
        '<div class="provider-status-dot ' + (isAvailable ? 'online' : 'abnormal') + '"></div>' +
        '<strong style="font-size:15px">' + p.name + '</strong>' +
        '<span class="provider-status-tag ' + statusClass + '" style="margin-left:8px">' + statusText + '</span>' +
      '</div>' +
      '<div class="provider-card-stats" style="grid-template-columns:repeat(3, 1fr);margin-top:12px">' +
        '<div class="provider-stat"><span class="stat-label">延迟p99</span><span class="stat-value">' + latencyP99 + 'ms</span></div>' +
        '<div class="provider-stat"><span class="stat-label">吞吐量</span><span class="stat-value">' + currentThroughput + '/' + availableThroughput + ' tok/s</span></div>' +
        '<div class="provider-stat"><span class="stat-label">近一天调用错误率</span><span class="stat-value">' + oneDayErrorRate + '%</span></div>' +
      '</div>' +
      '<div class="provider-price-config">' +
        priceConfig.map(item =>
          '<div class="provider-stat"><span class="stat-label">' + item.label + '</span><span class="stat-value">' + formatProviderPrice(item.value) + '</span></div>'
        ).join('') +
      '</div>' +
    '</div>';
  }).join('');

  const sorted = [...m.providers].sort((a, b) => a.failoverPriority - b.failoverPriority);
  const failoverItems = sorted.map(p => {
    const pc = p.failoverPriority <= 1 ? 'p1' : p.failoverPriority <= 2 ? 'p2' : 'p3';
    return '<div class="failover-item"><span class="priority-badge ' + pc + '">' + p.failoverPriority + '</span><strong>' + p.name + '</strong><span style="color:var(--text-secondary);font-size:13px">— ' + p.failoverStrategy + '</span></div>';
  }).join('');

  return '<div class="tab-section"><h3 class="section-title">供应商详情</h3>' + providerCards + '</div>' +
    '<div class="tab-section mt-20"><h3 class="section-title">故障转移策略</h3><div class="card" style="padding:20px">' +
    '<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">当高优先级供应商发生故障时，系统将自动切换到下一优先级供应商，确保服务连续性。</p>' +
    '<div class="failover-section">' + failoverItems + '</div></div></div>';
}

// ========== Capability Tab ==========
function renderCapabilityTab() {
  const tasks = getRecruitmentCapabilityTasks();
  const selected = tasks.find(task => task.id === currentCapabilityTaskId) || tasks[0];
  currentCapabilityTaskId = selected.id;

  const taskCards = tasks.map(task => {
    return '<button class="cap-task-card ' + (task.id === selected.id ? 'on' : '') + '" data-task-id="' + task.id + '">' +
      '<span class="cap-task-score">' + task.score + '</span>' +
      '<span class="cap-task-main"><span class="cap-task-name">' + task.name + '</span><span class="cap-task-desc">' + task.summary + '</span></span>' +
    '</button>';
  }).join('');

  const metrics = [
    { label: '回答准确率', value: selected.metrics.accuracy + '%', level: selected.metrics.accuracy },
    { label: '结构化程度', value: selected.metrics.structure + '%', level: selected.metrics.structure },
    { label: '请求延迟', value: selected.metrics.latency + 'ms', level: Math.max(0, 100 - selected.metrics.latency / 20) }
  ].map(metric => {
    return '<div class="cap-metric">' +
      '<div class="cap-metric-label">' + metric.label + '</div>' +
      '<div class="cap-metric-value">' + metric.value + '</div>' +
      '<div class="cap-metric-bar"><span style="width:' + Math.min(100, metric.level) + '%"></span></div>' +
    '</div>';
  }).join('');

  return '<div class="tab-section tab-section-white capability-layout">' +
    '<div class="cap-task-list">' +
      '<h3 class="section-title">求职招聘任务</h3>' +
      '<div class="cap-task-cards">' + taskCards + '</div>' +
    '</div>' +
    '<div class="cap-task-detail">' +
      '<div class="cap-detail-head">' +
        '<div><div class="cap-detail-title">' + selected.name + '</div><div class="cap-detail-sub">能力评分 <strong>' + selected.score + '</strong>/100</div></div>' +
        '<button class="btn bc btn-sm" id="toggleTaskDetail">查看任务详情</button>' +
      '</div>' +
      '<div class="cap-detail-section"><div class="cap-detail-label">任务说明</div><p>' + selected.description + '</p></div>' +
      '<div class="cap-detail-extra" id="taskDetailExtra">' +
        '<div class="cap-detail-label">任务详细信息</div>' +
        '<p>' + selected.detail + '</p>' +
      '</div>' +
      '<div class="cap-detail-section"><div class="cap-detail-label">指标数据</div><div class="cap-metrics-grid">' + metrics + '</div></div>' +
    '</div>' +
  '</div>';
}

function bindCapabilityEvents() {
  document.querySelectorAll('.cap-task-card').forEach(card => {
    card.addEventListener('click', function() {
      currentCapabilityTaskId = this.dataset.taskId;
      document.getElementById('tabContent').innerHTML = renderCapabilityTab();
      bindCapabilityEvents();
    });
  });

  const toggle = document.getElementById('toggleTaskDetail');
  const extra = document.getElementById('taskDetailExtra');
  if (toggle && extra) {
    toggle.addEventListener('click', function() {
      extra.classList.toggle('on');
      this.textContent = extra.classList.contains('on') ? '收起任务详情' : '查看任务详情';
    });
  }
}

function getRecruitmentCapabilityTasks() {
  return [
    {
      id: 'resume-screening',
      name: '简历初筛',
      summary: '从候选人简历中判断岗位匹配度',
      score: 92,
      description: '根据招聘岗位要求，提取候选人的工作年限、核心技能、项目经验和风险点，给出是否进入面试的建议。',
      detail: '输入包含 JD、候选人简历和筛选规则；输出需要包含匹配结论、关键证据、待确认问题和结构化评分。',
      metrics: { accuracy: 94, structure: 91, latency: 860 }
    },
    {
      id: 'interview-question',
      name: '面试题生成',
      summary: '为不同岗位生成结构化面试问题',
      score: 88,
      description: '结合岗位职责和候选人履历，生成技术能力、项目复盘、沟通协作和稳定性四类面试问题。',
      detail: '要求问题按难度分层，并为每个问题提供考察点、追问方向和参考优秀回答特征。',
      metrics: { accuracy: 89, structure: 93, latency: 1020 }
    },
    {
      id: 'candidate-summary',
      name: '候选人画像总结',
      summary: '沉淀候选人的优势、短板与面试关注点',
      score: 90,
      description: '将简历、电话沟通记录和测评结果合并为招聘团队可快速浏览的候选人画像。',
      detail: '输出需包含核心优势、潜在风险、薪资动机、岗位适配度和建议面试官重点验证的问题。',
      metrics: { accuracy: 91, structure: 90, latency: 780 }
    },
    {
      id: 'job-description',
      name: '职位描述优化',
      summary: '优化 JD 表述并提升招聘转化',
      score: 86,
      description: '根据招聘目标、团队亮点和候选人画像，重写职位描述，使要求清晰、表达友好且避免歧义。',
      detail: '需要保留硬性要求，区分必备与加分项，并输出面向候选人的亮点版本和面向内部的评估口径。',
      metrics: { accuracy: 87, structure: 88, latency: 690 }
    },
    {
      id: 'offer-risk',
      name: 'Offer 风险评估',
      summary: '评估候选人接受 offer 的概率与阻力',
      score: 84,
      description: '基于候选人的求职动机、薪资预期、竞品进展和沟通记录，识别 offer 阶段的风险因素。',
      detail: '输出需要包含风险等级、风险原因、建议推进动作和 HRBP 可使用的沟通话术。',
      metrics: { accuracy: 85, structure: 86, latency: 930 }
    }
  ];
}

function applyAuth() {
  if (!currentModel) return;
  alert('已提交授权申请，请等待模型提供方审核。\n模型：' + currentModel.name);
}

// ========== Apps Tab ==========
function renderAppsTab() {
  return '<div class="tab-section"><div class="apps-layout">' +
    '<div class="apps-chart-head"><h3 class="section-title">近 7 天调用情况</h3></div>' +
    '<div class="apps-chart-grid">' +
      renderAppsChartPanel('调用次数', 'callCountChart') +
      renderAppsChartPanel('调用成功率', 'successRateChart') +
      renderAppsChartPanel('P90 延迟趋势', 'p90LatencyChart') +
      renderAppsChartPanel('TPS 吞吐趋势', 'tpsThroughputChart') +
    '</div>' +
    '</div></div>';
}

function renderAppsChartPanel(title, id) {
  return '<div class="apps-chart-panel">' +
    '<div class="chart-title">' + title + '</div>' +
    '<div id="' + id + '" class="chart-container" style="height:260px"></div>' +
  '</div>';
}

function renderAppsMetricCharts() {
  chartInstances.forEach(c => { try { c.destroy(); } catch(e) {} });
  chartInstances = [];

  if (!window.G2) return;

  getAppsMetricChartConfigs().forEach(config => {
    if (!document.getElementById(config.id)) return;
    const chart = config.type === 'bar'
      ? renderBarChart(config.id, config.data, 'date', 'value', null, { height: 260, legend: false, color: config.color })
      : renderLineChart(config.id, config.data, 'date', 'value', null, { height: 260, legend: false, color: config.color });
    if (chart) chartInstances.push(chart);
  });
}

function getMockModelApps() {
  return [
    { name: '智能招聘助手', type: 'HR SaaS', description: '自动完成简历解析、岗位匹配和候选人摘要生成。', owner: '李倩', weeklyCalls: 128600 },
    { name: '面试官 Copilot', type: '内部效率工具', description: '根据候选人画像生成面试问题和追问建议。', owner: '周明', weeklyCalls: 96320 },
    { name: 'JD 优化工坊', type: '内容生成', description: '帮助招聘团队批量优化职位描述和招聘亮点。', owner: '陈思', weeklyCalls: 74280 },
    { name: '人才库问答', type: '知识检索', description: '面向历史候选人库做自然语言检索和推荐。', owner: '王颖', weeklyCalls: 58640 },
    { name: 'Offer 风险看板', type: '数据分析', description: '汇总候选人沟通记录并预测 offer 接受风险。', owner: '赵航', weeklyCalls: 42190 },
    { name: '校招批量评估', type: '批处理', description: '对校招简历与测评报告进行批量评分。', owner: '刘晨', weeklyCalls: 31880 }
  ];
}

function getRecentSevenDayCallUsageData() {
  return [
    { date: '5/30', calls: 18620, successRate: 98.2, p90Latency: 228, tps: 42 },
    { date: '5/31', calls: 17480, successRate: 98.6, p90Latency: 216, tps: 39 },
    { date: '6/1', calls: 20340, successRate: 99.1, p90Latency: 205, tps: 46 },
    { date: '6/2', calls: 22160, successRate: 98.8, p90Latency: 212, tps: 51 },
    { date: '6/3', calls: 23890, successRate: 99.3, p90Latency: 198, tps: 56 },
    { date: '6/4', calls: 22940, successRate: 99.0, p90Latency: 207, tps: 53 },
    { date: '6/5', calls: 25180, successRate: 99.4, p90Latency: 192, tps: 61 }
  ];
}

function getAppsMetricChartConfigs() {
  const data = getRecentSevenDayCallUsageData();
  return [
    {
      id: 'callCountChart',
      title: '调用次数',
      type: 'bar',
      color: '#1C64F2',
      data: data.map(item => ({ date: item.date, value: item.calls }))
    },
    {
      id: 'successRateChart',
      title: '调用成功率',
      type: 'line',
      color: '#10B981',
      data: data.map(item => ({ date: item.date, value: item.successRate }))
    },
    {
      id: 'p90LatencyChart',
      title: 'P90 延迟趋势',
      type: 'line',
      color: '#F59E0B',
      data: data.map(item => ({ date: item.date, value: item.p90Latency }))
    },
    {
      id: 'tpsThroughputChart',
      title: 'TPS 吞吐趋势',
      type: 'line',
      color: '#7C3AED',
      data: data.map(item => ({ date: item.date, value: item.tps }))
    }
  ];
}

function formatCallCount(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万次';
  return num + '次';
}

// ========== Quota Tab ==========
function renderQuotaTab() {
  const quota = getMockModelQuota();
  const summary = [
    { key: 'concurrency', label: '并发', unit: '', available: quota.available.concurrency, allocated: quota.allocated.concurrency },
    { key: 'tokenLimit', label: 'Token 限流', unit: ' TPM', available: quota.available.tokenLimit, allocated: quota.allocated.tokenLimit },
    { key: 'qps', label: 'QPS', unit: '', available: quota.available.qps, allocated: quota.allocated.qps }
  ].map(item => {
    const oversold = Math.max(0, item.allocated - item.available);
    const ratio = Math.round(item.allocated / item.available * 100);
    return '<div class="quota-summary-card">' +
      '<div class="quota-summary-head"><span>' + item.label + '</span>' + (oversold > 0 ? '<em>超卖 ' + formatQuotaValue(oversold) + item.unit + '</em>' : '<em class="ok">未超卖</em>') + '</div>' +
      '<div class="quota-summary-values">' +
        '<div><span class="quota-value">' + formatQuotaValue(item.allocated) + '</span><span class="quota-label">已分配出去' + item.unit + '</span></div>' +
        '<div><span class="quota-value muted">' + formatQuotaValue(item.available) + '</span><span class="quota-label">平台可用' + item.unit + '</span></div>' +
      '</div>' +
      '<div class="quota-progress"><span style="width:' + Math.min(100, ratio) + '%"></span></div>' +
      '<div class="quota-ratio">已分配 / 可用：' + ratio + '%</div>' +
    '</div>';
  }).join('');

  const rows = quota.allocations.map(item => {
    const typeClass = item.type === '工作空间' ? 'workspace' : 'api';
    return '<tr>' +
      '<td><span class="quota-type ' + typeClass + '">' + item.type + '</span></td>' +
      '<td>' + item.name + '</td>' +
      '<td>' + item.owner + '</td>' +
      '<td>' + item.concurrency + '</td>' +
      '<td>' + formatQuotaValue(item.tokenLimit) + ' TPM</td>' +
      '<td>' + item.qps + '</td>' +
      '<td>' + item.applyDate + '</td>' +
    '</tr>';
  }).join('');

  return '<div class="tab-section quota-section">' +
    '<div class="quota-summary-grid">' + summary + '</div>' +
    '<div class="quota-table-wrap">' +
      '<h3 class="section-title">额度分配明细</h3>' +
      '<div class="card quota-table-card"><table class="quota-table"><thead><tr><th>使用类型</th><th>名称</th><th>负责人</th><th>并发量</th><th>Token 限流</th><th>QPS</th><th>申请日期</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '</div>' +
  '</div>';
}

function getMockModelQuota() {
  return {
    available: { concurrency: 260, tokenLimit: 2400000, qps: 520 },
    allocated: { concurrency: 324, tokenLimit: 2920000, qps: 648 },
    allocations: [
      { type: '工作空间', name: '默认空间', owner: '李倩', concurrency: 72, tokenLimit: 680000, qps: 140, applyDate: '2026-06-05' },
      { type: '工作空间', name: '招聘助手空间', owner: '周明', concurrency: 58, tokenLimit: 520000, qps: 112, applyDate: '2026-06-04' },
      { type: 'API Key', name: '智能招聘助手 API Key', owner: '李倩', concurrency: 46, tokenLimit: 410000, qps: 96, applyDate: '2026-06-03' },
      { type: '工作空间', name: '数据分析空间', owner: '赵航', concurrency: 52, tokenLimit: 460000, qps: 104, applyDate: '2026-06-02' },
      { type: 'API Key', name: '面试官 Copilot API Key', owner: '周明', concurrency: 38, tokenLimit: 340000, qps: 74, applyDate: '2026-06-01' },
      { type: '工作空间', name: '算法平台部', owner: '王颖', concurrency: 34, tokenLimit: 300000, qps: 66, applyDate: '2026-05-31' },
      { type: 'API Key', name: 'Offer 风险看板 API Key', owner: '陈思', concurrency: 24, tokenLimit: 210000, qps: 56, applyDate: '2026-05-30' }
    ]
  };
}

function formatQuotaValue(num) {
  if (num >= 10000) return (num / 10000).toFixed(num % 10000 === 0 ? 0 : 1) + '万';
  return String(num);
}

function renderChangelogTab() {
  const m = currentModel;
  const entries = getModelManagementChangeLogs(m).map(item => {
    return '<div class="changelog-entry simple"><span class="changelog-date">' + item.time + '</span><span class="changelog-desc">' + item.desc + '</span></div>';
  }).join('');
  return '<div class="tab-section"><h3 class="section-title">变更记录</h3><div class="changelog-timeline">' + (entries||'<div class="empty-state"><div class="empty-state-text">暂无变更记录</div></div>') + '</div></div>';
}

function getModelManagementChangeLogs(model) {
  const name = model.name || model.id;
  const providerName = model.providers && model.providers[0] ? model.providers[0].name : (model.author || 'Muses Cloud');
  const replacement = model.deprecatingInfo && model.deprecatingInfo.replacementModelName ? model.deprecatingInfo.replacementModelName : 'prem/qwen3-235b-a22b';

  return [
    { time: '2026-06-05 15:42:36', desc: '模型信息更新：更新模型“' + name + '”的模型介绍、能力标签、上下文长度与最大输出长度。' },
    { time: '2026-06-05 14:57:44', desc: '新增供应商：新增供应商“' + providerName + '”，并完成供应商模型名称绑定。' },
    { time: '2026-06-05 14:12:08', desc: '去除供应商：去除供应商“OpenAI Proxy”，该供应商不再承载此模型调用。' },
    { time: '2026-06-05 13:50:32', desc: '模型上线：模型“' + name + '”已上线，可在模型广场申请授权并发起调用。' },
    { time: '2026-06-04 18:24:17', desc: '发起下线：设置预计下线时间、替代模型“' + replacement + '”，并通知正在使用该模型的用户。' }
  ];
}

document.addEventListener('DOMContentLoaded', initDetailPage);
