import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://ao-master-full-deploy-clean.onrender.com/api/projects"
        );
        const json = await res.json();
        setProjects(json.projects || []);
      } catch (err) {
        console.error("Fout bij laden projecten:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Projecten</h1>

      {loading && <p>Projecten laden...</p>}

      {!loading && projects.length === 0 && (
        <p>Geen projecten gevonden.</p>
      )}

      {!loading &&
        projects.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: 20,
              marginTop: 20,
              borderRadius: 8,
              background: "#fafafa"
            }}
          >
            <h2>{p.projectnaam}</h2>
            <p>Adres: {p.adres}</p>
            <p>Type project: {p.type_project}</p>
          </div>
        ))}
    </div>
  );
}
