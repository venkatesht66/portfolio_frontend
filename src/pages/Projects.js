import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../api/api';
import ProjectCard from '../components/ProjectCard';

export default function Projects(){
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=> {
    setLoading(true);
    fetchProjects()
      .then(r => { setProjects(r.data || []); setError(''); })
      .catch(err => { console.error('Projects fetch error:', err); setError('Unable to load projects'); })
      .finally(()=> setLoading(false));
  }, []);

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="kicker">Portfolio</div>
          <h1 style={{margin:'6px 0'}}>All Projects</h1>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{color:'salmon'}}>{error}</p>}

      {!loading && !error && (
        <div style={{marginTop:18}} className="project-grid">
          {projects.length === 0 ? <div className="card">No projects found.
          </div> : projects.map(p => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}
    </div>
  );
}