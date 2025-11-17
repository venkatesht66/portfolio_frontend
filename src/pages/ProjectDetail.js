import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProject } from '../api/api';

export default function ProjectDetail(){
  const { id } = useParams();
  const [project, setProject] = useState(null);
  useEffect(()=> {
    fetchProject(id).then(r => setProject(r.data)).catch(()=>{});
  }, [id]);
  if (!project) return <div>Loading...</div>;
  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Tech:</strong> {project.techStack?.join(', ')}</p>
      {project.repoUrl && <p><a href={project.repoUrl} target="_blank" rel="noreferrer">Repository</a></p>}
      {project.liveUrl && <p><a href={project.liveUrl} target="_blank" rel="noreferrer">Live Demo</a></p>}
    </div>
  );
}