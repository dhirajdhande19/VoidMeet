const server =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://voidmeet-backend.onrender.com";

export default server;
