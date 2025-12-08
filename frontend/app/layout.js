export default function Layout({ children }) {
return (
<html>
<body style={{ margin: 0, fontFamily: "sans-serif", background: "#fff" }}>
{children}
</body>
</html>
);
}