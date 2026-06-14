const MODELS = [
  {
    id: "prem/qwen3-235b-a22b",
    name: "prem/qwen3-235b-a22b",
    author: "通义",
    description: "Qwen3 旗舰 MoE 模型，总参数量 235B，激活参数量 22B，提供顶级的推理与多语言能力。",
    icon: "Q",
    iconColor: "#6366F1",
    categories: ["文本生成", "工具调用", "深度思考"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 131072,
    inputPrice: 0.14,
    outputPrice: 0.42,
    cacheHitPrice: 0.07,
    cacheMissPrice: 0.14,
    weeklyTokens: "1.2B",
    parameters: "235B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-15",
    license: "Apache 2.0",
    trainingCutoff: "2026-03",
    isNew: true,
    status: "online",
    updatedAt: "2026-05-10",
    externalSourcing: false,
    serviceType: 'local',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 120, latencyP99: 188, throughput: 85, currentThroughput: 42, availableThroughput: 85, uptime: 99.95, errorRate: 0.05, oneDayErrorRate: 0.04, inputPrice: 0.14, cacheHitInputPrice: 0.07, cacheWrite5mInputPrice: 0.18, cacheWrite1hInputPrice: 0.16, explicitCacheHitInputPrice: 0.05, outputPrice: 0.42, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AliCloud", status: "online", latency: 95, latencyP99: 156, throughput: 92, currentThroughput: 36, availableThroughput: 92, uptime: 99.98, errorRate: 0.02, oneDayErrorRate: 0.03, inputPrice: 0.14, cacheHitInputPrice: 0.07, cacheWrite5mInputPrice: 0.17, cacheWrite1hInputPrice: 0.15, explicitCacheHitInputPrice: 0.05, outputPrice: 0.42, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "abnormal", latency: 110, latencyP99: 420, throughput: 48, currentThroughput: 48, availableThroughput: 48, uptime: 99.90, errorRate: 0.10, oneDayErrorRate: 1.26, inputPrice: 0.14, cacheHitInputPrice: 0.07, cacheWrite5mInputPrice: 0.19, cacheWrite1hInputPrice: 0.17, explicitCacheHitInputPrice: 0.06, outputPrice: 0.42, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 89.2, humaneval: 82.1, gsm8k: 94.5, hellaswag: 88.7, arc: 93.1, truthfulqa: 72.4 },
    changelog: [
      { date: "2026-04-15", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Qwen3 235B-A22B" }, { type: "Added", desc: "Support for 128K context window" }] },
      { date: "2026-04-22", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved instruction following accuracy" }, { type: "Fixed", desc: "Fixed rare tokenization edge case" }] }
    ],
    apps: [
      { name: "智能客服", description: "企业级多轮对话客服系统", users: "12K+" },
      { name: "代码助手", description: "支持多语言代码生成与补全", users: "8K+" }
    ]
  },
  {
    id: "vend/deepseek-r1-0528",
    name: "vend/deepseek-r1-0528",
    author: "深度思索",
    description: "DeepSeek 最新推理模型，具备增强的思维链能力与卓越的数学问题求解能力。",
    icon: "D",
    iconColor: "#0EA5E9",
    categories: ["文本生成", "深度思考"],
    outputTypes: ["text"],
    inputModalities: ["text"],
    contextLength: 131072,
    inputPrice: 0.18,
    outputPrice: 0.55,
    cacheHitPrice: 0.09,
    cacheMissPrice: 0.18,
    weeklyTokens: "980M",
    parameters: "685B",
    architecture: "MoE Transformer",
    releasedDate: "2026-05-28",
    license: "MIT",
    trainingCutoff: "2026-04",
    isNew: true,
    status: "testing",
    updatedAt: "2026-05-20",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 180, throughput: 62, uptime: 99.92, errorRate: 0.08, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "DeepSeek API", status: "online", latency: 150, throughput: 70, uptime: 99.95, errorRate: 0.05, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 165, throughput: 65, uptime: 99.88, errorRate: 0.12, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 92.1, humaneval: 88.5, gsm8k: 97.2, hellaswag: 89.3, arc: 94.8, truthfulqa: 78.6 },
    changelog: [
      { date: "2026-05-28", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of DeepSeek R1-0528" }, { type: "Added", desc: "Enhanced reasoning with extended CoT" }] }
    ],
    apps: [
      { name: "数学解题", description: "高精度数学推理与解题", users: "6K+" },
      { name: "研究助手", description: "学术文献分析与综述生成", users: "4K+" }
    ]
  },
  {
    id: "vend/doubao-pro-256k",
    name: "vend/doubao-pro-256k",
    author: "通义",
    description: "字节跳动旗舰生产模型，针对长上下文理解与企业级应用优化，支持 256K 上下文窗口。",
    icon: "豆",
    iconColor: "#F59E0B",
    categories: ["文本生成"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 262144,
    inputPrice: 0.08,
    outputPrice: 0.24,
    cacheHitPrice: 0.04,
    cacheMissPrice: 0.08,
    weeklyTokens: "2.1B",
    parameters: "180B",
    architecture: "Dense Transformer",
    releasedDate: "2026-03-10",
    license: "Proprietary",
    trainingCutoff: "2026-02",
    isHot: true,
    status: "online",
    updatedAt: "2026-05-08",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 85, throughput: 95, uptime: 99.97, errorRate: 0.03, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 65, throughput: 100, uptime: 99.99, errorRate: 0.01, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "ByteDance API", status: "online", latency: 70, throughput: 98, uptime: 99.98, errorRate: 0.02, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 85.6, humaneval: 78.2, gsm8k: 91.0, hellaswag: 86.5, arc: 90.2, truthfulqa: 69.8 },
    changelog: [
      { date: "2026-03-10", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release with 256K context" }] },
      { date: "2026-04-01", version: "v1.1.0", changes: [{ type: "Changed", desc: "Improved Chinese understanding" }, { type: "Fixed", desc: "Reduced hallucination rate by 15%" }] }
    ],
    apps: [
      { name: "文档问答", description: "超长文档理解与问答", users: "25K+" },
      { name: "内容创作", description: "营销文案与创意写作", users: "18K+" }
    ]
  },
  {
    id: "vend/claude-4-opus",
    name: "vend/claude-4-opus",
    author: "Anthropic",
    description: "Anthropic 最强模型，擅长复杂分析、创造性任务和精细推理，支持扩展思维能力。",
    icon: "C",
    iconColor: "#D97706",
    categories: ["文本生成", "工具调用", "深度思考", "结构化输出"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 200000,
    inputPrice: 15.0,
    outputPrice: 75.0,
    cacheHitPrice: 7.50,
    cacheMissPrice: 15.0,
    cacheWritePrice: 18.75,
    weeklyTokens: "560M",
    parameters: "~2T",
    architecture: "Dense Transformer",
    releasedDate: "2026-02-20",
    license: "Proprietary",
    trainingCutoff: "2026-01",
    status: "deprecating",
    updatedAt: "2026-04-15",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    deprecatingInfo: { scheduledOfflineDate: "2026-06-30", replacementModel: "vend/claude-4-sonnet", replacementModelName: "vend/claude-4-sonnet" },
    providers: [
      { name: "Muses Cloud", status: "online", latency: 250, throughput: 35, uptime: 99.90, errorRate: 0.10, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AWS Bedrock", status: "online", latency: 220, throughput: 40, uptime: 99.95, errorRate: 0.05, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "GCP Vertex", status: "online", latency: 230, throughput: 38, uptime: 99.93, errorRate: 0.07, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 93.5, humaneval: 91.2, gsm8k: 96.8, hellaswag: 91.0, arc: 95.5, truthfulqa: 82.1 },
    changelog: [
      { date: "2026-02-20", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Claude 4 Opus" }, { type: "Added", desc: "Extended thinking with 100K token budget" }] },
      { date: "2026-03-15", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved tool use reliability" }, { type: "Changed", desc: "Better instruction following in edge cases" }] }
    ],
    apps: [
      { name: "法律分析", description: "复杂法律文档分析与推理", users: "3K+" },
      { name: "编程助手", description: "全栈代码生成与调试", users: "7K+" }
    ]
  },
  {
    id: "vend/gpt-5-turbo",
    name: "vend/gpt-5-turbo",
    author: "OpenAI",
    description: "OpenAI 最快的 GPT-5 变体，以 Turbo 速度提供接近 Opus 级别的质量，专为生产负载优化。",
    icon: "G",
    iconColor: "#10B981",
    categories: ["文本生成", "图像理解", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text", "image", "audio"],
    contextLength: 128000,
    inputPrice: 2.5,
    outputPrice: 10.0,
    cacheHitPrice: 1.25,
    cacheMissPrice: 2.5,
    weeklyTokens: "3.8B",
    parameters: "~1.5T",
    architecture: "Dense Transformer",
    releasedDate: "2026-01-15",
    license: "Proprietary",
    trainingCutoff: "2025-12",
    isHot: true,
    status: "online",
    updatedAt: "2026-05-12",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "subscription",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 160, throughput: 55, uptime: 99.92, errorRate: 0.08, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Azure OpenAI", status: "online", latency: 140, throughput: 60, uptime: 99.96, errorRate: 0.04, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "OpenAI API", status: "online", latency: 130, throughput: 65, uptime: 99.94, errorRate: 0.06, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 92.8, humaneval: 89.6, gsm8k: 96.1, hellaswag: 90.5, arc: 95.0, truthfulqa: 80.3 },
    changelog: [
      { date: "2026-01-15", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial GPT-5 Turbo release" }] },
      { date: "2026-02-01", version: "v1.0.2", changes: [{ type: "Fixed", desc: "Improved JSON mode consistency" }, { type: "Changed", desc: "Faster streaming first token latency" }] },
      { date: "2026-03-01", version: "v1.1.0", changes: [{ type: "Added", desc: "Native audio input support" }] }
    ],
    apps: [
      { name: "智能办公", description: "文档处理与会议纪要生成", users: "45K+" },
      { name: "对话机器人", description: "多模态对话交互平台", users: "32K+" }
    ]
  },
  {
    id: "vend/gemini-3-pro",
    name: "vend/gemini-3-pro",
    author: "Gemini",
    description: "Google Gemini 3 Pro，原生多模态能力，支持文本、图像、音频和视频输入，拥有 1M 上下文窗口。",
    icon: "G",
    iconColor: "#3B82F6",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image", "audio", "video"],
    contextLength: 1048576,
    inputPrice: 1.25,
    outputPrice: 5.0,
    cacheHitPrice: 0.63,
    cacheMissPrice: 1.25,
    weeklyTokens: "1.5B",
    parameters: "~400B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-01",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    status: "online",
    updatedAt: "2026-05-05",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 200, throughput: 48, uptime: 99.88, errorRate: 0.12, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "GCP Vertex", status: "online", latency: 170, throughput: 55, uptime: 99.94, errorRate: 0.06, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Google AI", status: "online", latency: 180, throughput: 50, uptime: 99.92, errorRate: 0.08, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 91.5, humaneval: 86.8, gsm8k: 95.2, hellaswag: 89.8, arc: 94.2, truthfulqa: 76.9 },
    changelog: [
      { date: "2026-04-01", version: "v1.0.0", changes: [{ type: "Added", desc: "1M context window support" }, { type: "Added", desc: "Native video understanding" }] }
    ],
    apps: [
      { name: "视频理解", description: "长视频内容分析与摘要", users: "5K+" },
      { name: "多模态搜索", description: "图文音视频统一检索", users: "9K+" }
    ]
  },
  {
    id: "vend/llama-4-maverick",
    name: "vend/llama-4-maverick",
    author: "OpenAI",
    description: "Meta 开源权重 MoE 模型，总参数量 400B，激活参数量 17B，针对效率与质量进行了优化。",
    icon: "L",
    iconColor: "#8B5CF6",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 1048576,
    inputPrice: 0.20,
    outputPrice: 0.60,
    cacheHitPrice: 0.10,
    cacheMissPrice: 0.20,
    weeklyTokens: "780M",
    parameters: "400B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-05",
    license: "Llama Community",
    trainingCutoff: "2026-02",
    status: "online",
    updatedAt: "2026-04-28",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 135, throughput: 72, uptime: 99.93, errorRate: 0.07, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Together AI", status: "online", latency: 110, throughput: 80, uptime: 99.90, errorRate: 0.10, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Fireworks", status: "online", latency: 115, throughput: 78, uptime: 99.91, errorRate: 0.09, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 88.5, humaneval: 80.3, gsm8k: 92.8, hellaswag: 87.9, arc: 91.8, truthfulqa: 71.2 },
    changelog: [
      { date: "2026-04-05", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial open-weight release" }, { type: "Added", desc: "1M context with RoPE scaling" }] }
    ],
    apps: [
      { name: "开放研究", description: "学术研究与实验平台", users: "15K+" },
      { name: "私有部署", description: "企业私有化部署方案", users: "8K+" }
    ]
  },
  {
    id: "vend/mistral-large-3",
    name: "vend/mistral-large-3",
    author: "OpenAI",
    description: "Mistral 最强模型，强大的多语言支持与函数调用能力，针对欧洲语言进行了优化。",
    icon: "M",
    iconColor: "#F97316",
    categories: ["文本生成", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 128000,
    inputPrice: 2.0,
    outputPrice: 6.0,
    cacheHitPrice: 1.0,
    cacheMissPrice: 2.0,
    weeklyTokens: "340M",
    parameters: "123B",
    architecture: "Dense Transformer",
    releasedDate: "2026-03-20",
    license: "Proprietary",
    trainingCutoff: "2026-02",
    status: "online",
    updatedAt: "2026-04-20",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 105, throughput: 76, uptime: 99.95, errorRate: 0.05, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Azure AI", status: "online", latency: 95, throughput: 82, uptime: 99.97, errorRate: 0.03, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Mistral API", status: "online", latency: 90, throughput: 85, uptime: 99.96, errorRate: 0.04, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 87.8, humaneval: 79.5, gsm8k: 91.5, hellaswag: 86.2, arc: 90.5, truthfulqa: 70.1 },
    changelog: [
      { date: "2026-03-20", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Mistral Large 3" }, { type: "Added", desc: "Native function calling with parallel execution" }] }
    ],
    apps: [
      { name: "多语言翻译", description: "高质量欧洲语言翻译", users: "7K+" },
      { name: "代码审查", description: "自动化代码审查与建议", users: "4K+" }
    ]
  },
  {
    id: "vend/yi-lightning-r2",
    name: "vend/yi-lightning-r2",
    author: "通义",
    description: "01.AI 超快推理模型，在生产应用中提供卓越的速度与质量比。",
    icon: "Y",
    iconColor: "#EC4899",
    categories: ["文本生成"],
    outputTypes: ["text"],
    inputModalities: ["text"],
    contextLength: 65536,
    inputPrice: 0.05,
    outputPrice: 0.15,
    cacheHitPrice: 0.03,
    cacheMissPrice: 0.05,
    weeklyTokens: "1.8B",
    parameters: "34B",
    architecture: "Dense Transformer",
    releasedDate: "2026-05-10",
    license: "Apache 2.0",
    trainingCutoff: "2026-04",
    status: "deprecating",
    updatedAt: "2026-05-15",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 16384,
    deprecatingInfo: { scheduledOfflineDate: "2026-07-15", replacementModel: "vend/qwen3-32b", replacementModelName: "vend/qwen3-32b" },
    providers: [
      { name: "Muses Cloud", status: "online", latency: 45, throughput: 150, uptime: 99.98, errorRate: 0.02, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "01.AI API", status: "online", latency: 38, throughput: 160, uptime: 99.99, errorRate: 0.01, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 50, throughput: 145, uptime: 99.97, errorRate: 0.03, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 82.3, humaneval: 74.5, gsm8k: 88.2, hellaswag: 83.1, arc: 86.5, truthfulqa: 65.8 },
    changelog: [
      { date: "2026-05-10", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release with ultra-low latency" }] }
    ],
    apps: [
      { name: "实时对话", description: "低延迟实时聊天应用", users: "22K+" },
      { name: "内容审核", description: "实时文本内容审核", users: "14K+" }
    ]
  },
  {
    id: "vend/chatglm4-9b",
    name: "vend/chatglm4-9b",
    author: "智谱",
    description: "智谱轻量级双语模型，适合边缘部署与资源受限环境，兼顾性能与效率。",
    icon: "智",
    iconColor: "#14B8A6",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 32768,
    inputPrice: 0.02,
    outputPrice: 0.06,
    cacheHitPrice: 0.01,
    cacheMissPrice: 0.02,
    weeklyTokens: "950M",
    parameters: "9B",
    architecture: "Dense Transformer",
    releasedDate: "2026-02-28",
    license: "Apache 2.0",
    trainingCutoff: "2026-01",
    status: "online",
    updatedAt: "2026-05-01",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 8192,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 30, throughput: 200, uptime: 99.99, errorRate: 0.01, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Zhipu API", status: "online", latency: 25, throughput: 220, uptime: 99.99, errorRate: 0.01, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 35, throughput: 190, uptime: 99.98, errorRate: 0.02, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 76.5, humaneval: 68.2, gsm8k: 82.1, hellaswag: 78.8, arc: 82.3, truthfulqa: 60.5 },
    changelog: [
      { date: "2026-02-28", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of ChatGLM4 9B" }] },
      { date: "2026-03-15", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved bilingual alignment" }, { type: "Changed", desc: "Better tool use format" }] }
    ],
    apps: [
      { name: "端侧助手", description: "手机端智能助手", users: "35K+" },
      { name: "本地知识库", description: "私有化知识库问答", users: "12K+" }
    ]
  },
  {
    id: "vend/baichuan4-turbo",
    name: "vend/baichuan4-turbo",
    author: "通义",
    description: "百川最新模型，具备深厚的中国文化理解能力，针对国内企业场景进行了优化。",
    icon: "百",
    iconColor: "#EF4444",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 128000,
    inputPrice: 0.06,
    outputPrice: 0.18,
    cacheHitPrice: 0.03,
    cacheMissPrice: 0.06,
    weeklyTokens: "620M",
    parameters: "72B",
    architecture: "Dense Transformer",
    releasedDate: "2026-04-20",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    status: "online",
    updatedAt: "2026-05-06",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 16384,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 75, throughput: 110, uptime: 99.96, errorRate: 0.04, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Baichuan API", status: "online", latency: 60, throughput: 120, uptime: 99.98, errorRate: 0.02, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AliCloud", status: "online", latency: 80, throughput: 105, uptime: 99.94, errorRate: 0.06, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 83.8, humaneval: 75.6, gsm8k: 89.5, hellaswag: 84.2, arc: 87.5, truthfulqa: 67.2 },
    changelog: [
      { date: "2026-04-20", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Baichuan4 Turbo" }] }
    ],
    apps: [
      { name: "政务问答", description: "政务服务智能咨询系统", users: "8K+" },
      { name: "教育辅导", description: "K12智能教育辅导", users: "16K+" }
    ]
  },
  {
    id: "vend/claude-4-sonnet",
    name: "vend/claude-4-sonnet",
    author: "Anthropic",
    description: "Anthropic 新一代旗舰模型，在推理、编程和安全性方面均有显著提升，支持超长思维链。",
    icon: "C",
    iconColor: "#D97706",
    categories: ["文本生成", "工具调用", "深度思考", "结构化输出"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 200000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    cacheHitPrice: 1.50,
    cacheMissPrice: 3.0,
    cacheWritePrice: 3.75,
    weeklyTokens: "890M",
    parameters: "~800B",
    architecture: "Dense Transformer",
    releasedDate: "2026-04-10",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    isNew: true,
    status: "online",
    updatedAt: "2026-05-18",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 190, throughput: 45, uptime: 99.93, errorRate: 0.07, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AWS Bedrock", status: "online", latency: 170, throughput: 50, uptime: 99.96, errorRate: 0.04, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "GCP Vertex", status: "online", latency: 185, throughput: 47, uptime: 99.94, errorRate: 0.06, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 94.8, humaneval: 93.1, gsm8k: 97.5, hellaswag: 92.3, arc: 96.2, truthfulqa: 84.6 },
    changelog: [
      { date: "2026-04-10", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Claude 4 Sonnet" }, { type: "Added", desc: "Extended thinking with 200K token budget" }] },
      { date: "2026-04-25", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved tool use reliability across edge cases" }] },
      { date: "2026-05-10", version: "v1.1.0", changes: [{ type: "Added", desc: "New structured output mode for JSON schemas" }, { type: "Changed", desc: "Reduced refusal rate on benign prompts" }] }
    ],
    apps: [
      { name: "企业分析", description: "深度商业分析与决策支持", users: "5K+" },
      { name: "安全编码", description: "安全优先的代码生成与审计", users: "9K+" }
    ]
  },
  {
    id: "vend/openai-o3",
    name: "vend/openai-o3",
    author: "OpenAI",
    description: "OpenAI 最强推理模型，具有卓越的逻辑推理、数学和编码能力，支持自适应思维预算。",
    icon: "O",
    iconColor: "#10B981",
    categories: ["文本生成", "深度思考", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 200000,
    inputPrice: 10.0,
    outputPrice: 40.0,
    cacheHitPrice: 5.0,
    cacheMissPrice: 10.0,
    weeklyTokens: "420M",
    parameters: "~2T",
    architecture: "Dense Transformer",
    releasedDate: "2026-03-01",
    license: "Proprietary",
    trainingCutoff: "2026-01",
    isHot: true,
    status: "online",
    updatedAt: "2026-05-15",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 131072,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 280, throughput: 30, uptime: 99.88, errorRate: 0.12, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "OpenAI Proxy", status: "online", latency: 250, throughput: 35, uptime: 99.92, errorRate: 0.08, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Azure OpenAI", status: "online", latency: 260, throughput: 33, uptime: 99.90, errorRate: 0.10, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 96.2, humaneval: 94.5, gsm8k: 98.1, hellaswag: 93.8, arc: 97.0, truthfulqa: 86.3 },
    changelog: [
      { date: "2026-03-01", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of o3 reasoning model" }, { type: "Added", desc: "Adaptive thinking budget (low/medium/high)" }] },
      { date: "2026-03-20", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved chain-of-thought consistency" }] },
      { date: "2026-04-10", version: "v1.1.0", changes: [{ type: "Added", desc: "Vision reasoning support" }, { type: "Changed", desc: "30% faster reasoning on medium budget" }] }
    ],
    apps: [
      { name: "科学计算", description: "高精度数学与科学计算", users: "4K+" },
      { name: "竞赛编程", description: "算法竞赛解题与优化", users: "6K+" }
    ]
  },
  {
    id: "vend/gpt-5",
    name: "vend/gpt-5",
    author: "OpenAI",
    description: "OpenAI GPT-5 旗舰模型，集推理、多模态和创造力于一身，Turbo 之上的完全体。",
    icon: "G",
    iconColor: "#059669",
    categories: ["文本生成", "图像理解", "工具调用", "深度思考"],
    outputTypes: ["text"],
    inputModalities: ["text", "image", "audio"],
    contextLength: 256000,
    inputPrice: 5.0,
    outputPrice: 20.0,
    cacheHitPrice: 2.5,
    cacheMissPrice: 5.0,
    weeklyTokens: "2.5B",
    parameters: "~3T",
    architecture: "Dense Transformer",
    releasedDate: "2026-05-01",
    license: "Proprietary",
    trainingCutoff: "2026-04",
    isNew: true,
    isHot: true,
    status: "online",
    updatedAt: "2026-05-20",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "subscription",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 200, throughput: 42, uptime: 99.90, errorRate: 0.10, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "OpenAI Proxy", status: "online", latency: 175, throughput: 48, uptime: 99.93, errorRate: 0.07, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Azure OpenAI", status: "online", latency: 185, throughput: 45, uptime: 99.95, errorRate: 0.05, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 95.5, humaneval: 92.8, gsm8k: 97.8, hellaswag: 92.5, arc: 96.5, truthfulqa: 85.1 },
    changelog: [
      { date: "2026-05-01", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of GPT-5 flagship" }, { type: "Added", desc: "256K context window" }, { type: "Added", desc: "Multi-modal reasoning (text + image + audio)" }] }
    ],
    apps: [
      { name: "通用助手", description: "全场景智能助手", users: "60K+" },
      { name: "多模态创作", description: "图文音一体化创作平台", users: "28K+" }
    ]
  },
  {
    id: "vend/deepseek-v3-0324",
    name: "vend/deepseek-v3-0324",
    author: "深度思索",
    description: "DeepSeek 最新 Dense 模型，在编码、数学和推理方面显著提升，训练效率业界领先。",
    icon: "D",
    iconColor: "#0284C7",
    categories: ["文本生成", "工具调用", "深度思考"],
    outputTypes: ["text"],
    inputModalities: ["text"],
    contextLength: 65536,
    inputPrice: 0.14,
    outputPrice: 0.42,
    cacheHitPrice: 0.07,
    cacheMissPrice: 0.14,
    weeklyTokens: "1.6B",
    parameters: "685B",
    architecture: "Dense Transformer",
    releasedDate: "2026-03-24",
    license: "MIT",
    trainingCutoff: "2026-02",
    isHot: true,
    status: "online",
    updatedAt: "2026-05-12",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 130, throughput: 75, uptime: 99.94, errorRate: 0.06, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "DeepSeek API", status: "online", latency: 110, throughput: 82, uptime: 99.97, errorRate: 0.03, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 140, throughput: 70, uptime: 99.92, errorRate: 0.08, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 91.0, humaneval: 86.3, gsm8k: 95.8, hellaswag: 89.5, arc: 93.8, truthfulqa: 76.2 },
    changelog: [
      { date: "2026-03-24", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of DeepSeek V3-0324" }, { type: "Added", desc: "Multi-token prediction training" }, { type: "Changed", desc: "Improved FP8 training efficiency" }] },
      { date: "2026-04-15", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Enhanced code generation accuracy" }, { type: "Changed", desc: "Lower latency for streaming outputs" }] }
    ],
    apps: [
      { name: "代码生成", description: "多语言代码生成与补全", users: "18K+" },
      { name: "数据清洗", description: "智能化数据清洗与转换", users: "7K+" }
    ]
  },
  {
    id: "vend/gemini-3-flash",
    name: "vend/gemini-3-flash",
    author: "Gemini",
    description: "Google Gemini 3 Flash，速度优化的多模态模型，以极低成本提供卓越性能，适合大规模生产部署。",
    icon: "G",
    iconColor: "#2563EB",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image", "audio", "video"],
    contextLength: 1048576,
    inputPrice: 0.08,
    outputPrice: 0.30,
    cacheHitPrice: 0.04,
    cacheMissPrice: 0.08,
    weeklyTokens: "4.2B",
    parameters: "~60B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-01",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    isHot: true,
    status: "online",
    updatedAt: "2026-05-08",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 75, throughput: 120, uptime: 99.97, errorRate: 0.03, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Google AI", status: "online", latency: 55, throughput: 140, uptime: 99.99, errorRate: 0.01, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "GCP Vertex", status: "online", latency: 65, throughput: 130, uptime: 99.98, errorRate: 0.02, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 88.9, humaneval: 82.4, gsm8k: 93.5, hellaswag: 87.2, arc: 91.0, truthfulqa: 73.5 },
    changelog: [
      { date: "2026-04-01", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Gemini 3 Flash" }, { type: "Added", desc: "1M context with sliding window attention" }] },
      { date: "2026-04-20", version: "v1.0.1", changes: [{ type: "Changed", desc: "40% higher throughput" }, { type: "Fixed", desc: "Improved video understanding accuracy" }] }
    ],
    apps: [
      { name: "批处理任务", description: "大规模数据批处理与分析", users: "20K+" },
      { name: "视频摘要", description: "长视频快速摘要与标注", users: "11K+" }
    ]
  },
  {
    id: "vend/llama-4-scout",
    name: "vend/llama-4-scout",
    author: "OpenAI",
    description: "Meta Llama 4 Scout，轻量级开源模型，17B 激活参数支持 1M 上下文，适合本地和边缘部署。",
    icon: "L",
    iconColor: "#7C3AED",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 1048576,
    inputPrice: 0.04,
    outputPrice: 0.12,
    cacheHitPrice: 0.02,
    cacheMissPrice: 0.04,
    weeklyTokens: "1.1B",
    parameters: "109B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-05",
    license: "Llama Community",
    trainingCutoff: "2026-02",
    status: "online",
    updatedAt: "2026-04-28",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 16384,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 55, throughput: 160, uptime: 99.98, errorRate: 0.02, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Together AI", status: "online", latency: 45, throughput: 180, uptime: 99.96, errorRate: 0.04, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "本地部署", status: "online", latency: 20, throughput: 250, uptime: 100.0, errorRate: 0.0, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 84.2, humaneval: 75.8, gsm8k: 89.0, hellaswag: 84.5, arc: 88.2, truthfulqa: 68.5 },
    changelog: [
      { date: "2026-04-05", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial open-weight release" }, { type: "Added", desc: "1M context with 17B active params" }] }
    ],
    apps: [
      { name: "边缘推理", description: "端侧与边缘设备推理", users: "10K+" },
      { name: "文档处理", description: "长文档提取与分类", users: "13K+" }
    ]
  },
  {
    id: "vend/grok-3",
    name: "vend/grok-3",
    author: "OpenAI",
    description: "xAI Grok 3，具备实时知识访问和强大推理能力的对话模型，幽默而精准。",
    icon: "G",
    iconColor: "#1A1A2E",
    categories: ["文本生成", "深度思考", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 131072,
    inputPrice: 0.60,
    outputPrice: 2.40,
    cacheHitPrice: 0.30,
    cacheMissPrice: 0.60,
    weeklyTokens: "520M",
    parameters: "~500B",
    architecture: "MoE Transformer",
    releasedDate: "2026-04-20",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    isNew: true,
    status: "online",
    updatedAt: "2026-05-16",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 155, throughput: 58, uptime: 99.91, errorRate: 0.09, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "xAI API", status: "online", latency: 135, throughput: 65, uptime: 99.94, errorRate: 0.06, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 90.5, humaneval: 84.6, gsm8k: 94.2, hellaswag: 88.0, arc: 92.5, truthfulqa: 79.8 },
    changelog: [
      { date: "2026-04-20", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Grok 3" }, { type: "Added", desc: "Real-time web search integration" }, { type: "Added", desc: "Fun Mode with adjustable personality" }] },
      { date: "2026-05-05", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved citation accuracy" }, { type: "Changed", desc: "Lower latency for common queries" }] }
    ],
    apps: [
      { name: "实时资讯", description: "实时新闻分析与热点追踪", users: "6K+" },
      { name: "科研探索", description: "开放科学问题研究与讨论", users: "3K+" }
    ]
  },
  {
    id: "vend/kimi-k2",
    name: "vend/kimi-k2",
    author: "月之暗面",
    description: "月之暗面 Kimi K2，百万级超长上下文模型，在长文档理解与多轮对话中表现卓越。",
    icon: "K",
    iconColor: "#E11D48",
    categories: ["文本生成", "深度思考"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 1048576,
    inputPrice: 0.12,
    outputPrice: 0.36,
    cacheHitPrice: 0.06,
    cacheMissPrice: 0.12,
    weeklyTokens: "680M",
    parameters: "~100B",
    architecture: "Dense Transformer",
    releasedDate: "2026-05-15",
    license: "Proprietary",
    trainingCutoff: "2026-04",
    isNew: true,
    isHot: true,
    status: "online",
    updatedAt: "2026-05-22",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 65536,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 145, throughput: 68, uptime: 99.92, errorRate: 0.08, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 120, throughput: 78, uptime: 99.95, errorRate: 0.05, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Moonshot API", status: "online", latency: 100, throughput: 85, uptime: 99.97, errorRate: 0.03, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 86.8, humaneval: 78.9, gsm8k: 91.8, hellaswag: 85.5, arc: 89.5, truthfulqa: 71.8 },
    changelog: [
      { date: "2026-05-15", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Kimi K2" }, { type: "Added", desc: "1M context with Ring Attention" }, { type: "Added", desc: "Deep search mode for long-form Q&A" }] }
    ],
    apps: [
      { name: "长文理解", description: "超长文档深度理解与问答", users: "9K+" },
      { name: "合同审查", description: "法律合同智能审查", users: "4K+" }
    ]
  },
  {
    id: "vend/minimax-m1",
    name: "vend/minimax-m1",
    author: "MiniMax",
    description: "MiniMax M1，基于 Linear Attention 的高效模型，在长序列任务中具有明显的速度和成本优势。",
    icon: "M",
    iconColor: "#DB2777",
    categories: ["文本生成", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 1048576,
    inputPrice: 0.10,
    outputPrice: 0.30,
    cacheHitPrice: 0.05,
    cacheMissPrice: 0.10,
    weeklyTokens: "450M",
    parameters: "~50B",
    architecture: "Linear Attention Transformer",
    releasedDate: "2026-04-28",
    license: "Proprietary",
    trainingCutoff: "2026-03",
    status: "online",
    updatedAt: "2026-05-10",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 16384,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 60, throughput: 145, uptime: 99.96, errorRate: 0.04, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AliCloud", status: "online", latency: 50, throughput: 155, uptime: 99.98, errorRate: 0.02, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "MiniMax API", status: "online", latency: 42, throughput: 170, uptime: 99.99, errorRate: 0.01, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 85.1, humaneval: 76.3, gsm8k: 90.2, hellaswag: 84.0, arc: 87.8, truthfulqa: 68.9 },
    changelog: [
      { date: "2026-04-28", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of MiniMax-M1" }, { type: "Added", desc: "Linear attention for efficient long context" }] }
    ],
    apps: [
      { name: "客服系统", description: "智能客服对话系统", users: "14K+" },
      { name: "文本分析", description: "长文本挖掘与信息提取", users: "6K+" }
    ]
  },
  {
    id: "vend/step-2",
    name: "vend/step-2",
    author: "智谱",
    description: "阶跃星辰 Step-2，MoE 架构大模型，在中文理解和多模态任务上表现突出。",
    icon: "阶",
    iconColor: "#0891B2",
    categories: ["文本生成", "图像理解"],
    outputTypes: ["text"],
    inputModalities: ["text", "image"],
    contextLength: 131072,
    inputPrice: 0.06,
    outputPrice: 0.18,
    cacheHitPrice: 0.03,
    cacheMissPrice: 0.06,
    weeklyTokens: "380M",
    parameters: "~200B",
    architecture: "MoE Transformer",
    releasedDate: "2026-05-06",
    license: "Proprietary",
    trainingCutoff: "2026-04",
    status: "online",
    updatedAt: "2026-05-18",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 16384,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 90, throughput: 95, uptime: 99.95, errorRate: 0.05, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "Volcengine", status: "online", latency: 75, throughput: 105, uptime: 99.97, errorRate: 0.03, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 84.5, humaneval: 75.0, gsm8k: 90.0, hellaswag: 83.8, arc: 87.0, truthfulqa: 66.5 },
    changelog: [
      { date: "2026-05-06", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Step-2" }, { type: "Added", desc: "Native Chinese understanding optimization" }] }
    ],
    apps: [
      { name: "内容审核", description: "中文内容安全审核", users: "7K+" },
      { name: "知识问答", description: "专业知识库问答系统", users: "5K+" }
    ]
  },
  {
    id: "vend/command-r-plus",
    name: "vend/command-r-plus",
    author: "OpenAI",
    description: "Cohere 企业级 RAG 模型，专为检索增强生成设计，提供高精度的文档检索与生成能力。",
    icon: "C",
    iconColor: "#4F46E5",
    categories: ["文本生成", "工具调用"],
    outputTypes: ["text"],
    inputModalities: ["text"],
    contextLength: 128000,
    inputPrice: 2.5,
    outputPrice: 10.0,
    cacheHitPrice: 1.25,
    cacheMissPrice: 2.5,
    weeklyTokens: "280M",
    parameters: "104B",
    architecture: "Dense Transformer",
    releasedDate: "2026-03-15",
    license: "Proprietary",
    trainingCutoff: "2026-01",
    status: "online",
    updatedAt: "2026-04-25",
    externalSourcing: true,
    serviceType: 'hybrid',
    billingType: "pay-per-use",
    maxOutputLength: 32768,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 160, throughput: 52, uptime: 99.92, errorRate: 0.08, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "AWS Bedrock", status: "online", latency: 140, throughput: 58, uptime: 99.95, errorRate: 0.05, failoverPriority: 2, failoverStrategy: "自动切换到下一优先级供应商", billingType: "pay-per-use", isFree: false },
      { name: "本地部署", status: "online", latency: 80, throughput: 90, uptime: 100.0, errorRate: 0.0, failoverPriority: 3, failoverStrategy: "降级到缓存响应", billingType: "pay-per-use", isFree: false }
    ],
    benchmarks: { mmlu: 85.5, humaneval: 77.1, gsm8k: 90.8, hellaswag: 84.8, arc: 88.5, truthfulqa: 72.0 },
    changelog: [
      { date: "2026-03-15", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release of Command R+" }, { type: "Added", desc: "Multi-step RAG with citation" }, { type: "Added", desc: "Tool-use for enterprise data sources" }] },
      { date: "2026-04-10", version: "v1.0.1", changes: [{ type: "Fixed", desc: "Improved retrieval relevance scoring" }] }
    ],
    apps: [
      { name: "企业搜索", description: "企业内部知识库智能搜索", users: "4K+" },
      { name: "合规审查", description: "文档合规性自动化审查", users: "2K+" }
    ]
  },
  {
    id: "prem/muses-embedding-v2",
    name: "prem/muses-embedding-v2",
    author: "通义",
    description: "Muses 自研文本嵌入模型，支持 8K 上下文，适用于语义搜索、聚类和分类任务，完全免费。",
    icon: "M",
    iconColor: "#6366F1",
    categories: ["嵌入", "检索"],
    outputTypes: ["embedding"],
    inputModalities: ["text"],
    contextLength: 8192,
    inputPrice: 0,
    outputPrice: 0,
    cacheHitPrice: 0,
    cacheMissPrice: 0,
    weeklyTokens: "3.5B",
    parameters: "256M",
    architecture: "BERT-optimized",
    releasedDate: "2026-01-10",
    license: "Proprietary",
    trainingCutoff: "2025-12",
    status: "online",
    updatedAt: "2026-04-20",
    externalSourcing: false,
    serviceType: 'local',
    billingType: "free",
    maxOutputLength: 8192,
    providers: [
      { name: "Muses Cloud", status: "online", latency: 8, throughput: 500, uptime: 99.99, errorRate: 0.01, failoverPriority: 1, failoverStrategy: "自动切换到下一优先级供应商", billingType: "free", isFree: true },
      { name: "本地部署", status: "online", latency: 3, throughput: 800, uptime: 100.0, errorRate: 0.0, failoverPriority: 2, failoverStrategy: "降级到缓存响应", billingType: "free", isFree: true }
    ],
    benchmarks: { mmlu: 0, humaneval: 0, gsm8k: 0, hellaswag: 0, arc: 0, truthfulqa: 0 },
    changelog: [
      { date: "2026-01-10", version: "v1.0.0", changes: [{ type: "Added", desc: "Initial release" }] },
      { date: "2026-03-01", version: "v2.0.0", changes: [{ type: "Added", desc: "8K context length support" }, { type: "Changed", desc: "Embedding dimension reduced to 768 for efficiency" }, { type: "Fixed", desc: "Better handling of code-switching text" }] }
    ],
    apps: [
      { name: "语义搜索", description: "Muses 内部语义检索服务", users: "30K+" },
      { name: "向量数据库", description: "Muses VectorDB 嵌入服务", users: "25K+" }
    ]
  }
];

const SUPPLIERS = [
  {
    id: "muses-cloud", name: "Muses Cloud", type: "internal", apiUrl: "https://api.muses.internal/v1", apiKey: "sk-muses-****", modelName: "auto", status: "active", modelCount: 23, description: "Muses 自有云服务",
    models: [
      { id: "muses-cloud-qwen3-235b", modelName: "qwen3-235b-a22b", modelProvider: "通义", billingEnabled: true, cacheHitInputPrice: 0.07, cacheMissInputPrice: 0.14, outputPrice: 0.42, isDiscount: false, tpm: 500000, qps: 50, concurrency: 100, maxAvailableAmount: 50000, contextLength: 131072, maxInput: 98304, maxOutput: 32768, inputModalities: ["text", "image"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 1000 req/min", features: ["工具调用", "深度思考"], basePriceConfig: { inputPrice: { amount: 0.14, unit: "CNY" }, cacheHitInputPrice: { amount: 0.07, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.18, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.16, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.05, unit: "CNY" }, outputPrice: { amount: 0.42, unit: "CNY" } } },
      { id: "muses-cloud-deepseek-r1", modelName: "deepseek-r1-0528", modelProvider: "深度思索", billingEnabled: true, cacheHitInputPrice: 0.09, cacheMissInputPrice: 0.18, outputPrice: 0.55, isDiscount: false, tpm: 300000, qps: 30, concurrency: 80, maxAvailableAmount: 36000, contextLength: 131072, maxInput: 65536, maxOutput: 65536, inputModalities: ["text"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 800 req/min", features: ["深度思考"], basePriceConfig: { inputPrice: { amount: 0.18, unit: "CNY" }, cacheHitInputPrice: { amount: 0.09, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.22, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.20, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.08, unit: "CNY" }, outputPrice: { amount: 0.55, unit: "CNY" } } },
    ]
  },
  {
    id: "alicloud", name: "AliCloud", type: "external", apiUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", apiKey: "sk-ali-****", modelName: "auto", status: "active", modelCount: 3, description: "阿里云百炼平台",
    models: [
      { id: "alicloud-qwen3-235b", modelName: "qwen3-235b-a22b", modelProvider: "通义", billingEnabled: true, cacheHitInputPrice: 0.07, cacheMissInputPrice: 0.14, outputPrice: 0.42, isDiscount: true, tpm: 400000, qps: 40, concurrency: 90, maxAvailableAmount: 42000, contextLength: 131072, maxInput: 98304, maxOutput: 32768, inputModalities: ["text", "image"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 900 req/min", features: ["工具调用", "深度思考"], basePriceConfig: { inputPrice: { amount: 0.14, unit: "CNY" }, cacheHitInputPrice: { amount: 0.07, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.17, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.15, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.05, unit: "CNY" }, outputPrice: { amount: 0.42, unit: "CNY" } } },
    ]
  },
  {
    id: "volcengine", name: "Volcengine", type: "external", apiUrl: "https://ark.cn-beijing.volces.com/api/v3", apiKey: "sk-volc-****", modelName: "auto", status: "active", modelCount: 8, description: "火山引擎方舟平台",
    models: [
      { id: "volcengine-doubao-pro", modelName: "doubao-pro-256k", modelProvider: "通义", billingEnabled: true, cacheHitInputPrice: 0.04, cacheMissInputPrice: 0.08, outputPrice: 0.24, isDiscount: false, tpm: 600000, qps: 60, concurrency: 120, maxAvailableAmount: 68000, contextLength: 262144, maxInput: 196608, maxOutput: 65536, inputModalities: ["text", "image"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 1200 req/min", features: [], basePriceConfig: { inputPrice: { amount: 0.08, unit: "CNY" }, cacheHitInputPrice: { amount: 0.04, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.10, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.09, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.03, unit: "CNY" }, outputPrice: { amount: 0.24, unit: "CNY" } } },
    ]
  },
  {
    id: "deepseek-api", name: "DeepSeek API", type: "external", apiUrl: "https://api.deepseek.com/v1", apiKey: "sk-ds-****", modelName: "auto", status: "active", modelCount: 2, description: "DeepSeek 官方 API",
    models: [
      { id: "deepseek-api-r1", modelName: "deepseek-r1-0528", modelProvider: "深度思索", billingEnabled: true, cacheHitInputPrice: 0.09, cacheMissInputPrice: 0.18, outputPrice: 0.55, isDiscount: false, tpm: 200000, qps: 20, concurrency: 60, maxAvailableAmount: 28000, contextLength: 131072, maxInput: 65536, maxOutput: 65536, inputModalities: ["text"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 600 req/min", features: ["深度思考"], basePriceConfig: { inputPrice: { amount: 0.18, unit: "CNY" }, cacheHitInputPrice: { amount: 0.09, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.22, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.20, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.08, unit: "CNY" }, outputPrice: { amount: 0.55, unit: "CNY" } } },
    ]
  },
  {
    id: "openai-proxy", name: "OpenAI Proxy", type: "external", apiUrl: "https://proxy.muses.internal/openai/v1", apiKey: "sk-oai-****", modelName: "auto", status: "active", modelCount: 2, description: "OpenAI 代理服务",
    models: [
      { id: "openai-proxy-gpt4o", modelName: "gpt-4o", modelProvider: "OpenAI", billingEnabled: true, cacheHitInputPrice: 1.25, cacheMissInputPrice: 2.50, outputPrice: 10.00, isDiscount: false, tpm: 300000, qps: 30, concurrency: 80, maxAvailableAmount: 90000, contextLength: 128000, maxInput: 98304, maxOutput: 32768, inputModalities: ["text", "image"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 800 req/min", features: ["工具调用"], basePriceConfig: { inputPrice: { amount: 2.50, unit: "CNY" }, cacheHitInputPrice: { amount: 1.25, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 3.00, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 2.75, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 1.00, unit: "CNY" }, outputPrice: { amount: 10.00, unit: "CNY" } } },
    ]
  },
  {
    id: "anthropic-proxy", name: "Anthropic Proxy", type: "external", apiUrl: "https://proxy.muses.internal/anthropic/v1", apiKey: "sk-ant-****", modelName: "auto", status: "inactive", modelCount: 0, description: "Anthropic 代理服务（维护中）",
    models: []
  },
  {
    id: "zhipu-api", name: "Zhipu API", type: "external", apiUrl: "https://open.bigmodel.cn/api/paas/v4", apiKey: "sk-zp-****", modelName: "auto", status: "active", modelCount: 1, description: "智谱 AI 官方 API",
    models: [
      { id: "zhipu-api-glm4", modelName: "glm-4-plus", modelProvider: "智谱", billingEnabled: true, cacheHitInputPrice: 0.05, cacheMissInputPrice: 0.10, outputPrice: 0.30, isDiscount: true, tpm: 350000, qps: 35, concurrency: 85, maxAvailableAmount: 32000, contextLength: 128000, maxInput: 98304, maxOutput: 32768, inputModalities: ["text"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 700 req/min", features: ["工具调用"], basePriceConfig: { inputPrice: { amount: 0.10, unit: "CNY" }, cacheHitInputPrice: { amount: 0.05, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0.12, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0.11, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0.04, unit: "CNY" }, outputPrice: { amount: 0.30, unit: "CNY" } } },
    ]
  },
  {
    id: "local-deploy", name: "本地部署", type: "internal", apiUrl: "http://localhost:8000/v1", apiKey: "sk-local-****", modelName: "custom", status: "active", modelCount: 3, description: "Muses 本地部署模型服务",
    models: [
      { id: "local-deploy-qwen3", modelName: "qwen3-235b-a22b", modelProvider: "通义", billingEnabled: false, cacheHitInputPrice: 0, cacheMissInputPrice: 0, outputPrice: 0, isDiscount: false, tpm: 200000, qps: 20, concurrency: 50, maxAvailableAmount: 0, contextLength: 131072, maxInput: 98304, maxOutput: 32768, inputModalities: ["text"], outputModalities: ["text"], protocols: ["openai"], usageConfig: "rate-limit: 500 req/min", features: ["工具调用"], basePriceConfig: { inputPrice: { amount: 0, unit: "CNY" }, cacheHitInputPrice: { amount: 0, unit: "CNY" }, cacheWrite5mInputPrice: { amount: 0, unit: "CNY" }, cacheWrite1hInputPrice: { amount: 0, unit: "CNY" }, explicitCacheHitInputPrice: { amount: 0, unit: "CNY" }, outputPrice: { amount: 0, unit: "CNY" } } },
    ]
  }
];

const MOCK_USERS = [
  { id: 'user-1', name: '张三', department: '技术部' },
  { id: 'user-2', name: '李四', department: '技术部' },
  { id: 'user-3', name: '王五', department: '产品部' },
  { id: 'user-4', name: '赵六', department: '产品部' },
  { id: 'user-5', name: '钱七', department: '设计部' },
  { id: 'user-6', name: '孙八', department: '市场部' },
  { id: 'user-7', name: '周九', department: '市场部' },
  { id: 'user-8', name: '吴十', department: '技术部' },
];

const MOCK_DEPARTMENTS = [
  { id: 'dept-1', name: '技术部' },
  { id: 'dept-2', name: '产品部' },
  { id: 'dept-3', name: '设计部' },
  { id: 'dept-4', name: '市场部' },
  { id: 'dept-5', name: '运营部' },
  { id: 'dept-6', name: '人力资源部' },
];

// 能力测试 Mock 数据
const CAPABILITY_TESTS = [
  {
    modelId: "prem/qwen3-235b-a22b",
    testDate: "2026-05-08",
    tester: "张三",
    overallScore: 92,
    results: [
      { category: "文本理解", score: 94, maxScore: 100, description: "长文本理解与摘要" },
      { category: "代码生成", score: 88, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "数学推理", score: 91, maxScore: 100, description: "数学问题求解与推理" },
      { category: "工具调用", score: 95, maxScore: 100, description: "API 调用与参数生成" },
      { category: "多语言", score: 90, maxScore: 100, description: "中英文混合场景表现" },
      { category: "深度思考", score: 93, maxScore: 100, description: "复杂推理链与逻辑分析" },
    ]
  },
  {
    modelId: "vend/deepseek-r1-0528",
    testDate: "2026-05-25",
    tester: "李四",
    overallScore: 94,
    results: [
      { category: "文本理解", score: 90, maxScore: 100, description: "长文本理解与摘要" },
      { category: "代码生成", score: 85, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "数学推理", score: 98, maxScore: 100, description: "数学问题求解与推理" },
      { category: "深度思考", score: 97, maxScore: 100, description: "复杂推理链与逻辑分析" },
      { category: "多语言", score: 86, maxScore: 100, description: "中英文混合场景表现" },
    ]
  },
  {
    modelId: "vend/doubao-pro-256k",
    testDate: "2026-04-18",
    tester: "王五",
    overallScore: 86,
    results: [
      { category: "文本理解", score: 89, maxScore: 100, description: "长文本理解与摘要" },
      { category: "代码生成", score: 82, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "数学推理", score: 80, maxScore: 100, description: "数学问题求解与推理" },
      { category: "长上下文", score: 93, maxScore: 100, description: "256K 长文本检索与理解" },
      { category: "多语言", score: 85, maxScore: 100, description: "中英文混合场景表现" },
    ]
  },
  {
    modelId: "vend/gpt-4o",
    testDate: "2026-03-20",
    tester: "张三",
    overallScore: 91,
    results: [
      { category: "文本理解", score: 92, maxScore: 100, description: "长文本理解与摘要" },
      { category: "图像理解", score: 95, maxScore: 100, description: "图像内容识别与描述" },
      { category: "代码生成", score: 90, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "工具调用", score: 94, maxScore: 100, description: "API 调用与参数生成" },
      { category: "多语言", score: 88, maxScore: 100, description: "中英文混合场景表现" },
    ]
  },
  {
    modelId: "vend/claude-4-sonnet",
    testDate: "2026-05-12",
    tester: "赵六",
    overallScore: 93,
    results: [
      { category: "文本理解", score: 95, maxScore: 100, description: "长文本理解与摘要" },
      { category: "代码生成", score: 93, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "工具调用", score: 96, maxScore: 100, description: "API 调用与参数生成" },
      { category: "深度思考", score: 94, maxScore: 100, description: "复杂推理链与逻辑分析" },
      { category: "多语言", score: 89, maxScore: 100, description: "中英文混合场景表现" },
    ]
  },
  {
    modelId: "vend/minimax-m1",
    testDate: "2026-04-25",
    tester: "李四",
    overallScore: 84,
    results: [
      { category: "文本理解", score: 87, maxScore: 100, description: "长文本理解与摘要" },
      { category: "代码生成", score: 80, maxScore: 100, description: "多语言代码生成与补全" },
      { category: "数学推理", score: 82, maxScore: 100, description: "数学问题求解与推理" },
      { category: "长上下文", score: 90, maxScore: 100, description: "1M 超长文本检索与理解" },
    ]
  },
];

const STORAGE_KEY_MODELS = 'muses_models';

function getStoredModels() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_MODELS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredModels(models) {
  localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models));
}

function getModels() {
  const stored = getStoredModels();
  const storedById = new Map(stored.map(model => [model._replacesId || model.id, model]));
  const mergedBuiltIns = MODELS.map(model => storedById.get(model.id) || model);
  const customModels = stored.filter(model => !model._replacesId && !MODELS.some(item => item.id === model.id));
  return [...mergedBuiltIns, ...customModels];
}

function getModelProvider(model) {
  return model && (model.modelProvider || model.author) ? (model.modelProvider || model.author) : '未知';
}

function getModelSource(model) {
  const explicitSource = model && (model.modelSource || model.region || model.sourceRegion);
  if (explicitSource === 'domestic' || explicitSource === '国内') return '国内';
  if (explicitSource === 'overseas' || explicitSource === '海外') return '海外';

  const provider = getModelProvider(model).toLowerCase();
  const overseasProviders = ['anthropic', 'openai', 'gemini', 'google', 'meta', 'mistral', 'xai', 'cohere'];
  return overseasProviders.some(item => provider.includes(item)) ? '海外' : '国内';
}

function getModelProviderOptions(models) {
  return [...new Set((models || getModels()).map(getModelProvider).filter(Boolean))].sort();
}

function saveModelToStorage(model) {
  const stored = getStoredModels();
  stored.push(model);
  saveStoredModels(stored);
}

function updateModelInStorage(id, data) {
  const stored = getStoredModels();
  const idx = stored.findIndex(m => m.id === id);
  if (idx !== -1) {
    stored[idx] = { ...stored[idx], ...data, _replacesId: stored[idx]._replacesId || (stored[idx].id !== data.id ? id : undefined) };
    saveStoredModels(stored);
    return true;
  }
  const builtIn = MODELS.find(m => m.id === id);
  if (builtIn) {
    stored.push({ ...builtIn, ...data, _replacesId: id });
    saveStoredModels(stored);
    return true;
  }
  return false;
}

function deleteModelFromStorage(id) {
  const stored = getStoredModels();
  const filtered = stored.filter(m => m.id !== id);
  if (filtered.length !== stored.length) {
    saveStoredModels(filtered);
    return true;
  }
  return false;
}

function getNextModelId(author) {
  const prefix = (author || 'model').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const all = getModels();
  let num = 1;
  let id;
  do {
    id = prefix + '/model-v' + num;
    num++;
  } while (all.some(m => m.id === id));
  return id;
}

function getSuppliers() {
  try {
    const data = localStorage.getItem('muses_suppliers');
    const stored = data ? JSON.parse(data) : [];
    return [...SUPPLIERS, ...stored];
  } catch (e) {
    return [...SUPPLIERS];
  }
}
