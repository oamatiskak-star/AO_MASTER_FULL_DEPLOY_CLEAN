"use client";

export default function UitvoeringModule() {
async function runUitvoering() {
const res = await fetch("/api/modules/uitvoering");
const json = await res.json();
console.log(json);
alert("Uitvoering module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Uitvoering Module</h1>
<button onClick={runUitvoering}>Test Uitvoering Module</button>
</div>
);
}