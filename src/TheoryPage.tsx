import { useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, Lightbulb } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { theoryTopics } from './data/theory';
import { categorySlug } from './theorySlug';
import './theory.css';

type Track = 'study-plan' | 'data-structures' | 'system-design' | 'theory';

type ProblemRef = { number: number; title: string; difficulty: string; category: string };

export function TheoryPage({
  slug,
  problems,
  completed,
  onNavigate,
}: {
  slug: string;
  problems: ProblemRef[];
  completed: number[];
  onNavigate: (track: Track) => void;
}) {
  const index = Math.max(0, theoryTopics.findIndex((topic) => categorySlug(topic.category) === slug));
  const topic = theoryTopics[index];
  const practice = useMemo(() => problems.filter((item) => item.category === topic.category), [problems, topic.category]);
  const previous = theoryTopics[index - 1];
  const next = theoryTopics[index + 1];
  const doneCount = practice.filter((item) => completed.includes(item.number)).length;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [topic.category]);

  const topicLink = (category: string) => `#theory/${categorySlug(category)}`;
  const knownRelated = topic.related.filter((category) => theoryTopics.some((item) => item.category === category));

  return (
    <div className="th-app">
      <header className="th-header">
        <button className="th-brand" onClick={() => onNavigate('study-plan')}><span className="th-brand-mark">an</span><span>algo notes<small>INTERVIEW STUDY DESK</small></span></button>
        <nav className="th-track-nav" aria-label="Study tracks">
          <button onClick={() => onNavigate('study-plan')}>Study plan</button>
          <button onClick={() => onNavigate('data-structures')}>DSA library</button>
          <button className="is-current" onClick={() => onNavigate('theory')}>Theory</button>
          <button onClick={() => onNavigate('system-design')}>System design</button>
        </nav>
      </header>

      <div className="th-layout">
        <aside className="th-sidebar">
          <div className="th-sidebar-label">THEORY LIBRARY <span>{String(theoryTopics.length).padStart(2, '0')}</span></div>
          <nav aria-label="Theory topics">
            {theoryTopics.map((item, itemIndex) => (
              <a key={item.category} href={topicLink(item.category)} className={item.category === topic.category ? 'is-active' : ''} aria-current={item.category === topic.category ? 'page' : undefined}>
                <span className="th-index">{String(itemIndex + 1).padStart(2, '0')}</span>{item.category}
              </a>
            ))}
          </nav>
        </aside>

        <main className="th-content">
          <section className="th-hero">
            <span className="th-kicker">TOPIC {String(index + 1).padStart(2, '0')} · THEORY</span>
            <h1>{topic.category}</h1>
            <p className="th-tagline">{topic.tagline}</p>
            <div className="th-hero-actions">
              {practice.length > 0 && <a className="th-button th-primary" href={`#data-structures/${practice[0].number}`}>Practice {practice.length} problems <ArrowRight size={15} /></a>}
              <a className="th-button" href="#data-structures">Open DSA library</a>
            </div>
            <nav className="th-toc" aria-label="On this page">
              <button type="button" onClick={() => jump('overview')}>Overview</button>
              <button type="button" onClick={() => jump('plain')}>In plain English</button>
              <button type="button" onClick={() => jump('when')}>When to use</button>
              <button type="button" onClick={() => jump('ideas')}>Key ideas</button>
              <button type="button" onClick={() => jump('algorithms')}>Algorithms</button>
              <button type="button" onClick={() => jump('examples')}>Examples</button>
              <button type="button" onClick={() => jump('practice')}>Practice</button>
            </nav>
          </section>

          <section className="th-section" id="th-overview">
            <h2>Overview</h2>
            {topic.overview.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
          </section>

          <section className="th-section" id="th-plain">
            <h2>In plain English</h2>
            <div className="th-callout">
              <span className="th-callout-icon"><Lightbulb size={17} /></span>
              <p>{topic.layman.analogy}</p>
            </div>
            <ul className="th-list">
              {topic.layman.plainEnglish.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}
            </ul>
          </section>

          <section className="th-section" id="th-when">
            <h2>When to reach for it</h2>
            <ul className="th-checks">
              {topic.whenToUse.map((signal, signalIndex) => <li key={signalIndex}><Check size={14} />{signal}</li>)}
            </ul>
          </section>

          <section className="th-section" id="th-ideas">
            <h2>Key ideas</h2>
            <dl className="th-glossary">
              {topic.keyIdeas.map((idea) => <div key={idea.term}><dt>{idea.term}</dt><dd>{idea.meaning}</dd></div>)}
            </dl>
          </section>

          <section className="th-section" id="th-algorithms">
            <h2>Core algorithms &amp; patterns</h2>
            {topic.algorithms.map((algorithm, algorithmIndex) => (
              <article className="th-algorithm" key={algorithm.name}>
                <header>
                  <span className="th-number">{String(algorithmIndex + 1).padStart(2, '0')}</span>
                  <h3>{algorithm.name}</h3>
                </header>
                <p className="th-layman"><b>Simply put:</b> {algorithm.layman}</p>
                <h4>How it works</h4>
                <ol className="th-steps">
                  {algorithm.how.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}
                </ol>
                <CodeBlock code={algorithm.code} label={`${algorithm.name}.java`} />
                <div className="th-meta">
                  <span><b>Time</b>{algorithm.time}</span>
                  <span><b>Space</b>{algorithm.space}</span>
                  <span className="th-use"><b>Use when</b>{algorithm.useWhen}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="th-section" id="th-examples">
            <h2>Worked examples</h2>
            {topic.examples.map((example) => (
              <article className="th-example" key={example.title}>
                <h3>{example.title}</h3>
                <p>{example.problem}</p>
                <div className="th-input"><span>INPUT</span><code>{example.input}</code></div>
                <ol className="th-walk">
                  {example.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>
                      <span className="th-step-dot">{stepIndex + 1}</span>
                      <div><b>{step.title}</b><p>{step.detail}</p>{step.state && <code>{step.state}</code>}</div>
                    </li>
                  ))}
                </ol>
                <div className="th-result"><Check size={15} /> {example.result}</div>
              </article>
            ))}
          </section>

          <section className="th-section" id="th-pitfalls">
            <h2>Common pitfalls</h2>
            <ul className="th-list th-warn">
              {topic.pitfalls.map((pitfall, pitfallIndex) => <li key={pitfallIndex}>{pitfall}</li>)}
            </ul>
          </section>

          <section className="th-section" id="th-practice">
            <div className="th-practice-head">
              <h2>Practice this topic</h2>
              <span>{doneCount} / {practice.length} done</span>
            </div>
            <div className="th-problems">
              {practice.map((item) => (
                <a key={item.number} href={`#data-structures/${item.number}`}>
                  <span className="th-problem-number">{String(item.number).padStart(3, '0')}</span>
                  <span className="th-problem-title">{item.title}</span>
                  {completed.includes(item.number) && <Check size={13} className="th-problem-done" aria-label="Completed" />}
                  <span className={`th-diff th-diff-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </section>

          {knownRelated.length > 0 && (
            <section className="th-section">
              <h2>Study next</h2>
              <div className="th-related">
                {knownRelated.map((category) => <a key={category} href={topicLink(category)}><BookOpen size={14} />{category}</a>)}
              </div>
            </section>
          )}

          <footer className="th-pager">
            {previous ? <a href={topicLink(previous.category)}><ArrowLeft size={15} /><span><small>PREVIOUS</small>{previous.category}</span></a> : <span />}
            {next ? <a className="th-next" href={topicLink(next.category)}><span><small>NEXT</small>{next.category}</span><ArrowRight size={15} /></a> : <span />}
          </footer>
        </main>
      </div>
    </div>
  );
}

function jump(id: string) {
  document.getElementById(`th-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
