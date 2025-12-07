import { useState, useEffect } from "react";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const response = await fetch("http://localhost:4000/api/projects");
                const json = await response.json();
                setProjects(json.projects || []);
            } catch (err) {
                console.error("Kan dashboard data niet laden", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>

            {loading ? (
                <p>Laden…</p>
            ) : (
                <ul>
                    {projects.map((project, index) => (
                        <li key={index}>
                            {project.projectnaam} – {project.adres}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
