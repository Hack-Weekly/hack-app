export const isProd = process.env.NODE_ENV === 'production'
export const currentHost = isProd
  ? 'https://hack-app-kx5lljoqga-uc.a.run.app'
  : 'http://localhost:3000'

console.log(`Server NODE env: ${process.env.NODE_ENV}`)
