"use client";

export default function JuridischModule() {
async function runJuridisch() {
const res = await fetch("/api/modules/juridisch-v2");
const json = await res.json();
console.log(json);
alert("Juridisch module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Juridisch Module</h1>
<button onClick={runJuridisch}>Test Juridisch Module</button>
</div>
);
}