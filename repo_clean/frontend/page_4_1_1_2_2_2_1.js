"use client";

export default function DashboardModule() {
async function runDashboard() {
const res = await fetch("/api/modules/dashboard-level3");
const json = await res.json();
console.log(json);
alert("Dashboard module geladen. Check console.");
}

return (
<div style={{ padding: 40 }}>
<h1>Dashboard Module</h1>
<button onClick={runDashboard}>Test Dashboard Module</button>
</div>
);
}