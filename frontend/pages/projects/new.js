import { useState } from "react";
import SterkBouwLayout from "../../src/components/SterkBouwLayout";
import Panel from "../../src/components/Panel";

export default function NewProject() {
  const [form, setForm] = useState({
    projectnaam: "",
    projectnummer: "",
    adres: "",
    opdrachtgever: "",
    type_project: "",
    calculatiemodus: ""
  });

  function update(key, val) {
    setForm({ ...form, [key]: val });
  }

  async function submit(e) {
    e.preventDefault();

    const res = await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/projects",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }
    );

    const json = await res.json();

    if (json.success) {
      window.location.href = "/projects/" + json.data.id;
    }
  }

  return (
    <SterkBouwLayout title="Nieuw project">
      <Panel title="Project aanmaken">
        <form onSubmit={submit} style={{ display: "grid", gap: 15 }}>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              style={{ padding: 10 }}
            />
          ))}

          <button
            type="submit"
            style={{
              background: "#FFD400",
              border: "none",
              padding: "12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Opslaan
          </button>
        </form>
      </Panel>
    </SterkBouwLayout>
  );
}
