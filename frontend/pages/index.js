import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);

  async function load() {
    try {
      const response = await fetch("/api/projects", {
        method: "GET"
      });

      if (!response.ok) {
        console.error("Backend gaf fout:", response.status);
        return;
      }

      const json = await response.json();
      setProjects(json.projects || []);
    } catch (e) {
      console.error("Kon backend niet bereiken:", e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Projecten</h1>

      {projects.length === 0 && <p>Geen projecten gevonden</p>}

      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.projectnaam}</li>
        ))}
      </ul>
    </div>
  );
}
