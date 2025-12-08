import { useEffect, useState } from "react";
import SterkBouwLayout from "../../src/components/SterkBouwLayout";
import Panel from "../../src/components/Panel";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("https://ao-master-full-deploy-clean.onrender.com/api/projects");
    const json = await res.json();
    setProjects(json.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SterkBouwLayout title="Projecten">
      <a
        href="/projects/new"
        style={{
          background: "#FFD400",
          padding: "12px 18px",
          textDecoration: "none",
          color: "#000",
          fontWeight: "bold",
          borderRadius: 4,
          display: "inline-block",
          marginBottom: 20
        }}
      >
        Nieuw project
      </a>

      {loading && <p>Laden...</p>}

      {!loading &&
        projects.map((p) => (
          <Panel key={p.id} title={p.projectnaam}>
            <p>Adres: {p.adres}</p>
            <p>Opdrachtgever: {p.opdrachtgever}</p>

            <a
              href={`/projects/${p.id}`}
              style={{
                background: "#000",
                color: "#FFD400",
                padding: "10px 14px",
                textDecoration: "none",
                borderRadius: 4,
                fontWeight: "bold",
                marginTop: 10,
                display: "inline-block"
              }}
            >
              Open
            </a>
          </Panel>
        ))}
    </SterkBouwLayout>
  );
}
