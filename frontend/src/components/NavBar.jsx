import { Link } from "react-router-dom";

export default function NavBar() {
return (
<div style={{ padding: 20, background: "#222", color: "#fff", display: "flex", gap: 20 }}>
<Link to="/" style={{ color: "#fff" }}>Dashboard</Link>
<Link to="/modules" style={{ color: "#fff" }}>Modules</Link>
<Link to="/upload-module" style={{ color: "#fff" }}>Upload Module</Link>
</div>
);
}