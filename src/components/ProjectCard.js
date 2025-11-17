import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({project}) {
  const img = project.imageUrl || `https://picsum.photos/seed/${project._id || project.title}/800/400`;
  return (
    <article className="card" aria-labelledby={`title-${project._id}`}>
      <img className="project-img" src={img} alt={project.title} />
      <h3 id={`title-${project._id}`} style={{margin:'6px 0'}}>{project.title}</h3>
      <p style={{color:'var(--muted)', margin:'6px 0 10px'}}>{project.shortDescription || project.description?.slice(0,120)}</p>

      <div className="badges">
        {(project.techStack || []).slice(0,6).map(t => <span className="badge" key={t}>{t}</span>)}
      </div>

      <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
        <div style={{display:'flex', gap:8}}>
          <Link className="link-btn" to={`/projects/${project._id}`}>View</Link>
          {project.liveUrl && <a className="link-btn" href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>}
        </div>
        {project.repoUrl &&
          <a className="link-btn" href={project.repoUrl} target="_blank" rel="noreferrer">Repo</a>
        }
      </div>
    </article>
  );
}