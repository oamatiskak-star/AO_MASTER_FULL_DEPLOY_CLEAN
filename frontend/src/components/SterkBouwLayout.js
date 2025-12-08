export default function SterkBouwLayout({ children, title }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>SterkBouw</div>
        <div style={styles.title}>{title}</div>
      </header>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f2f2",
    fontFamily: "Arial"
  },
  header: {
    background: "#000",
    padding: "15px 25px",
    color: "#fff",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between"
  },
  logo: { color: "#FFD400" },
  title: { opacity: 0.8 },
  main: { padding: 30 }
};
