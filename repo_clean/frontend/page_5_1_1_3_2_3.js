"use client";

export default function ExportModule() {
async function runExport() {
const res = await fetch("/api/modules/export-engine-v2");
const json = await res.json();
console.log(json);
alert("Export module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Export / Document Builder</h1>
<button onClick={runExport}>Test Export Module</button>
</div>
);
}