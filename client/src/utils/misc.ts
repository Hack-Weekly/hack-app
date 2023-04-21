export const isProd = import.meta.env.MODE !== "development";
console.log(import.meta.env.MODE);
export const apiServer = isProd
  ? "https://hack-app-kx5lljoqga-uc.a.run.app"
  : "http://localhost:3000";
