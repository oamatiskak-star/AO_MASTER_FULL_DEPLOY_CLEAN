"use client";

export default function ViewerModule() {
async function runViewer() {
const res = await fetch("/api/modules/viewer");
const json = await res.json();
console.log(json);
alert("Viewer module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Viewer Module</h1>
<button onClick={runViewer}>Test Viewer</button>
</div>
);
}