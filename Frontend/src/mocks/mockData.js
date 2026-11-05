export const AGENTS = [
  {
    id: 'chat',
    name: 'Chat Agent',
    route: '/agent/chat',
    icon: 'MessageSquare',
    tagline: 'Autonomous Conversational Assistant',
    status: 'Online',
    color: '#8B7CFF',
    badgeColor: 'bg-[#8B7CFF]/15 text-[#8B7CFF] border-[#8B7CFF]/30',
    description: 'Orchestrated with live web search, code sandbox, and multi-file reasoning capabilities.',
    model: 'Cortex Omni 3.5',
    latency: '⚡ 142ms',
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    route: '/agent/coding',
    icon: 'Code2',
    tagline: 'Code Generation & Architecture Specialist',
    status: 'Ready',
    color: '#56CFE1',
    badgeColor: 'bg-[#56CFE1]/15 text-[#56CFE1] border-[#56CFE1]/30',
    description: 'Expert in refactoring, debugging, test generation, and full-stack systems engineering.',
    model: 'Cortex Code Pro',
    latency: '⚡ 185ms',
  },
  {
    id: 'ppt',
    name: 'PPT Agent',
    route: '/agent/ppt',
    icon: 'Presentation',
    tagline: 'Executive Presentation Deck Designer',
    status: 'Ready',
    color: '#F59E0B',
    badgeColor: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    description: 'Generates professional pitch decks, keynote slides, and outlines with visual hierarchy.',
    model: 'Cortex SlideGen 2.0',
    latency: '⚡ 320ms',
  },
  {
    id: 'pdf',
    name: 'PDF Agent',
    route: '/agent/pdf',
    icon: 'FileText',
    tagline: 'Document Intelligence & Citation Specialist',
    status: 'Ready',
    color: '#EF4444',
    badgeColor: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
    description: 'Extracts clauses, synthesizes research papers, and answers questions with page references.',
    model: 'Cortex DocMind',
    latency: '⚡ 210ms',
  },
  {
    id: 'image',
    name: 'Image Agent',
    route: '/agent/image',
    icon: 'Image',
    tagline: 'Creative Visual Diffusion Engine',
    status: 'Ready',
    color: '#EC4899',
    badgeColor: 'bg-[#EC4899]/15 text-[#EC4899] border-[#EC4899]/30',
    description: 'Generates high-resolution cinematic art, product prototypes, and 3D illustrations from text prompts.',
    model: 'Cortex Diffusion XL',
    latency: '⚡ 950ms',
  },
  {
    id: 'search',
    name: 'Search Agent',
    route: '/agent/search',
    icon: 'Globe',
    tagline: 'Live Web Research & Synthesis Engine',
    status: 'Ready',
    color: '#10B981',
    badgeColor: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
    description: 'Deep web exploration, source verification, and structured research reporting with verified citations.',
    model: 'Cortex DeepResearch',
    latency: '⚡ 410ms',
  },
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'task-1',
    agentId: 'chat',
    title: 'Market expansion strategy brief',
    dateGroup: 'Today',
    updatedAt: '10 mins ago',
    messagesCount: 4,
  },
  {
    id: 'task-2',
    agentId: 'coding',
    title: 'Refactor auth middleware in Express & JWT',
    dateGroup: 'Today',
    updatedAt: '1 hour ago',
    messagesCount: 6,
  },
  {
    id: 'task-3',
    agentId: 'ppt',
    title: 'Quarterly pitch deck synthesis — 8 slides',
    dateGroup: 'Today',
    updatedAt: '3 hours ago',
    messagesCount: 2,
  },
  {
    id: 'task-4',
    agentId: 'pdf',
    title: 'System Design Interview Notes.pdf',
    dateGroup: 'Yesterday',
    updatedAt: 'Yesterday at 4:15 PM',
    messagesCount: 8,
  },
  {
    id: 'task-5',
    agentId: 'search',
    title: 'Synthesize multi-agent LLM runtime benchmarks',
    dateGroup: 'Yesterday',
    updatedAt: 'Yesterday at 2:00 PM',
    messagesCount: 3,
  },
  {
    id: 'task-6',
    agentId: 'image',
    title: 'Futuristic AI Workspace, 3D cinematic render',
    dateGroup: 'Previous 7 days',
    updatedAt: '3 days ago',
    messagesCount: 1,
  },
];

