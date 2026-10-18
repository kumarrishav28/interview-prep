import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Check,
  CircleDot,
  Code2,
  Command,
  FileText,
  Gauge,
  Layers,
  Menu,
  Play,
  Search,
  X,
} from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { categorySlug } from './theorySlug';

const TheoryPage = lazy(() => import('./TheoryPage').then((module) => ({ default: module.TheoryPage })));
const StudyPlanHome = lazy(() => import('./SystemDesignGuide').then((module) => ({ default: module.StudyPlanHome })));
const SystemDesignGuide = lazy(() => import('./SystemDesignGuide').then((module) => ({ default: module.SystemDesignGuide })));
const reviewedDesignStorageKey = 'algo-notes-system-design-reviewed';

type StudyTrack = 'study-plan' | 'data-structures' | 'system-design' | 'theory';

function getTrackFromHash(): StudyTrack {
  const hash = window.location.hash;
  if (hash === '#data-structures' || hash.startsWith('#data-structures/')) return 'data-structures';
  if (hash === '#system-design') return 'system-design';
  if (hash === '#theory' || hash.startsWith('#theory/')) return 'theory';
  return 'study-plan';
}

function getTheorySlugFromHash(): string {
  const match = /^#theory\/([^/?]+)/.exec(window.location.hash);
  return match ? decodeURIComponent(match[1]) : '';
}

function getProblemFromHash(): number | null {
  const match = /^#data-structures\/(\d+)$/.exec(window.location.hash);
  return match ? Number(match[1]) : null;
}

function loadReviewedDesignCount(): number {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(reviewedDesignStorageKey) ?? '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string').length : 0;
  } catch {
    return 0;
  }
}

type Lesson = {
  metadata: {
    problem_number: number;
    title: string;
    url: string;
    difficulty: string;
    category: string;
  };
  problem_summary: {
    summary: string;
    input_output: string;
    constraints: string[];
  };
  brute_force: Approach;
  optimized: Approach;
  dry_run: {
    sample_input: Record<string, unknown>;
    sample_output: unknown;
    steps: DryRunStep[];
    final_result: unknown;
  };
  edge_cases: { case: string; handling: string }[];
};

type Approach = {
  explanation: string;
  correctness_idea: string;
  language: string;
  code: string;
  time_complexity: string;
  space_complexity: string;
};

type DryRunStep = {
  sequence: number;
  event: string;
  variables: Record<string, number | string | boolean>;
  condition: string;
  action: string;
  state_before: Record<string, unknown>;
  state_after: Record<string, unknown>;
  focus?: { array: string; indices: number[] };
};

const completedProblemsKey = 'algo-notes-completed-problems';

const lessonFiles = import.meta.glob<Lesson>('./data/lessons/**/*.json', {
  eager: true,
  import: 'default',
});

const lessons = Object.values(lessonFiles).sort(
  (first, second) => first.metadata.problem_number - second.metadata.problem_number,
);
const categoryOrder = [
  'Array / String',
  'Two Pointers',
  'Sliding Window',
  'Matrix',
  'Hashmap',
  'Intervals',
  'Stack',
  'Linked List',
  'Binary Tree General',
  'Binary Tree BFS',
  'Binary Search Tree',
  'Graph General',
  'Graph BFS',
  'Trie',
  'Backtracking',
  'Divide & Conquer',
  "Kadane's Algorithm",
  'Binary Search',
  'Heap',
  'Bit Manipulation',
  'Math',
  '1D DP',
  'Multidimensional DP',
];
const availableCategories = new Set(lessons.map((lesson) => lesson.metadata.category));
const categories = [
  'All topics',
  ...categoryOrder.filter((category) => availableCategories.has(category)),
  ...[...availableCategories].filter((category) => !categoryOrder.includes(category)),
];

function displayValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function loadCompletedProblems(): number[] {
  try {
    const stored = JSON.parse(localStorage.getItem(completedProblemsKey) ?? '[]');
    return Array.isArray(stored) ? stored.filter((value): value is number => Number.isInteger(value)) : [];
  } catch {
    return [];
  }
}

