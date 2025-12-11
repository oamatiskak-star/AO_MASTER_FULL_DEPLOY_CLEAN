"use client";

export default function InkoopModule() {
async function runInkoop() {
const res = await fetch("/api/modules/procurement-v2");
const json = await res.json();
console.log(json);
alert("Inkoop module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Inkoop Module</h1>
<button onClick={runInkoop}>Test Inkoop Module</button>
</div>
);
}