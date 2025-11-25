
import React from 'react';
import { Link } from 'react-router-dom';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderRichText(text) {
  if (!text) return null;

  const lines = String(text).replace(/\r\n/g, '\n').split('\n');

  const nodes = [];
  let listItems = null;
  const flushList = () => {
    if (!listItems || listItems.length === 0) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} style={{ marginTop: 8, marginBottom: 8 }}>
        {listItems.map((li, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{ __html: escapeHtml(li).replace(/\n/g, '<br/>') }}
          />
        ))}
      </ul>
    );
    listItems = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    const m = trimmed.match(/^([-*•])\s+(.*)/);
    if (m) {
      const content = raw.replace(/^[-*•]\s*/, '');
      if (!listItems) listItems = [];
      listItems.push(content);
      continue;
    }

    if (listItems) flushList();

    if (trimmed === '') {
      nodes.push(<div key={`br-${i}`} style={{ height: 8 }} />);
    } else {
      nodes.push(
        <p
          key={`p-${i}`}
          style={{ margin: '6px 0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: escapeHtml(raw).replace(/\n/g, '<br/>') }}
        />
      );
    }
  }

  if (listItems) flushList();

  return <div>{nodes}</div>;
}


export function renderShortDescription(text) {
  if (!text) return null;
  return <div style={{ whiteSpace: 'pre-wrap' }}>{String(text)}</div>;
}

export default function ProjectCard({ project }) {
  if (!project) return null;

  const seed = project._id || project.title || 'seed';
  const img = project.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/400`;

  const short = project.shortDescription || (project.description ? project.description.slice(0, 160) : '');

  return (
    <article className="card" aria-labelledby={`title-${project._id || seed}`}>
      <img className="project-img" src={img} alt={project.title} />
      <h3 id={`title-${project._id || seed}`} style={{ margin: '6px 0' }}>{project.title}</h3>

      <p style={{ color: 'var(--muted)', margin: '6px 0 10px' }}>
        {renderShortDescription(short)}
      </p>

      <div className="badges">
        {(project.techStack || []).slice(0, 6).map(t => (
          <span className="badge" key={t}>{t}</span>
        ))}
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="link-btn" to={`/projects/${project._id}`}>View</Link>
          {project.liveUrl && <a className="link-btn" href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>}
        </div>
        {project.repoUrl && (
          <a className="link-btn" href={project.repoUrl} target="_blank" rel="noreferrer">Repo</a>
        )}
      </div>
    </article>
  );
}