function DryRunDialog({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = lesson.dry_run.steps;
  const step = steps[stepIndex];
  const visibleState = step?.state_after ?? lesson.dry_run.sample_input;
  const arrayEntries = Object.entries(visibleState).filter(([, value]) => Array.isArray(value));
  const activeIndices = step?.focus?.indices ?? [];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setStepIndex((current) => Math.min(steps.length - 1, current + 1));
      if (event.key === 'ArrowLeft') setStepIndex((current) => Math.max(0, current - 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, steps.length]);

  if (!step) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dry-run-dialog" role="dialog" aria-modal="true" aria-labelledby="dry-run-title">
        <header className="dialog-header">
          <div className="dialog-title-wrap">
            <div className="dialog-icon"><Play size={16} fill="currentColor" /></div>
            <div>
              <p className="dialog-eyebrow">INTERACTIVE TRACE · #{lesson.metadata.problem_number}</p>
              <h2 id="dry-run-title">{lesson.metadata.title}</h2>
            </div>
          </div>
          <button className="icon-button close-button" type="button" aria-label="Close dry run" onClick={onClose}><X size={19} /></button>
        </header>

        <div className="trace-progress-row">
          <span>STEP <b>{String(stepIndex + 1).padStart(2, '0')}</b> <span className="muted">/ {String(steps.length).padStart(2, '0')}</span></span>
          <div className="trace-progress" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
            {steps.map((item, index) => <span key={item.sequence} className={index <= stepIndex ? 'filled' : ''} />)}
          </div>
          <span className="key-hint"><kbd>←</kbd><kbd>→</kbd></span>
        </div>

        <div className="trace-content">
          <div className="trace-narrative">
            <div className="step-marker"><span>{String(step.sequence).padStart(2, '0')}</span><i /></div>
            <div>
              <p className="step-event">{step.event}</p>
              <p className="step-condition">{step.condition}</p>
              <div className="action-callout"><span className="action-arrow">↳</span>{step.action}</div>
            </div>
          </div>

          <div className="trace-visual">
            <div className="visual-heading">
              <div><span className="section-kicker">LIVE STATE</span><h3>Array after this move</h3></div>
              <span className="state-badge"><span /> UPDATED</span>
            </div>
            {arrayEntries.length > 0 ? arrayEntries.map(([name, values]) => (
              <div className="array-track-wrap" key={name}>
                <div className="array-label-row"><span className="array-name">{name}</span><span className="array-caption">index</span></div>
                <div className="array-track" aria-label={`${name} values after step ${step.sequence}`}>
                  {(values as unknown[]).map((value, index) => (
                    <div className={`array-cell ${activeIndices.includes(index) ? 'is-active' : ''} ${index < (Number(step.variables.write) || -1) ? 'is-quiet' : ''}`} key={`${name}-${index}`}>
                      <span className="cell-index">{index}</span><span className="cell-value">{String(value)}</span>
                      {activeIndices.includes(index) && <span className="cell-ping" />}
                    </div>
                  ))}
                </div>
              </div>
            )) : <pre className="state-fallback">{JSON.stringify(visibleState, null, 2)}</pre>}

            <div className="variable-grid">
              {Object.entries(step.variables).map(([name, value]) => (
                <div className="variable" key={name}><span>{name}</span><b>{String(value)}</b></div>
              ))}
            </div>
          </div>
        </div>

        <footer className="dialog-footer">
          <span className="final-value"><Check size={15} /> Final array <b>{displayValue(lesson.dry_run.final_result)}</b></span>
          <div className="step-controls">
            <button type="button" className="button button-secondary" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}><ArrowLeft size={16} /> Previous</button>
            <button type="button" className="button button-primary" onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))} disabled={stepIndex === steps.length - 1}>Next step <ArrowRight size={16} /></button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function App() {
  const [activeTrack, setActiveTrack] = useState<StudyTrack>(getTrackFromHash);
  const [theorySlug, setTheorySlug] = useState(getTheorySlugFromHash);
  const [activeCategory, setActiveCategory] = useState('All topics');
  const [search, setSearch] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(
    lessons.find((item) => item.metadata.problem_number === 88)?.metadata.problem_number ?? lessons[0]?.metadata.problem_number ?? 0,
  );
  const [activeApproach, setActiveApproach] = useState<'optimized' | 'brute_force'>('optimized');
  const [isDryRunOpen, setIsDryRunOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedProblems, setCompletedProblems] = useState(loadCompletedProblems);
  const [reviewedDesignCount, setReviewedDesignCount] = useState(loadReviewedDesignCount);

  useEffect(() => {
    const syncFromHash = () => {
      setActiveTrack(getTrackFromHash());
      setTheorySlug(getTheorySlugFromHash());
      const problemNumber = getProblemFromHash();
      const target = problemNumber === null ? undefined : lessons.find((item) => item.metadata.problem_number === problemNumber);
      if (target) {
        setSelectedNumber(target.metadata.problem_number);
        setActiveCategory(target.metadata.category);
        setSearch('');
        setActiveApproach('optimized');
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (activeTrack === 'study-plan') {
      setReviewedDesignCount(loadReviewedDesignCount());
    }
  }, [activeTrack]);

  const navigateTrack = (track: StudyTrack) => {
    if (window.location.hash !== `#${track}`) window.location.hash = track;
    setActiveTrack(track);
  };

  useEffect(() => {
    try {
      localStorage.setItem(completedProblemsKey, JSON.stringify(completedProblems));
    } catch {
      // Keep completion usable for this session if storage is unavailable.
    }
  }, [completedProblems]);

  const filteredLessons = useMemo(() => lessons.filter((lesson) => {
    const matchesCategory = activeCategory === 'All topics' || lesson.metadata.category === activeCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${lesson.metadata.problem_number} ${lesson.metadata.title} ${lesson.metadata.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [activeCategory, search]);
  const lesson = filteredLessons.find((item) => item.metadata.problem_number === selectedNumber) ?? filteredLessons[0];
  const approach = lesson?.[activeApproach];
  const optimized = lesson?.optimized;
  const completedCount = lessons.filter((item) => completedProblems.includes(item.metadata.problem_number)).length;
  const isLessonComplete = lesson ? completedProblems.includes(lesson.metadata.problem_number) : false;

  if (activeTrack === 'study-plan') {
    return <Suspense fallback={<div className="track-loading">Loading study plan...</div>}><StudyPlanHome onNavigate={navigateTrack} completedDsa={completedCount} reviewedDesign={reviewedDesignCount} /></Suspense>;
  }

  if (activeTrack === 'theory') {
    const problems = lessons.map((item) => ({
      number: item.metadata.problem_number,
      title: item.metadata.title,
      difficulty: item.metadata.difficulty,
      category: item.metadata.category,
    }));
    return <Suspense fallback={<div className="track-loading">Loading theory...</div>}><TheoryPage slug={theorySlug} problems={problems} completed={completedProblems} onNavigate={navigateTrack} /></Suspense>;
  }

  if (activeTrack === 'system-design') {
    return <Suspense fallback={<div className="track-loading">Loading System Design guide...</div>}><SystemDesignGuide onNavigate={navigateTrack} /></Suspense>;
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span>an</span><i /></div>
          <div><span className="brand-name">algo notes</span><span className="brand-subtitle">INTERVIEW STUDY DESK</span></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <div className="sidebar-search">
          <Search size={16} />
          <input aria-label="Search problems" placeholder="Find a problem" value={search} onChange={(event) => setSearch(event.target.value)} />
          <kbd>/</kbd>
        </div>

        <div className="nav-label">LIBRARY <span>{String(lessons.length).padStart(2, '0')}</span></div>
        <nav className="category-list" aria-label="Problem categories">
          {categories.map((category, index) => {
            const count = category === 'All topics' ? lessons.length : lessons.filter((item) => item.metadata.category === category).length;
            return (
              <div className="category-row" key={category}>
                <button className={`category-item ${activeCategory === category ? 'category-active' : ''}`} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>
                  {index === 0 ? <LayersIcon /> : <CircleDot size={15} strokeWidth={1.7} />}
                  <span>{category}</span><small>{String(count).padStart(2, '0')}</small>
                </button>
                {index > 0 && <a className="theory-link" href={`#theory/${categorySlug(category)}`} aria-label={`Read ${category} theory`} title={`Read ${category} theory`}><BookOpen size={13} /></a>}
              </div>
            );
          })}
        </nav>

        <div className="nav-label problem-list-label">{activeCategory === 'All topics' ? 'ALL PROBLEMS' : activeCategory.toUpperCase()} <span>{String(filteredLessons.length).padStart(2, '0')}</span></div>
        <nav className="problem-list" aria-label="Problems">
          {filteredLessons.length > 0 ? filteredLessons.map((item) => (
            <button
              className={`problem-item ${lesson?.metadata.problem_number === item.metadata.problem_number ? 'problem-active' : ''}`}
              key={item.metadata.problem_number}
              onClick={() => { setSelectedNumber(item.metadata.problem_number); setSidebarOpen(false); }}
            >
              <span className="problem-item-number">{String(item.metadata.problem_number).padStart(3, '0')}</span>
              <span className="problem-item-title">{item.metadata.title}</span>
              {completedProblems.includes(item.metadata.problem_number)
                ? <Check size={12} className="problem-completed-check" aria-label="Completed" />
                : <span className={`problem-item-difficulty difficulty-${item.metadata.difficulty.toLowerCase()}`} />}
            </button>
          )) : <p className="problem-list-empty">No matching problems</p>}
        </nav>

        <div className="sidebar-bottom">
          <div className="library-note"><span className="note-icon"><BookOpen size={15} /></span><div><b>{completedCount} of 150 completed</b><small>{lessons.length} lessons in your library</small></div></div>
          <div className="plan-meter" role="progressbar" aria-label="Study plan completion" aria-valuemin={0} aria-valuemax={150} aria-valuenow={completedCount}><span style={{ width: `${Math.min(100, completedCount / 150 * 100)}%` }} /></div>
          <div className="sidebar-footnote">Your local study collection</div>
        </div>
      </aside>

      {sidebarOpen && <button className="mobile-scrim" aria-label="Close navigation overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <nav className="app-track-nav" aria-label="Study tracks">
            <button onClick={() => navigateTrack('study-plan')}>Study plan</button>
            <button className="is-current" onClick={() => navigateTrack('data-structures')}>DSA library</button>
            <button onClick={() => navigateTrack('theory')}>Theory</button>
            <button onClick={() => navigateTrack('system-design')}>System design</button>
          </nav>
          <div className="topbar-right"><span className="sync-dot" /> LOCAL LIBRARY <span className="topbar-divider" /> <kbd><Command size={11} /> K</kbd></div>
        </header>

        {lesson && approach && optimized ? (
          <div className="page-grid">
            <article className="lesson-page">
              <div className="lesson-meta-row">
                <span className="problem-number">PROBLEM {String(lesson.metadata.problem_number).padStart(3, '0')}</span>
                <span className="meta-slash">/</span>
                <a className="category-label category-theory-link" href={`#theory/${categorySlug(lesson.metadata.category)}`} title={`Read ${lesson.metadata.category} theory`}>{lesson.metadata.category} <BookOpen size={10} /> theory</a>
                <span className={`difficulty difficulty-${lesson.metadata.difficulty.toLowerCase()}`}><i />{lesson.metadata.difficulty}</span>
              </div>
              <div className="lesson-title-row">
                <div><h1>{lesson.metadata.title}</h1><p className="lesson-lede">{lesson.problem_summary.summary}</p></div>
                <a className="external-link" href={lesson.metadata.url} target="_blank" rel="noreferrer" aria-label="Open problem on LeetCode" title="Open on LeetCode"><ArrowUpRight size={18} /></a>
              </div>

              <div className="summary-strip">
                <div className="summary-icon"><FileText size={16} /></div>
                <div><span className="section-kicker">THE TASK</span><p>{lesson.problem_summary.input_output}</p></div>
                <div className="constraints"><span className="section-kicker">CONSTRAINTS</span><p>{lesson.problem_summary.constraints.join('  ·  ')}</p></div>
              </div>

              <div className="lesson-toolbar">
                <div className="approach-tabs" role="tablist" aria-label="Solution approach">
                  <button role="tab" aria-selected={activeApproach === 'optimized'} className={activeApproach === 'optimized' ? 'tab-active' : ''} onClick={() => setActiveApproach('optimized')}><Gauge size={15} /> Optimized</button>
                  <button role="tab" aria-selected={activeApproach === 'brute_force'} className={activeApproach === 'brute_force' ? 'tab-active' : ''} onClick={() => setActiveApproach('brute_force')}><Braces size={15} /> Brute force</button>
                </div>
                <div className="lesson-actions">
                  <button
                    className={`button button-complete ${isLessonComplete ? 'is-complete' : ''}`}
                    aria-pressed={isLessonComplete}
                    onClick={() => setCompletedProblems((current) => current.includes(lesson.metadata.problem_number)
                      ? current.filter((problemNumber) => problemNumber !== lesson.metadata.problem_number)
                      : [...current, lesson.metadata.problem_number])}
                  >
                    <Check size={15} /> {isLessonComplete ? 'Completed' : 'Mark complete'}
                  </button>
                  <button className="button button-trace" onClick={() => setIsDryRunOpen(true)}><Play size={14} fill="currentColor" /> Dry run <ArrowRight size={14} /></button>
                </div>
              </div>

              <section className="approach-section" aria-live="polite">
                <div className="approach-heading">
                  <div><span className="section-kicker">{activeApproach === 'optimized' ? 'APPROACH 02' : 'APPROACH 01'}</span><h2>{activeApproach === 'optimized' ? 'Fill from the back' : 'Copy, then sort'}</h2></div>
                  <span className="approach-tag">{activeApproach === 'optimized' ? 'IN-PLACE' : 'BASELINE'}</span>
                </div>
                <p className="approach-copy">{approach.explanation}</p>
                <div className="insight-line"><span className="insight-mark">↗</span><p><b>Why it works</b> {approach.correctness_idea}</p></div>
                <CodeBlock code={approach.code} label={activeApproach === 'optimized' ? 'Solution.java' : 'Solution.java'} />
              </section>

              <div className="lesson-bottom-row">
                <div className="edge-cases"><span className="section-kicker">EDGE CASES</span><div>{lesson.edge_cases.map((item) => <p key={item.case}><Check size={14} /><span><b>{item.case}</b> {item.handling}</span></p>)}</div></div>
                <button className="text-action" onClick={() => setIsDryRunOpen(true)}>Walk through the example <ArrowRight size={15} /></button>
              </div>
            </article>

            <aside className="insight-rail">
              <div className="rail-heading"><span className="section-kicker">QUICK READ</span><span className="rail-spark">✳</span></div>
              <h2>Complexity</h2>
              <div className="complexity-list">
                <div className="complexity-item"><span className="complexity-icon time-icon"><Gauge size={16} /></span><div><small>TIME</small><b>{optimized.time_complexity.split(' — ')[0]}</b><p>{optimized.time_complexity.split(' — ')[1] ?? 'Each value is considered at most once.'}</p></div></div>
                <div className="complexity-item"><span className="complexity-icon space-icon"><Code2 size={16} /></span><div><small>SPACE</small><b>{optimized.space_complexity.split(' — ')[0]}</b><p>{optimized.space_complexity.split(' — ')[1] ?? 'No additional collection is created.'}</p></div></div>
              </div>
              <div className="rail-rule" />
              <div className="rail-heading"><span className="section-kicker">THE INSIGHT</span></div>
              <div className="insight-note"><span className="insight-number">01</span><p>Writing backward protects the unmerged values already at the front of the destination array.</p></div>
              <div className="mini-array" aria-label="Merge direction from the highest values">
                <span>1</span><span>2</span><span className="mini-muted">3</span><i>←</i><span className="mini-focus">6</span><span>5</span><span>2</span>
              </div>
              <p className="mini-caption">COMPARE THE LARGEST VALUES FIRST</p>
              <button className="rail-run-link" onClick={() => setIsDryRunOpen(true)}><span><Play size={13} fill="currentColor" /></span> Step through this solution <ArrowRight size={15} /></button>
              <div className="rail-source"><span className="source-avatar">LC</span><div><b>LeetCode #{lesson.metadata.problem_number}</b><small>{lesson.metadata.difficulty} · {lesson.metadata.category}</small></div><a href={lesson.metadata.url} target="_blank" rel="noreferrer" aria-label="Open source problem"><ArrowUpRight size={15} /></a></div>
            </aside>
          </div>
        ) : (
          <div className="empty-state"><div className="empty-icon"><Search size={23} /></div><span className="section-kicker">NO MATCHES</span><h1>No lesson found</h1><p>Try another title, problem number, or category. Add lesson JSON files under <code>src/data/lessons/</code> to grow this library.</p><button className="button button-primary" onClick={() => { setSearch(''); setActiveCategory('All topics'); }}>Show available lessons <ArrowRight size={15} /></button></div>
        )}

        <footer className="page-footer"><span>ALGO NOTES <i>·</i> BUILT FOR THE LONG GAME</span><span>LESSONS LOADED <b>{String(lessons.length).padStart(2, '0')}</b> <span className="footer-total">/ 150</span></span></footer>
      </main>

      {isDryRunOpen && lesson && <DryRunDialog lesson={lesson} onClose={() => setIsDryRunOpen(false)} />}
    </div>
  );
}

function LayersIcon() {
  return <span className="all-topics-icon"><Layers size={15} strokeWidth={1.7} /></span>;
}

export default App;
