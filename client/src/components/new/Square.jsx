export default function Square({ number }) {
  return (
    <div style={styles.square}>
      <span>{number}</span>
    </div>
  );
}

const styles = {
  square: {
    width: 80,
    height: 80,
    background: "#ecf0f1",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
};
