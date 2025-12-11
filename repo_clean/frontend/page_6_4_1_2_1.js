"use client";

export default function FinancieelModule() {
async function runFinancieel() {
const res = await fetch("/api/modules/financial-v2");
const json = await res.json();
console.log(json);
alert("Financieel module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Financieel Module</h1>
<button onClick={runFinancieel}>Test Financieel Module</button>
</div>
);
}