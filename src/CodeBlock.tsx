import type { ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';

type TokenPart = string | Prism.Token;

function renderToken(part: TokenPart, key: number): ReactNode {
  if (typeof part === 'string') return part;
  const contents = Array.isArray(part.content) ? part.content : [String(part.content)];
  return (
    <span className={`token ${part.type}`} key={key}>
      {contents.map((item, index) => renderToken(item as TokenPart, index))}
    </span>
  );
}

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const tokens = Prism.tokenize(code, Prism.languages.java ?? Prism.languages.clike);
  return (
    <div className="code-shell">
      <div className="code-toolbar">
        <span><span className="code-dot" /> {label}</span>
        <span className="code-language">JAVA</span>
      </div>
      <pre className="code-block"><code>{tokens.map((token, index) => renderToken(token, index))}</code></pre>
    </div>
  );
}
