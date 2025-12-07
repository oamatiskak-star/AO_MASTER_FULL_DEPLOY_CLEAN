import { Link } from "react-router-dom";
import theme from "../theme.js";

export default function Sidebar() {
return (
<div style={{
width: 240,
background: theme.colors.sidebar,
color: theme.colors.sidebarText,
padding: 20,
display: "flex",
flexDirection: "column",
gap: 16,
fontSize: 16
}}>
<h2 style={{ marginBottom: 20 }}>AO Master</h2>

  <Link to="/" style={{ color: "#ccc", textDecoration: "none" }}>Dashboard</Link>
  <Link to="/projects" style={{ color: "#ccc", textDecoration: "none" }}>Projecten</Link>
  <Link to="/modules" style={{ color: "#ccc", textDecoration: "none" }}>Modules</Link>
  <Link to="/upload-module" style={{ color: "#ccc", textDecoration: "none" }}>Module upload</Link>
</div>


);
}