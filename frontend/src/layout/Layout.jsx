import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import theme from "../theme.js";

export default function Layout({ children }) {
return (
<div style={{ display: "flex", height: "100vh", width: "100vw" }}>
<Sidebar />
<div style={{ flex: 1, display: "flex", flexDirection: "column", background: theme.colors.background }}>
<Topbar />
<div style={{ padding: 20, overflowY: "auto" }}>
{children}
</div>
</div>
</div>
);
}