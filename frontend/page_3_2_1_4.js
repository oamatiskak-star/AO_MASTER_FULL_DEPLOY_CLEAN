"use client";

export default function CalcModule() {
async function runCalc() {
const res = await fetch("/api/modules/calc");
const json = await res.json();
console.log(json);
alert("Calculatie module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Calculatie Module</h1>
<button onClick={runCalc}>Test Calculatie</button>
</div>
);
}