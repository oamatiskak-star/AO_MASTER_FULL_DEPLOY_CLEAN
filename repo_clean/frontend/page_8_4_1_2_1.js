"use client";

export default function InstallatieModule() {
async function runInstallatie() {
const res = await fetch("/api/modules/installatie", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
project_id: "test-project",
vermogen: 12,
fase: 3,
afstand: 18
})
});
const json = await res.json();
console.log(json);
alert("Installatie module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Installatie Module</h1>
<button onClick={runInstallatie}>Test Installatie</button>
</div>
);
}