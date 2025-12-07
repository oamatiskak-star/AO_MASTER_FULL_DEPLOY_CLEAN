import theme from "../theme.js";

export default function Topbar() {
return (
<div style={{
height: 60,
background: theme.colors.topbar,
borderBottom: "1px solid " + theme.colors.border,
display: "flex",
alignItems: "center",
paddingLeft: 20,
fontSize: 18,
fontWeight: "bold",
color: "#333"
}}>
AO Dashboard
</div>
);
}