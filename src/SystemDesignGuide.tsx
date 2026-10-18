import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Database,
  Gauge,
  Layers,
  Network,
  Search,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import './system-design.css';

type Track = 'study-plan' | 'data-structures' | 'system-design' | 'theory';

type Chapter = {
  id: string;
  title: string;
  eyebrow: string;
  intro: string;
  cards?: { title: string; body: string; tag?: string }[];
  steps?: { title: string; body: string }[];
  rows?: { label: string; bestFor: string; tradeoff: string }[];
  callout?: { title: string; body: string };
  formula?: { label: string; value: string; note: string }[];
  architecture?: string[];
};

const chapters: Chapter[] = [
  {
    id: 'interview-method',
    title: 'A repeatable interview method',
    eyebrow: 'START HERE · 8-STEP FRAMEWORK',
    intro: 'A system design interview is a collaborative reasoning exercise, not a memory test. Make assumptions visible, narrow the problem, then defend a coherent design as constraints change.',
    steps: [
      { title: 'Clarify the product', body: 'Ask who the users are, what they can do, and which workflows matter most. Separate core use cases from nice-to-haves.' },
      { title: 'Set scope and assumptions', body: 'Agree on platforms, geography, retention, read/write mix, peak traffic, freshness, and what is explicitly out of scope.' },
      { title: 'Write functional requirements', body: 'Keep these as user-visible actions: create, read, update, search, follow, upload, notify, or delete.' },
      { title: 'Name quality attributes', body: 'Prioritize latency, availability, consistency, durability, privacy, and cost. State measurable targets only as assumptions.' },
      { title: 'Estimate the load', body: 'Use round numbers for average and peak QPS, storage growth, bandwidth, and hot-key risk. Show the arithmetic.' },
      { title: 'Define APIs and data', body: 'Sketch request/response shapes, identifiers, ownership, indexes, and invariants before drawing services.' },
      { title: 'Draw the simplest viable architecture', body: 'Follow one read path and one write path. Add caches, queues, replicas, shards, or regions only to address a named bottleneck or requirement.' },
      { title: 'Deep dive, fail, and trade off', body: 'Choose the highest-risk component. Trace failure and recovery; end with bottlenecks, mitigations, and alternatives you rejected.' },
    ],
    callout: { title: 'Strong opening', body: '“I’ll clarify the primary user journeys and success targets first, estimate the rough scale, then propose a simple architecture and pressure-test its data path and failure modes. Does that match what you want to explore?”' },
  },
  {
    id: 'capacity-estimation',
    title: 'Capacity estimation without fake precision',
    eyebrow: 'BACK-OF-THE-ENVELOPE',
    intro: 'Estimates are there to choose an architecture, not to predict an invoice. State the assumptions, keep units attached, and distinguish averages from peaks.',
    formula: [
      { label: 'Average request rate', value: 'DAU × requests per user per day ÷ 86,400', note: 'Then apply a peak multiplier based on traffic shape.' },
      { label: 'Daily storage growth', value: 'writes per day × average stored bytes × index/replica factor', note: 'Separate raw data, indexes, replicas, and retention.' },
      { label: 'Network throughput', value: 'requests per second × average payload bytes', note: 'Calculate ingress and egress separately; account for protocol overhead only if material.' },
      { label: 'Availability budget', value: 'period length × (1 − availability target)', note: 'An error budget makes an abstract SLO tangible.' },
    ],
    cards: [
      { title: 'Worked request estimate', tag: 'EXAMPLE', body: 'Assume 10M daily active users and 20 requests each per day: 200M requests/day ÷ 86,400 ≈ 2.3k average requests/second. A 3× peak assumption gives roughly 7k peak RPS.' },
      { title: 'What to estimate next', tag: 'DON’T STOP AT RPS', body: 'If 10% are writes, that is about 700 peak writes/second. At 1 KB per response, peak egress is around 7 MB/s before overhead. At 1 KB per new record, 10M writes/day is about 10 GB/day raw.' },
      { title: 'Use ranges', tag: 'SANITY CHECK', body: 'Try low/base/high cases for uncertain values. If all three imply the same architecture, more precision is wasted effort.' },
      { title: 'Call out skew', tag: 'HOT KEYS', body: 'Averages hide celebrity accounts, flash sales, launch events, and uneven partitions. Ask whether the workload is uniform or bursty.' },
    ],
    callout: { title: 'Interview arithmetic', body: 'Keep the units visible, round at each step, and state whether your peak factor, payload size, and retention are assumptions. Interviewers are evaluating the reasoning, not the exact multiplier.' },
  },
  {
    id: 'architecture',
    title: 'The reference architecture',
    eyebrow: 'FOLLOW THE REQUEST',
    intro: 'A useful starting point is a request path plus an asynchronous path. This is a vocabulary set, not a mandatory stack: most interview designs need only a subset.',
    architecture: ['Client', 'Edge / CDN', 'Load balancer', 'Stateless API', 'Cache', 'Primary store', 'Event log / queue', 'Workers', 'Object storage'],
    cards: [
      { title: 'Synchronous path', body: 'Client → edge → load balancer → stateless service → cache/database → response. Keep the critical path short and put timeouts on every network hop.' },
      { title: 'Asynchronous path', body: 'Service validates and records intent, then publishes work. Consumers process independently, retry safely, and expose completion or status where the product needs it.' },
      { title: 'Control plane vs data plane', body: 'The control plane configures and coordinates; the data plane serves user traffic. A healthy design avoids making every request depend on a fragile coordinator.' },
      { title: 'Boundary discipline', body: 'Name ownership: which component owns a record, enforces authorization, retries, deduplicates, and emits events? Ambiguous ownership becomes a consistency bug.' },
    ],
    callout: { title: 'Add complexity only with a reason', body: '“We need a queue because thumbnail generation is slow and can happen after the upload response.” is a design argument. “Every modern system needs Kafka” is not.' },
  },
  {
    id: 'data-modeling',
    title: 'Data modeling and storage choices',
    eyebrow: 'PICK FOR ACCESS PATTERNS',
    intro: 'Start from the queries and invariants. Choose a store based on access patterns, transaction boundaries, growth, operational constraints, and failure behavior—not fashion.',
    rows: [
      { label: 'Relational database', bestFor: 'Relations, joins, constraints, transactions, and flexible queries.', tradeoff: 'Vertical limits and cross-shard joins/transactions need deliberate handling at very large scale.' },
      { label: 'Key-value / wide-column', bestFor: 'Known key-based access, high throughput, predictable partitioned workloads.', tradeoff: 'Data modeling is query-led; ad hoc queries and relational constraints are limited.' },
      { label: 'Document store', bestFor: 'Aggregate-shaped records with evolving fields and localized reads.', tradeoff: 'Duplicated data complicates updates; multi-document guarantees vary by product.' },
      { label: 'Search index', bestFor: 'Text relevance, faceting, and rich search over indexed content.', tradeoff: 'Usually derived and eventually consistent; it should not silently become the system of record.' },
      { label: 'Object storage', bestFor: 'Large blobs, media, backups, and immutable artifacts.', tradeoff: 'Not a low-latency transactional row store; metadata and access control need separate design.' },
      { label: 'Cache / in-memory store', bestFor: 'Ephemeral hot data, counters, sessions, and low-latency lookups.', tradeoff: 'Eviction, durability, memory cost, and stale values are part of the correctness story.' },
    ],
    cards: [
      { title: 'Define entities and ownership', body: 'For each entity, identify its authoritative writer, primary key, lifecycle, retention, and whether deletion must propagate to derived copies.' },
      { title: 'Indexes are workload choices', body: 'An index speeds selected reads at the cost of write amplification, storage, and maintenance. Name the query it serves and the cardinality it expects.' },
      { title: 'Normalize or denormalize?', body: 'Normalize to preserve update integrity; duplicate strategically when it removes an expensive read or enables independent scaling. Name the repair/update mechanism.' },
      { title: 'Multi-tenancy', body: 'Choose tenant isolation, partition key, quotas, and noisy-neighbor controls deliberately. A tenant ID in every row is not itself an isolation policy.' },
    ],
    callout: { title: 'Interview signal', body: 'Say “I would use a relational store because booking requires a unique seat claim and transactional invariant; I’d revisit partitioning when one writer or dataset outgrows a single node.” Tie the choice to a requirement.' },
  },
  {
    id: 'distributed-systems',
    title: 'Consistency, replication, and distributed reality',
    eyebrow: 'THE TRADE-OFFS INTERVIEWERS PROBE',
    intro: 'Networks delay, drop, duplicate, and reorder messages. Processes pause or crash. A distributed design needs explicit semantics for reads, writes, retries, and conflicting updates.',
    cards: [
      { title: 'Consistency spectrum', tag: 'READ SEMANTICS', body: 'Strong/linearizable reads act as if operations happened atomically in a single global order. Eventual consistency permits replicas to lag and converge if updates stop. Session guarantees such as read-your-writes can sit between these choices.' },
      { title: 'Replication', tag: 'DURABILITY + READ SCALE', body: 'Leader/follower replication centralizes writes but followers may lag. Multi-leader or leaderless designs improve write locality or availability but make conflict detection, ordering, and repair more complex.' },
      { title: 'CAP, stated carefully', tag: 'PARTITION CASE', body: 'When a network partition prevents coordination, a system must choose whether to reject/delay some operations to preserve a consistency guarantee or continue serving potentially divergent results. CAP is not a general “pick any two” menu for normal operation.' },
      { title: 'Quorums are assumptions', tag: 'R + W > N', body: 'For N replicas, read quorum R and write quorum W with R + W > N can force overlap under a simple versioned-replica model. It does not alone guarantee linearizability; membership, concurrent writes, version resolution, and failure handling matter.' },
      { title: 'Clocks are not truth', tag: 'ORDERING', body: 'Wall clocks can drift and jump. Timestamps alone do not prove causality. Use database/consensus ordering, logical versions, or explicit conflict policies when order matters.' },
      { title: 'Exactly-once claims', tag: 'END-TO-END', body: 'Networks and consumers commonly retry. Prefer at-least-once delivery plus idempotent effects, stable operation IDs, and deduplication at the state change. A broker’s delivery mode does not automatically make external side effects exactly once.' },
    ],
    callout: { title: 'Ask what may be stale', body: 'A global profile page may tolerate seconds of replica lag; a payment balance, inventory decrement, or seat reservation may require serialization or a conditional atomic update.' },
  },
  {
    id: 'caching',
    title: 'Caching and read-path design',
    eyebrow: 'LATENCY, LOAD, AND STALENESS',
    intro: 'A cache is a copy with its own failure and invalidation policy. Explain which data is cached, how it is populated, how it expires, and what happens when it is unavailable.',
    cards: [
      { title: 'Cache-aside', tag: 'COMMON DEFAULT', body: 'Application checks cache; on miss it reads the source and populates the cache. Simple and flexible, but concurrent misses can stampede and writes can leave stale entries.' },
      { title: 'Write-through', tag: 'FRESHER CACHE', body: 'Write to cache and backing store as one application operation. Reads are warm, but write latency and partial failure coordination increase.' },
      { title: 'Write-behind', tag: 'FAST ACK, MORE RISK', body: 'Acknowledge after cache and persist later. It can improve write throughput, but data loss, replay, ordering, and shutdown durability must be addressed.' },
      { title: 'Invalidation strategies', tag: 'MAKE IT EXPLICIT', body: 'TTL bounds staleness but does not provide immediate freshness. Event invalidation is faster but can be lost or reordered. Versioned keys make old entries unreachable but require cleanup.' },
      { title: 'Stampede protection', tag: 'BURST CONTROL', body: 'Use request coalescing, bounded refresh concurrency, jittered TTLs, stale-while-revalidate, or per-key locks. Avoid one synchronized expiry time for a massive key population.' },
      { title: 'Negative caching', tag: 'MISS AMPLIFICATION', body: 'Short-lived “not found” entries can protect the source from repeated misses, but authorization-sensitive and newly created records require careful invalidation.' },
    ],
    callout: { title: 'Always answer the cache outage question', body: 'Can the source handle the full traffic surge? If not, describe rate limiting, stale responses, load shedding, or a degraded mode. A cache that is required for correctness is not merely an optimization.' },
  },
  {
    id: 'async-messaging',
    title: 'Queues, streams, and asynchronous work',
    eyebrow: 'DECOUPLE WITHOUT LOSING CONTROL',
    intro: 'Messaging absorbs bursts and decouples producers from consumers, but it moves complexity into lag, retries, ordering, duplicates, and poison messages.',
    rows: [
      { label: 'Work queue', bestFor: 'Distribute independent jobs among workers; each job is normally completed by one consumer.', tradeoff: 'Visibility timeouts, retries, dead-lettering, fairness, and per-job idempotency need policy.' },
      { label: 'Append-only event log', bestFor: 'Retain ordered events per partition and allow consumer groups to replay independently.', tradeoff: 'Ordering is generally within a partition; retention, offsets, schema evolution, and replay load matter.' },
      { label: 'Pub/sub notification', bestFor: 'Fan out a signal to multiple independent subscribers.', tradeoff: 'Delivery guarantees and retained history differ by system; consumers may need reconciliation.' },
    ],
    cards: [
      { title: 'Transactional outbox', body: 'Write business state and an outbox record in one database transaction. A relay publishes the event and marks progress; consumers deduplicate by event ID. This closes the DB-commit/message-publish gap.' },
      { title: 'Retry with limits', body: 'Use exponential backoff with jitter, classify retryable errors, cap attempts or age, and send poison work to a dead-letter path with alerts and replay tooling.' },
      { title: 'Backpressure', body: 'Monitor queue age and depth, cap in-flight work, slow producers or shed optional work when consumers fall behind. Queue depth alone hides whether old work is already violating user-facing deadlines.' },
      { title: 'Sagas and compensation', body: 'For a multi-service workflow without a global transaction, record steps and outcomes. On failure, run compensating actions where possible; compensation is a new business action, not a perfect rollback.' },
    ],
    callout: { title: 'Async is a product decision', body: 'If the user needs an immediate result, a queue does not make the latency requirement disappear. Return a job ID/status or keep the operation synchronous and bound its work.' },
  },
  {
    id: 'scaling',
    title: 'Scale-out, partitioning, and hot spots',
    eyebrow: 'GROWTH PATHS',
    intro: 'Scale the constrained resource first. Horizontal scaling works best when requests are independent, state ownership is clear, and work can be distributed evenly.',
    cards: [
      { title: 'Stateless application tier', body: 'Keep durable user state outside instances so nodes can be added or replaced freely. Sessions can use signed client tokens or shared state, each with privacy and revocation trade-offs.' },
      { title: 'Partition key', body: 'Choose a key with high cardinality and even access while preserving the queries and transactions you need. User ID, tenant, geography, and time each skew different workloads.' },
      { title: 'Hot partitions', body: 'A popular key can overload one shard even when total capacity looks healthy. Split or salt hot keys, pre-aggregate, cache, or route exceptionally popular entities through a special path.' },
      { title: 'Rebalancing', body: 'Adding shards can move data and change routing. Plan ownership maps, migration/dual-read strategy, consistency checks, rollback, and the extra load caused by copying.' },
      { title: 'Read replicas', body: 'Replicas can serve read-heavy traffic but may lag, so define which endpoints tolerate stale reads and how clients avoid read-your-write surprises.' },
      { title: 'Multi-region', body: 'Place reads near users and define write authority, replication lag, failover conditions, data residency, and split-brain prevention. “Active-active” needs a conflict model.' },
    ],
    callout: { title: 'Avoid premature sharding', body: 'Sharding can solve a real storage or throughput ceiling, but adds routing, resharding, cross-shard queries, and operational load. Start with a design that has a credible growth path and state the trigger to shard.' },
  },
  {
    id: 'reliability',
    title: 'Reliability, availability, and graceful failure',
    eyebrow: 'DESIGN FOR PARTIAL FAILURE',
    intro: 'Reliability comes from clear service objectives, bounded dependencies, tested recovery, and reducing blast radius. Redundancy helps only when failover itself works.',
    cards: [
      { title: 'SLI / SLO / SLA', tag: 'MEASURE → TARGET → COMMITMENT', body: 'An SLI is a measured service property; an SLO is the target for it over a window; an SLA is an external commitment with consequences. Choose indicators users experience: successful requests, latency percentiles, and durable writes.' },
      { title: 'Timeouts and deadlines', body: 'Set finite timeouts on remote calls and propagate an overall deadline. A retry that cannot finish before the user deadline amplifies load without improving the result.' },
      { title: 'Retries with jitter', body: 'Retry only safe or idempotent operations, for transient failures, with exponential backoff, jitter, and a budget. Unbounded synchronized retries create retry storms.' },
      { title: 'Bulkheads and circuit breakers', body: 'Limit concurrency per dependency or tenant; stop calling a clearly failing dependency temporarily. Provide a controlled fallback and a probe path to recovery.' },
      { title: 'Graceful degradation', body: 'Keep core flows alive while disabling recommendations, nonessential fan-out, or expensive enrichments. Decide which features can be stale, delayed, or omitted.' },
      { title: 'Recovery objectives', body: 'RTO is the targeted time to restore service; RPO is the targeted tolerated data-loss window. Backups are only useful if restore time and correctness are exercised.' },
    ],
    callout: { title: 'Availability arithmetic', body: 'If independent serial dependencies each succeed with probability p, the path availability is roughly the product of their availabilities. Real failures are correlated, so reduce dependencies and blast radius rather than relying only on the arithmetic.' },
  },
  {
    id: 'security-api',
    title: 'API design, security, and abuse resistance',
    eyebrow: 'CORRECTNESS IN THE REAL WORLD',
    intro: 'Security is part of architecture. Show where identity is established, what each request is authorized to do, and how sensitive data is protected through storage, logs, and operations.',
    cards: [
      { title: 'Authentication vs authorization', body: 'Authentication identifies a principal; authorization checks its action on a specific resource. Enforce authorization server-side at the resource boundary, not only in the UI.' },
      { title: 'API contracts', body: 'Define pagination, filtering, sorting, idempotency keys, validation, error shapes, versioning, and compatibility. Cursor pagination is often more stable than offset for changing large collections.' },
      { title: 'Abuse controls', body: 'Apply rate limits by a meaningful identity (account, API key, tenant, or IP), quotas, bot signals, payload limits, and fair-use controls. Define behavior when the limiter itself is unavailable.' },
      { title: 'Protect data', body: 'Encrypt in transit and at rest, minimize collection and retention, scope secrets, rotate credentials, audit privileged actions, and redact tokens or personal data from logs.' },
      { title: 'Idempotent writes', body: 'For payment-like or retried operations, bind an idempotency key to the authenticated caller and request intent, store the outcome, and return that outcome for duplicates.' },
      { title: 'Threat boundaries', body: 'Name trust boundaries, validate untrusted input, prevent cross-tenant access, defend against replay and enumeration, and constrain internal service credentials.' },
    ],
    callout: { title: 'Do not invent compliance guarantees', body: 'If the prompt adds regulated data or residency constraints, clarify the actual requirement and scope. Describe concrete controls and auditability without claiming certification.' },
  },
  {
    id: 'observability',
    title: 'Observability and operations',
    eyebrow: 'KNOW WHEN IT IS BROKEN',
    intro: 'Make system behavior diagnosable from the outside and from internal signals. Alert on actionable user-impacting symptoms; use detailed telemetry to locate likely causes.',
    cards: [
      { title: 'Metrics', body: 'Track request rate, errors, latency distributions, and saturation. Include queue age, cache hit rate, database pool usage, replication lag, and per-dependency health where they answer a diagnostic question.' },
      { title: 'Logs', body: 'Use structured events with request/trace IDs and safe context. Avoid secrets and high-cardinality identifiers as unbounded metric labels.' },
      { title: 'Traces', body: 'Trace a request across services to find slow or failing hops. Propagate trace context through asynchronous messages and preserve causality links when work is resumed later.' },
      { title: 'Alerting', body: 'Page on symptoms that need immediate human action and have a runbook. Route lower-severity capacity or trend concerns to tickets; noisy pages train people to ignore pages.' },
      { title: 'Deployment safety', body: 'Use gradual rollouts, health gates, fast rollback, schema-compatible migrations, and feature flags with ownership and expiration. Observe user-facing indicators during rollout.' },
      { title: 'Capacity and cost', body: 'Track saturation and unit economics such as cost per request or stored GB. Autoscaling needs meaningful signals, warm-up allowance, maximum bounds, and protection from positive feedback loops.' },
    ],
    callout: { title: 'Four useful golden signals', body: 'Latency, traffic, errors, and saturation provide a compact first view of a service. Pair them with product-specific indicators such as successful checkout rate or durable upload completion.' },
  },
  {
    id: 'design-walkthroughs',
    title: 'Four interview design walkthroughs',
    eyebrow: 'PATTERNS TO PRACTICE',
    intro: 'Treat each as a starting sketch. A good answer changes when the requirements change; memorize the reasoning and failure modes, not a fixed diagram.',
    cards: [
      { title: 'URL shortener', tag: 'KEYS + REDIRECT HOT PATH', body: 'Write path: validate destination → allocate unique short ID → persist mapping. Read path: resolve ID from cache, then store; redirect. Discuss collision strategy, abuse/phishing checks, expiry, analytics asynchronously, hot links, and cache stampede. A unique database constraint makes concurrent creation safe.' },
      { title: 'News feed', tag: 'FAN-OUT TRADE-OFF', body: 'Store posts as the source of truth. Fan-out-on-write gives fast reads but expensive writes for high-follower accounts; fan-out-on-read saves write work but makes reads heavier. Hybridize celebrity accounts, rank separately, and define feed freshness and deduplication.' },
      { title: 'Rate limiter', tag: 'DISTRIBUTED STATE', body: 'Choose token bucket for bursts with a sustained rate, or sliding-window variants for tighter bounds. Decide key dimensions and whether limits are global or regional. Atomic server-side updates, clock/window boundaries, store failure mode, and eventual cross-region counters are core trade-offs.' },
      { title: 'Chat / messaging', tag: 'ORDER + DELIVERY', body: 'Model conversations and membership; persist messages before acknowledging. Partition by conversation for local ordering; use a durable log/queue for fan-out and offline delivery. Discuss reconnect cursors, deduplication, presence as ephemeral state, push notifications, media storage, and abuse/privacy controls.' },
      { title: 'Image upload and processing', tag: 'BLOB + ASYNC PIPELINE', body: 'Issue a scoped upload URL, store originals in object storage, emit an upload event, process thumbnails asynchronously, and publish status. Make workers idempotent; bound image dimensions, validate content, quarantine unsafe files, and serve derivatives through a CDN.' },
      { title: 'Ticket / seat booking', tag: 'CONTENTION + INVARIANTS', body: 'The core invariant is one active claim per seat per event. Use a conditional write or transaction, short-lived holds, expiration, idempotent payment confirmation, and an explicit state machine. Queue or shape flash-sale traffic; never trust a cache alone to prevent double booking.' },
    ],
    callout: { title: 'Deep-dive prompt', body: 'For any design, ask: what is the authoritative state? What happens if this request is retried? Where can data be stale? Which partition can become hot? What can fail independently? How do we notice and recover?' },
  },
  {
    id: 'tradeoff-review',
    title: 'Trade-off review and common traps',
    eyebrow: 'SAY WHY, NOT JUST WHAT',
    intro: 'A design is a set of choices under constraints. Explicitly state what each choice optimizes and what complexity it introduces.',
    rows: [
      { label: 'SQL vs NoSQL', bestFor: 'SQL when relational integrity, ad hoc queries, and transactions dominate; NoSQL when access patterns and distribution requirements fit its model.', tradeoff: 'Both scale; compare the actual data model, consistency contract, and operations instead of repeating “SQL does not scale.”' },
      { label: 'Sync vs async', bestFor: 'Synchronous when a response must include the outcome; asynchronous for independent slow work or burst absorption.', tradeoff: 'Async adds eventual completion, retries, duplicate delivery, status, and reconciliation.' },
      { label: 'Push vs pull / fan-out', bestFor: 'Push when consumers need updates quickly; pull when consumers control pace or many consumers replay.', tradeoff: 'Push can overload slow consumers; pull may add lag and polling cost.' },
      { label: 'Strong vs eventual consistency', bestFor: 'Strong for invariants and immediate read-after-write; eventual for tolerant views and high availability/locality.', tradeoff: 'The product must explain stale reads and conflict resolution; eventual does not mean “never correct.”' },
      { label: 'Precompute vs compute on read', bestFor: 'Precompute hot results to make reads cheap; compute on read when writes are frequent or freshness matters.', tradeoff: 'Precomputation introduces invalidation, fan-out cost, and repair/rebuild work.' },
    ],
    cards: [
      { title: 'Common weak answers', body: 'Adding every technology by default; quoting “CAP two of three”; claiming exactly-once without a boundary; ignoring data ownership; using average latency only; saying “add replicas” without lag semantics; and drawing boxes without request flows.' },
      { title: 'Upgrade a weak answer', body: 'State a requirement → identify the bottleneck or invariant → choose the simplest mechanism → name the trade-off → explain the fallback and measurement. This turns a component list into an engineering argument.' },
    ],
  },
  {
    id: 'sources-roadmap',
    title: 'Reference shelf and study sequence',
    eyebrow: 'PRIMARY ENGINEERING SOURCES',
    intro: 'Use vendor and project documentation to verify guarantees. Product behavior varies by configuration and version; interview notes are a map, not a substitute for the service contract.',
    cards: [
      { title: 'Google SRE Book · Service Level Objectives', body: 'SLIs, SLOs, SLAs, user-centric indicators, and error budgets.', tag: 'RELIABILITY' },
      { title: 'Google SRE Book · Monitoring Distributed Systems', body: 'Four golden signals, white-box vs black-box monitoring, actionable alerts, and symptoms vs causes.', tag: 'OPERATIONS' },
      { title: 'AWS Well-Architected Framework', body: 'Operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability as review lenses.', tag: 'ARCHITECTURE' },
      { title: 'PostgreSQL · Transaction Isolation', body: 'Concrete definitions and anomalies for transaction isolation levels in a widely used relational database.', tag: 'DATA' },
      { title: 'Google Cloud Spanner · External Consistency', body: 'A concrete distributed database design for externally consistent transactions and the role of commit ordering.', tag: 'CONSISTENCY' },
      { title: 'Redis · Coding Patterns', body: 'Practical client-side patterns and operational considerations for using Redis safely.', tag: 'CACHING' },
    ],
    callout: { title: 'Suggested four-week sequence', body: 'Week 1: interview method, estimation, APIs, and storage. Week 2: replication, consistency, caches, and queues. Week 3: reliability, security, observability, and capacity. Week 4: practice one design aloud each day, then review assumptions and failure cases.' },
  },
];

