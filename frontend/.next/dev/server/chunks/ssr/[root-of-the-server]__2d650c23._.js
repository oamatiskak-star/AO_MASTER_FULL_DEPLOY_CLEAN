module.exports = [
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
async function load() {
    try {
        const response = await fetch("http://localhost:4000/api/projects", {
            method: "GET"
        });
        if (!response.ok) {
            console.error("Backend gaf fout:", response.status);
            return;
        }
        const json = await response.json();
        setProjects(json.projects || []);
    } catch (e) {
        console.error("Kon backend niet bereiken:", e);
    }
}
useEffect(()=>{
    load();
}, []);
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2d650c23._.js.map