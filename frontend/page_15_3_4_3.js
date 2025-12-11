"use client";

export default function ArchitectModule() {
async function runArchitect() {
const res = await fetch("/api/modules/architect");
const json = await res.json();
console.log(json);
alert("Architect module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Architect Module</h1>
<button onClick={runArchitect}>Test Architect</button>
</div>
);
}