const sources = [
  { label: 'Google SRE Book: Service Level Objectives', url: 'https://sre.google/sre-book/service-level-objectives/' },
  { label: 'Google SRE Book: Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
  { label: 'AWS Well-Architected Framework', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
  { label: 'AWS Reliability Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html' },
  { label: 'PostgreSQL: Transaction Isolation', url: 'https://www.postgresql.org/docs/current/transaction-iso.html' },
  { label: 'Google Cloud Spanner: External Consistency', url: 'https://cloud.google.com/spanner/docs/true-time-external-consistency' },
  { label: 'Redis Documentation: Coding Patterns', url: 'https://redis.io/docs/latest/develop/clients/patterns/' },
  { label: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/' },
];

const icons = [Layers, Gauge, Network, Database, CircleHelp, Search, Workflow, ArrowDown, ShieldCheck, BookOpen, ArrowUpRight, Clock3, ChevronRight, BookOpen];
const reviewedStorageKey = 'algo-notes-system-design-reviewed';

function loadReviewed(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(reviewedStorageKey) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function StudyPlanHome({
  onNavigate,
  completedDsa,
  reviewedDesign,
}: {
  onNavigate: (track: Track) => void;
  completedDsa: number;
  reviewedDesign: number;
}) {
  return (
    <div className="study-hub">
      <header className="study-hub-header">
        <button className="sd-brand" onClick={() => onNavigate('study-plan')}><span className="sd-brand-mark">an</span><span>algo notes<small>INTERVIEW STUDY DESK</small></span></button>
        <nav className="sd-track-nav" aria-label="Study tracks">
          <button className="is-current" onClick={() => onNavigate('study-plan')}>Study plan</button>
          <button onClick={() => onNavigate('data-structures')}>Data structures & algorithms</button>
          <button onClick={() => onNavigate('theory')}>Theory</button>
          <button onClick={() => onNavigate('system-design')}>System design</button>
        </nav>
      </header>

      <main className="hub-main">
        <div className="hub-overline"><span /> PERSONAL STUDY PLAN <span className="hub-date">TWO TRACKS · ONE INTERVIEW GOAL</span></div>
        <section className="hub-intro">
          <div><h1>Build range.<br /><em>Then build depth.</em></h1><p>Choose a track to pick up where you left off. Your DSA completions and guide review progress stay saved in this browser.</p></div>
          <div className="hub-index"><span>YOUR WORKSPACE</span><b>01 <i>/</i> 02</b><small>LEARNING TRACKS</small></div>
        </section>

        <section className="track-grid" aria-label="Learning tracks">
          <button className="track-card track-dsa" onClick={() => onNavigate('data-structures')}>
            <div className="track-card-top"><span className="track-icon"><BracesIcon /></span><span className="track-number">TRACK 01</span><ArrowUpRight size={19} /></div>
            <div className="track-card-content"><span className="track-kicker">PROBLEM SOLVING</span><h2>Data structures<br />& algorithms</h2><p>150 curated interview problems with clear baselines, optimal solutions, and step-through traces.</p></div>
            <div className="track-card-bottom"><div><b>{completedDsa}<span> / 150</span></b><small>PROBLEMS COMPLETE</small></div><div className="track-progress"><span style={{ width: `${Math.min(100, completedDsa / 150 * 100)}%` }} /></div></div>
          </button>

          <button className="track-card track-sys" onClick={() => onNavigate('system-design')}>
            <div className="track-card-top"><span className="track-icon"><Network size={19} /></span><span className="track-number">TRACK 02</span><ArrowUpRight size={19} /></div>
            <div className="track-card-content"><span className="track-kicker">ARCHITECTURE THINKING</span><h2>System<br />design</h2><p>An interview field guide to scale, data, distributed systems, reliability, security, and design trade-offs.</p></div>
            <div className="track-card-bottom"><div><b>{reviewedDesign}<span> / {chapters.length}</span></b><small>GUIDE SECTIONS REVIEWED</small></div><div className="track-progress"><span style={{ width: `${Math.min(100, reviewedDesign / chapters.length * 100)}%` }} /></div></div>
          </button>
        </section>

        <section className="hub-method">
          <div className="method-heading"><span className="section-kicker">HOW TO USE THE PLAN</span><span className="method-line" /></div>
          <div className="method-steps"><div><span>01</span><b>Choose a track</b><p>Work on coding fluency and architecture reasoning in parallel.</p></div><div><span>02</span><b>Study actively</b><p>Explain decisions aloud; use dry runs and design prompts to test your understanding.</p></div><div><span>03</span><b>Mark progress</b><p>Completions are stored locally so you can resume on this device.</p></div></div>
        </section>
        <footer className="hub-footer"><span>ALGO NOTES <i>·</i> YOUR INTERVIEW STUDY DESK</span><span>PROGRESS SAVED LOCALLY</span></footer>
      </main>
    </div>
  );
}

function BracesIcon() {
  return <span className="braces-glyph">{'{ }'}</span>;
}

export function SystemDesignGuide({ onNavigate }: { onNavigate: (track: Track) => void }) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [query, setQuery] = useState('');
  const [reviewed, setReviewed] = useState(loadReviewed);
  const activeIndex = chapters.findIndex((chapter) => chapter.id === activeChapterId);
  const chapter = chapters[activeIndex] ?? chapters[0];
  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return chapters.filter((item) => !normalized || `${item.title} ${item.eyebrow} ${item.intro}`.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    try {
      localStorage.setItem(reviewedStorageKey, JSON.stringify(reviewed));
    } catch {
      // Keep section review usable in the current session when storage is unavailable.
    }
  }, [reviewed]);

  const markReviewed = () => setReviewed((current) => current.includes(chapter.id)
    ? current.filter((id) => id !== chapter.id)
    : [...current, chapter.id]);
  const moveChapter = (direction: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, activeIndex + direction));
    setActiveChapterId(chapters[next].id);
  };

  return (
    <div className="sd-app">
      <header className="sd-topbar">
        <button className="sd-brand" onClick={() => onNavigate('study-plan')}><span className="sd-brand-mark">an</span><span>algo notes<small>INTERVIEW STUDY DESK</small></span></button>
        <nav className="sd-track-nav" aria-label="Study tracks">
          <button onClick={() => onNavigate('study-plan')}>Study plan</button>
          <button onClick={() => onNavigate('data-structures')}>Data structures & algorithms</button>
          <button onClick={() => onNavigate('theory')}>Theory</button>
          <button className="is-current" onClick={() => onNavigate('system-design')}>System design</button>
        </nav>
        <div className="sd-progress"><span>{reviewed.length} / {chapters.length} REVIEWED</span><div><i style={{ width: `${reviewed.length / chapters.length * 100}%` }} /></div></div>
      </header>

      <div className="sd-layout">
        <aside className="sd-sidebar">
          <div className="sd-sidebar-heading"><span className="section-kicker">SYSTEM DESIGN GUIDE</span><span className="sd-live-dot" /></div>
          <label className="sd-search"><Search size={15} /><input aria-label="Search guide sections" placeholder="Find a concept" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <nav className="sd-chapter-nav" aria-label="System design topics">
            {filteredChapters.map((item) => {
              const index = chapters.indexOf(item);
              const Icon = icons[index];
              return <button key={item.id} className={item.id === chapter.id ? 'sd-chapter-active' : ''} onClick={() => setActiveChapterId(item.id)}><span className="sd-chapter-index">{String(index + 1).padStart(2, '0')}</span><Icon size={15} /><span className="sd-chapter-title">{item.title}</span>{reviewed.includes(item.id) && <Check size={13} className="sd-chapter-check" />}</button>;
            })}
            {filteredChapters.length === 0 && <p className="sd-no-results">No matching sections.</p>}
          </nav>
          <div className="sd-sidebar-foot"><span>PRIMARY SOURCE LINKS</span><b>{sources.length} references</b><small>Official engineering documentation</small></div>
        </aside>

        <main className="sd-content">
          <div className="sd-breadcrumb"><button onClick={() => onNavigate('study-plan')}>STUDY PLAN</button><ChevronRight size={12} /><span>SYSTEM DESIGN</span><ChevronRight size={12} /><b>{String(activeIndex + 1).padStart(2, '0')}</b></div>
          <div className="sd-article-head">
            <div><div className="sd-eyebrow"><span>{chapter.eyebrow}</span><span>FIELD GUIDE · OCT 2026</span></div><h1>{chapter.title}</h1><p>{chapter.intro}</p></div>
            <button className={`sd-reviewed-button ${reviewed.includes(chapter.id) ? 'is-reviewed' : ''}`} onClick={markReviewed} aria-pressed={reviewed.includes(chapter.id)}><Check size={15} />{reviewed.includes(chapter.id) ? 'Reviewed' : 'Mark reviewed'}</button>
          </div>

          {chapter.steps && <div className="sd-step-list">{chapter.steps.map((step, index) => <article className="sd-step" key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{step.title}</h2><p>{step.body}</p></div></article>)}</div>}

          {chapter.architecture && <div className="sd-architecture"><div className="sd-arch-label">COMMON REQUEST PATH <span>ILLUSTRATIVE, NOT PRESCRIPTIVE</span></div><div className="sd-arch-flow">{chapter.architecture.map((node, index) => <div className="sd-arch-node" key={node}><span>{node}</span>{index < chapter.architecture!.length - 1 && <ArrowRight size={14} />}</div>)}</div><div className="sd-arch-note">The queue and worker branch is asynchronous; object storage commonly serves large media outside the transactional request path.</div></div>}

          {chapter.formula && <div className="sd-formula-grid">{chapter.formula.map((item, index) => <article className="sd-formula" key={item.label}><span>ESTIMATE {String(index + 1).padStart(2, '0')}</span><h2>{item.label}</h2><code>{item.value}</code><p>{item.note}</p></article>)}</div>}

          {chapter.rows && <div className="sd-table-wrap"><table className="sd-table"><thead><tr><th>CHOICE</th><th>GOOD FIT WHEN</th><th>TRADE-OFF TO NAME</th></tr></thead><tbody>{chapter.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.bestFor}</td><td>{row.tradeoff}</td></tr>)}</tbody></table></div>}

          {chapter.cards && <div className="sd-card-grid">{chapter.cards.map((card) => <article className="sd-concept-card" key={card.title}><div className="sd-card-top"><span>{card.tag ?? 'CORE CONCEPT'}</span><ArrowUpRight size={14} /></div><h2>{card.title}</h2><p>{card.body}</p></article>)}</div>}

          {chapter.callout && <aside className="sd-callout"><span className="sd-callout-mark">↗</span><div><span className="section-kicker">PUT IT INTO WORDS</span><h2>{chapter.callout.title}</h2><p>{chapter.callout.body}</p></div></aside>}

          {chapter.id === 'sources-roadmap' && <div className="sd-source-list"><div className="section-kicker">OPEN THE PRIMARY SOURCES</div>{sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index + 1).padStart(2, '0')}</span><b>{source.label}</b><ArrowUpRight size={15} /></a>)}</div>}

          <footer className="sd-chapter-footer"><span>SECTION {String(activeIndex + 1).padStart(2, '0')} <i>/ {String(chapters.length).padStart(2, '0')}</i></span><div><button onClick={() => moveChapter(-1)} disabled={activeIndex === 0}><ArrowLeft size={15} /> Previous</button><button onClick={() => moveChapter(1)} disabled={activeIndex === chapters.length - 1}>Next section <ArrowRight size={15} /></button></div></footer>
        </main>
      </div>
    </div>
  );
}
