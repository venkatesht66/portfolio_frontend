import React from 'react';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


function parseLine(line) {
  const trimmed = line.trim();
  const ordered = trimmed.match(/^(\d+)\.\s+(.*)/);
  if (ordered) return { type: 'ol', content: ordered[2] };

  const unordered = trimmed.match(/^([-*•])\s+(.*)/);
  if (unordered) return { type: 'ul', content: unordered[2] };

  return { type: null, content: line };
}


export function renderRichText(raw = '') {
  if (!raw) return null;
  const lines = String(raw).split(/\r?\n/);

  const nodes = [];
  let currentList = null;
  let paraBuffer = [];

  const flushParagraph = () => {
    if (paraBuffer.length === 0) return;
    const text = paraBuffer.join('\n');
    nodes.push(
      <p key={`p-${nodes.length}`} style={{ whiteSpace: 'pre-wrap', margin: '8px 0', lineHeight: 1.6 }}>
        {text}
      </p>
    );
    paraBuffer = [];
  };

  const flushList = () => {
    if (!currentList) return;
    const key = `list-${nodes.length}`;
    const listItems = currentList.items.map((it, i) => <li key={`${key}-li-${i}`} style={{ marginBottom: 6 }}>{it}</li>);
    if (currentList.type === 'ul') {
      nodes.push(<ul key={key} style={{ margin: '8px 0 12px 18px' }}>{listItems}</ul>);
    } else {
      nodes.push(<ol key={key} style={{ margin: '8px 0 12px 18px' }}>{listItems}</ol>);
    }
    currentList = null;
  };

  for (let rawLine of lines) {
    if (/^\s*$/.test(rawLine)) {
      flushParagraph();
      flushList();
      continue;
    }

    const { type, content } = parseLine(rawLine);

    if (type) {

      flushParagraph();

      if (!currentList) {
        currentList = { type, items: [] };
      } else if (currentList.type !== type) {
        flushList();
        currentList = { type, items: [] };
      }

      currentList.items.push(escapeHtml(content));
    } else {
      if (currentList) flushList();
      paraBuffer.push(escapeHtml(rawLine));
    }
  }

  flushParagraph();
  flushList();

  return <>{nodes}</>;
}

export function renderShortDescription(text) {
  if (!text) return null;
  return <div style={{ whiteSpace: 'pre-wrap', color: 'var(--muted)' }}>{String(text)}</div>;
}