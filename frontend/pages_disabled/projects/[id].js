import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SterkBouwLayout from "../../src/components/SterkBouwLayout";
import ProjectSidebar from "../../src/components/ProjectSidebar";
import Panel from "../../src/components/Panel";

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(
        `https://ao-master-full-deploy-clean.onrender.com/api/projects/${id}`
      );
      const json = await res.json();
      setProject(json.data);
    }

    load();
  }, [id]);

  if (!project)
    return <SterkBouwLayout title="Laden...">Project wordt geladen</SterkBouwLayout>;

  return (
    <SterkBouwLayout title={project.projectnaam}>
      <div style={{ display: "flex" }}>
        <ProjectSidebar />

        <div style={{ marginLeft: 280, width: "100%" }}>
          <Panel title="Projectgegevens">
            <p>Adres: {project.adres}</p>
            <p>Opdrachtgever: {project.opdrachtgever}</p>
            <p>Type: {project.type_project}</p>
            <p>Calculatiemodus: {project.calculatiemodus}</p>
          </Panel>

          <Panel title="Modules">
            <p>Calculatie</p>
            <p>Architect</p>
            <p>Uploads</p>
            <p>Planning</p>
            <p>Financieel</p>
          </Panel>
        </div>
      </div>
    </SterkBouwLayout>
  );
}
