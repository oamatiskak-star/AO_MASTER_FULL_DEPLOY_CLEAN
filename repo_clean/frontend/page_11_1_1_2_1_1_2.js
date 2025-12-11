"use client";

export default function UrenModule() {
async function runUren() {
const res = await fetch("/api/modules/uren");
const json = await res.json();
console.log(json);
alert("Uren module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Uren Module</h1>
<button onClick={runUren}>Test Uren Module</button>
</div>
);
}