export const SAMPLE_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Compare micro-frontend architectures with state synchronization. Should we adopt Module Federation with an Event Bus or a Shared Worker with Zustand for our real-time telemetry console?',
    timestamp: '11:28 AM',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    agentId: 'chat',
    content: `For high-frequency telemetry data streams (60Hz+), the architectural choice hinges on **serialization overhead**, **thread isolation**, and **atomic synchronization**:

### Architectural Trade-off Summary:

| Architecture | CPU Thread | Serialization Latency | Shared Memory | Best Fit |
| :--- | :--- | :--- | :--- | :--- |
| **Module Federation + Event Bus** | Main Thread | 2.4ms per dispatch | No (Deep Cloned) | Independent micro-apps |
| **SharedWorker + Zustand** | Dedicated Worker Thread | **0.1ms (Zero Copy)** | Yes (\`SharedArrayBuffer\`) | High-frequency telemetry |

### Recommended Implementation:
Adopt **SharedWorker + Zustand Store**. It guarantees that UI re-renders in secondary panels do not block telemetry ingest frames.

\`\`\`typescript
// telemetry-sync-worker.ts
// Shared Worker BroadcastChannel for Low-Latency Telemetry Hub
const channel = new BroadcastChannel('cortex_telemetry_bus');

export interface TelemetryPacket {
  nodeId: string;
  fps: number;
  memoryMb: number;
  latencyMs: number;
}

export function publishTelemetryFrame(frame: TelemetryPacket) {
  channel.postMessage({
    timestamp: performance.now(),
    payload: frame,
    sourceAgent: 'agent-chat-v2'
  });
}
\`\`\`

> [!TIP]
> Use an ArrayBuffer slice for binary protobuf streaming if throughput exceeds 10,000 events/sec.`,
    citations: [
      { title: 'W3C SharedWorker Specification v2.1', url: 'https://w3c.github.io/workers/' },
      { title: 'Webpack Module Federation 2.0 Docs', url: 'https://module-federation.io/' },
    ],
    timestamp: '11:29 AM',
    model: 'Cortex Omni 3.5',
    latency: '1.4s',
  },
];

export const SAMPLE_CODING_MESSAGES = [
  {
    id: 'code-msg-1',
    role: 'user',
    content: 'Build a production-grade JWT authentication middleware in Express with token refresh rotation, role-based authorization, and rate limiting protection.',
    timestamp: '10:14 AM',
  },
  {
    id: 'code-msg-2',
    role: 'assistant',
    agentId: 'coding',
    content: `Here is a production-grade JWT authentication middleware with token refresh validation and role-based access control (RBAC):

\`\`\`javascript
// authMiddleware.js
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key-cortex';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-cortex';

/**
 * Validates JWT Access Token from Bearer header
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required', code: 'UNAUTHORIZED' });
  }

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(403).json({
        error: isExpired ? 'Token expired' : 'Invalid token',
        code: isExpired ? 'TOKEN_EXPIRED' : 'FORBIDDEN'
      });
    }
    req.user = decoded;
    next();
  });
};

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles 
 */
export const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions for this resource',
        requiredRoles: allowedRoles
      });
    }
    next();
  };
};
\`\`\`

### Key Features Included:
1. **Explicit Error Categorization**: Differentiates \`TOKEN_EXPIRED\` from malformed tokens to trigger frontend refresh flow automatically.
2. **Role Verification Guard**: Dynamic role validation for admin, operator, and standard tiers.
3. **Decoupled Key Management**: Supports independent access and refresh secrets.`,
    timestamp: '10:15 AM',
    model: 'Cortex Code Pro',
    latency: '1.8s',
  },
];

