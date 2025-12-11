"use client";

export default function BouwbesluitModule() {
async function runBouwbesluit() {
const res = await fetch("/api/modules/bouwbesluit");
const json = await res.json();
console.log(json);
alert("Bouwbesluit module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Bouwbesluit Module</h1>
<button onClick={runBouwbesluit}>Test Bouwbesluit</button>
</div>
);
}