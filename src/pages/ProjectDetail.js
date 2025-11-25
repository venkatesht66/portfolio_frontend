import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProject } from '../api/api';
import { renderRichText } from '../utils/textRender';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProject(id)
      .then(r => {
        if (!mounted) return;
        setProject(r.data);
        setError('');
      })
      .catch(err => {
        console.error('fetchProject err', err);
        if (mounted) setError('Could not load project.');
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container" style={{ paddingTop: 24 }}>Loading project…</div>;
  if (error) return <div className="container" style={{ paddingTop: 24, color: 'salmon' }}>{error}</div>;
  if (!project) return <div className="container" style={{ paddingTop: 24 }}>No project found.</div>;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      {/* Main single-column layout (aside removed as requested) */}
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>{project.title}</h1>

        {/* Short description (if present) */}
        {project.shortDescription && (
          <div style={{ color: 'var(--muted)', marginBottom: 14, whiteSpace: 'pre-wrap' }}>
            {project.shortDescription}
          </div>
        )}

        {/* Full description rendered preserving newlines and lists */}
        <div style={{ marginTop: 14, marginBottom: 22 }}>
          {renderRichText(project.description)}
        </div>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <strong>Tech:</strong> {project.techStack.join(', ')}
          </div>
        )}

        {/* Links */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
          {project.repoUrl && <a className="link-btn" href={project.repoUrl} target="_blank" rel="noreferrer">Repository</a>}
          {project.liveUrl && <a className="link-btn" href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo</a>}
        </div>
      </div>
    </div>
  );
}