export const SAMPLE_PPT_DECK = {
  id: 'deck-1',
  topic: 'Introduction to Distributed System Design',
  audience: 'Senior Software Engineers & Architects',
  slidesCount: 6,
  tone: 'Professional & Technical',
  createdAt: 'Today',
  slides: [
    {
      id: 1,
      title: 'Distributed Systems: Core Foundations',
      subtitle: 'Principles, Trade-offs & CAP Theorem in Modern Architectures',
      type: 'title',
      bullets: [
        'Fundamental challenges of network partitions and latency',
        'Consistency models: Strong vs. Eventual Consistency',
        'State distribution, replication strategies, and fault tolerance',
      ],
      diagram: 'Client ➔ API Gateway ➔ [Microservices] ➔ Distributed DB Cluster',
      keyMetric: '99.999% SLA Target',
    },
    {
      id: 2,
      title: 'CAP Theorem & PACELC Trade-offs',
      subtitle: 'Navigating Consistency, Availability, and Partition Tolerance',
      type: 'concept',
      bullets: [
        'Consistency: Every read receives the most recent write or an error',
        'Availability: Every non-failing node returns a response without guarantee of recent write',
        'PACELC: Under Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C)',
      ],
      diagram: 'Partition Occurs: Choose (CP: MongoDB/HBase) vs (AP: Cassandra/DynamoDB)',
      keyMetric: 'P99 Latency < 15ms',
    },
    {
      id: 3,
      title: 'Data Partitioning & Consistent Hashing',
      subtitle: 'Horizontal Scaling without Hotspots',
      type: 'architecture',
      bullets: [
        'Virtual nodes prevent data skew across uneven hardware clusters',
        'Replication factor N ensures node failure survival without data loss',
        'Gossip protocol manages cluster node membership and heartbeat checks',
      ],
      diagram: 'Hash Ring (0 to 2^32-1) with distributed token distribution',
      keyMetric: 'Zero downtime node addition',
    },
    {
      id: 4,
      title: 'Consensus Algorithms: Raft vs Paxos',
      subtitle: 'Leader Election and Log Replication',
      type: 'comparison',
      bullets: [
        'Leader Election: Randomized election timers prevent split-vote deadlocks',
        'Log Matching: Strict index guarantees uncommitted entries overwrite safely',
        'Quorum writes: (N/2) + 1 acknowledgments required before committing',
      ],
      diagram: 'Client Write ➔ Leader ➔ Followers Log Replicate ➔ Commit Ack',
      keyMetric: '< 50ms consensus quorum',
    },
    {
      id: 5,
      title: 'Distributed Caching & Invalidation',
      subtitle: 'Redis Cluster, Cache-Aside & Write-Through Patterns',
      type: 'caching',
      bullets: [
        'Cache-Aside: Read from cache, on miss load from DB and populate cache',
        'Write-Through: Data written to cache and DB synchronously',
        'Thundering Herd Mitigation: Mutex locking & probabilistic early expiration',
      ],
      diagram: 'App ➔ Redis Cache (Hit: 2ms) / (Miss: Query DB + Backfill)',
      keyMetric: '96.4% Cache Hit Ratio',
    },
    {
      id: 6,
      title: 'Summary & Operational Checklist',
      subtitle: 'Observability, Distributed Tracing & Circuit Breakers',
      type: 'summary',
      bullets: [
        'Implement OpenTelemetry distributed context propagation across boundaries',
        'Configure resilient Circuit Breakers (Resilience4j / Envoy) on egress RPCs',
        'Automated chaos engineering drills to test network degradation resilience',
      ],
      diagram: 'Prometheus + Grafana + Jaeger Telemetry Pipeline',
      keyMetric: 'MTTR < 2 minutes',
    },
  ],
};

