import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT_URL,
}

const projectId = process.env.PROJECT_ID
let firebaseApp
if (process.env.NODE_ENV === 'development') {
  firebaseApp = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: `http://localhost:8080?ns=ns=${projectId}`,
  })
} else {
  // production
  firebaseApp = initializeApp()
}

export const firestoreDb = getFirestore(firebaseApp)