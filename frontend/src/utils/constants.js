export const BASE = "http://localhost:8080";
export const imgUrl = (filename) => filename ? `${BASE}/uploads/${filename}` : null;