export const SAMPLE_PDF_DOC = {
  id: 'doc-1',
  name: 'System Design Interview Notes.pdf',
  size: '3.4 MB',
  pages: 24,
  uploadDate: '2 hours ago',
  status: 'Ready',
  summary: 'Comprehensive compilation of distributed system patterns, database sharding, caching strategies, and API gateway routing architectures.',
  sections: [
    { page: 1, title: 'Chapter 1: Scale From Zero to Millions of Users' },
    { page: 6, title: 'Chapter 2: Back-of-the-envelope Estimation' },
    { page: 12, title: 'Chapter 3: Design a Rate Limiter with Redis Token Bucket' },
    { page: 18, title: 'Chapter 4: Consistent Hashing Implementation' },
    { page: 22, title: 'Chapter 5: Distributed Message Queues (Kafka & RabbitMQ)' },
  ],
  qaHistory: [
    {
      id: 'pdf-q1',
      question: 'How does the document recommend mitigating the Thundering Herd problem in caching?',
      answer: 'According to **Page 14, Section 3.2**, the document outlines two specific mitigation patterns:\n\n1. **Distributed Mutex Lock**: When a cache miss occurs, only the first thread acquires a lock to recompute/fetch from the database, while concurrent requests poll or wait for 50ms.\n2. **Probabilistic Early Expiration (XFetch algorithm)**: Background async jobs recompute the cache before the TTL expires based on a calculated delta and probability function `delta * beta * log(rand())`.',
      pageRef: 'Page 14',
    },
    {
      id: 'pdf-q2',
      question: 'What is the formula given on Page 7 for estimating storage for 500 million daily tweets?',
      answer: 'On **Page 7, Table 2.1**, the calculation is:\n\n- 500 Million tweets/day × 10% with media (photos/videos)\n- 500M × 100 bytes (text metadata) = 50 GB/day\n- 50M × 1 MB (compressed media) = 50 TB/day\n- Total storage for 5 years = `50 TB/day × 365 × 5 = ~91.25 Petabytes`.',
      pageRef: 'Page 7',
    },
  ],
};

export const SAMPLE_IMAGE_RESULTS = [
  {
    id: 'img-1',
    prompt: 'A futuristic AI neural workspace console in deep space obsidian, neon violet and cyan glowing fiber optics, cinematic volumetric lighting, 8k hyperdetailed 3D render.',
    style: 'Cinematic 3D',
    aspect: '16:9',
    timestamp: 'Today at 3:12 PM',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Workspace', 'Neural', 'Cyberpunk', '3D'],
  },
  {
    id: 'img-2',
    prompt: 'Minimalist isometric diagram of a multi-agent AI server rack with glowing data streams, matte dark surfaces, soft purple gradient highlights.',
    style: 'Isometric 3D',
    aspect: '1:1',
    timestamp: 'Yesterday at 5:40 PM',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    tags: ['Architecture', 'Isometric', 'Minimal'],
  },
  {
    id: 'img-3',
    prompt: 'Abstract neural network synapse graph glowing with electric violet and aqua cyan particles, high dynamic range, obsidian background.',
    style: 'Abstract Digital',
    aspect: '16:9',
    timestamp: '2 days ago',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Neural', 'Abstract', 'Vibrant'],
  },
  {
    id: 'img-4',
    prompt: 'Futuristic digital avatar of a knowledge architect with holographic HUD interface and subtle cyan studio backlights.',
    style: 'Photorealistic',
    aspect: '1:1',
    timestamp: '3 days ago',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    tags: ['Portrait', 'Avatar', 'Tech'],
  },
];

export const SAMPLE_SEARCH_RESULTS = {
  query: 'Latest trends in multi-agent AI workspace systems and tool-calling runtimes',
  timeframe: 'Past 30 days',
  sources: [
    {
      id: 1,
      title: 'State of Multi-Agent AI Architectures: Autogen, CrewAI & LangGraph Benchmarks',
      domain: 'arxiv.org/abs/2405.02941',
      snippet: 'Evaluating hierarchical agent routing versus peer-to-peer consensus across complex software engineering and scientific synthesis tasks.',
      relevance: '98%',
      date: 'May 2026',
    },
    {
      id: 2,
      title: 'Model Context Protocol (MCP) Standard Adoption Across Enterprise Workspaces',
      domain: 'developer.google.com/ai/mcp',
      snippet: 'How standardized tool execution and resource servers eliminate brittle custom API connectors for generative UI and autonomous IDE workflows.',
      relevance: '95%',
      date: 'June 2026',
    },
    {
      id: 3,
      title: 'Streaming Generative UI: Combining Server Components with Real-time LLM Output',
      domain: 'nextjs.org/blog/generative-ui',
      snippet: 'Techniques for rendering interactive React components inline alongside streamed textual tokens without layout shifts or rehydration stutter.',
      relevance: '91%',
      date: 'April 2026',
    },
    {
      id: 4,
      title: 'Distributed State Synchronization for Collaborative AI Canvases',
      domain: 'systemdesign.io/multi-agent-canvas',
      snippet: 'CRDT-based synchronization models allowing multi-agent LLM instances to collaboratively mutate document ASTs concurrently with human users.',
      relevance: '89%',
      date: 'July 2026',
    },
  ],
  keyFindings: [
    'Autonomous multi-agent workspaces are shifting from generic chat interfaces to role-specialized canvases (coding, document analysis, slide deck authoring).',
    'Tool integration is consolidating around standardized protocols like Model Context Protocol (MCP) for secure sandboxed command execution.',
    'High-performance interfaces isolate AI streaming chunks using Web Workers or Server-Sent Events to maintain 60 FPS smooth rendering.',
    'Grounded citations with interactive deep-links are now standard table-stakes for high-trust enterprise decision workflows.',
  ],
  summaryText: `Recent research across multi-agent AI ecosystems demonstrates a rapid migration from single-turn chat windows toward **multi-agent canvas workspaces**. Specialist agents—orchestrating distinct pipelines like syntax-verified code generation, slide deck synthesis, and vector-grounded PDF querying—outperform monolithic LLM prompts by over 42% on task completion benchmarks.

The introduction of unified interface protocols like **Model Context Protocol (MCP)** enables workspaces to safely delegate tool execution, file manipulation, and database inspections while keeping UI state strictly synchronized.`,
};

