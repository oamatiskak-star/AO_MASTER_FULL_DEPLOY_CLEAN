import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SterkBouwLayout from "../../../src/components/SterkBouwLayout";
import ProjectSidebar from "../../../src/components/ProjectSidebar";
import Panel from "../../../src/components/Panel";

export default function CalcModule() {
  const router = useRouter();
  const { id } = router.query;

  const [regels, setRegels] = useState([]);
  const [form, setForm] = useState({
    stabu_code: "",
    omschrijving: "",
    eenheid: "",
    prijs: "",
    hoeveelheid: ""
  });

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calculations/${id}`
    );
    const json = await res.json();
    setRegels(json.data || []);
  }

  useEffect(() => {
    if (id) load();
  }, [id]);

  function update(key, val) {
    setForm({ ...form, [key]: val });
  }

  async function submit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      project_id: id,
      totaal: Number(form.prijs) * Number(form.hoeveelheid)
    };

    const res = await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/calculations",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const json = await res.json();
    if (json.success) {
      load();
      setForm({
        stabu_code: "",
        omschrijving: "",
        eenheid: "",
        prijs: "",
        hoeveelheid: ""
      });
    }
  }

  return (
    <SterkBouwLayout title="Calculatie">
      <div style={{ display: "flex" }}>
        <ProjectSidebar />

        <div style={{ marginLeft: 280, width: "100%" }}>
          <Panel title="Nieuwe calculatieregel">
            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>

              <input
                placeholder="STABU code"
                value={form.stabu_code}
                onChange={(e) => update("stabu_code", e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Omschrijving"
                value={form.omschrijving}
                onChange={(e) => update("omschrijving", e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Eenheid"
                value={form.eenheid}
                onChange={(e) => update("eenheid", e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Prijs"
                value={form.prijs}
                onChange={(e) => update("prijs", e.target.value)}
                style={styles.input}
              />

              <input
                placeholder="Hoeveelheid"
                value={form.hoeveelheid}
                onChange={(e) => update("hoeveelheid", e.target.value)}
                style={styles.input}
              />

              <button type="submit" style={styles.button}>
                Toevoegen
              </button>
            </form>
          </Panel>

          <Panel title="Regels">
            {regels.length === 0 && <p>Geen regels toegevoegd.</p>}

            {regels.length > 0 &&
              regels.map((r) => (
                <div key={r.id} style={styles.row}>
                  <div>{r.stabu_code}</div>
                  <div>{r.omschrijving}</div>
                  <div>{r.eenheid}</div>
                  <div>{r.hoeveelheid} x €{r.prijs}</div>
                  <div style={{ fontWeight: "bold" }}>€{r.totaal}</div>
                </div>
              ))}
          </Panel>
        </div>
      </div>
    </SterkBouwLayout>
  );
}

const styles = {
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 4
  },
  button: {
    background: "#FFD400",
    padding: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: 4
  },
  row: {
    display: "grid",
    gridTemplateColumns: "150px 1fr 100px 150px 120px",
    padding: "10px 0",
    borderBottom: "1px solid #eee"
  }
};
