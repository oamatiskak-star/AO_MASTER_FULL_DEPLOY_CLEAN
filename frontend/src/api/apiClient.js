import API_URL from "../config.js";

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  return res.json();
}

export default {
  get(path) {
    return request(path);
  },
  post(path, data) {
    return request(path, { method: "POST", body: JSON.stringify(data) });
  }
};