export const SAMPLE_FILES = [
  {
    id: 'f-1',
    name: 'System Design Interview Notes.pdf',
    type: 'PDF',
    size: '3.4 MB',
    uploadedAt: 'Today, 2:30 PM',
    agent: 'PDF Agent',
    status: 'Indexed & Ready',
  },
  {
    id: 'f-2',
    name: 'Q3_Financial_Performance_Report.xlsx',
    type: 'Spreadsheet',
    size: '1.8 MB',
    uploadedAt: 'Yesterday, 11:15 AM',
    agent: 'Chat Agent',
    status: 'Indexed & Ready',
  },
  {
    id: 'f-3',
    name: 'authMiddleware_Express_v2.ts',
    type: 'TypeScript',
    size: '42 KB',
    uploadedAt: 'Yesterday, 9:45 AM',
    agent: 'Coding Agent',
    status: 'Ready',
  },
  {
    id: 'f-4',
    name: 'Cortex_Investor_Pitch_v4.pptx',
    type: 'Presentation',
    size: '12.6 MB',
    uploadedAt: '3 days ago',
    agent: 'PPT Agent',
    status: 'Ready',
  },
  {
    id: 'f-5',
    name: 'Neural_Console_Concept_Render.png',
    type: 'Image',
    size: '4.2 MB',
    uploadedAt: '4 days ago',
    agent: 'Image Agent',
    status: 'Ready',
  },
];

export const SAMPLE_USAGE_DATA = {
  currentBalance: 84200,
  monthlyQuota: 100000,
  billingPeriod: 'Nov 1, 2026 – Nov 30, 2026',
  planName: 'Pro Tier',
  agentBreakdown: [
    { agent: 'Coding Agent', used: 38400, percentage: 45, color: '#56CFE1' },
    { agent: 'Chat Agent', used: 22100, percentage: 26, color: '#8B7CFF' },
    { agent: 'PDF Agent', used: 11500, percentage: 14, color: '#EF4444' },
    { agent: 'Search Agent', used: 6800, percentage: 8, color: '#10B981' },
    { agent: 'PPT Agent', used: 3400, percentage: 4, color: '#F59E0B' },
    { agent: 'Image Agent', used: 2000, percentage: 3, color: '#EC4899' },
  ],
  transactions: [
    { id: 'tx-101', date: 'Nov 03, 2026', desc: 'Code Refactor & AST Analysis', credits: -450, agent: 'Coding' },
    { id: 'tx-102', date: 'Nov 03, 2026', desc: 'PDF Document Vector Search (24 pages)', credits: -280, agent: 'PDF' },
    { id: 'tx-103', date: 'Nov 02, 2026', desc: 'Slide Deck Generation (8 slides)', credits: -600, agent: 'PPT' },
    { id: 'tx-104', date: 'Nov 02, 2026', desc: 'Deep Web Search Synthesis', credits: -180, agent: 'Search' },
    { id: 'tx-105', date: 'Nov 01, 2026', desc: 'Monthly Pro Plan Renewal (+100,000 Credits)', credits: 100000, agent: 'System' },
  ],
};
