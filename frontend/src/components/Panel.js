export default function Panel({ title, children }) {
  return (
    <div style={styles.box}>
      <div style={styles.top}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

const styles = {
  box: {
    background: "#fff",
    borderLeft: "6px solid #FFD400",
    padding: 20,
    marginBottom: 25,
    borderRadius: 6
  },
  top: { fontWeight: "bold", marginBottom: 10 }
};
