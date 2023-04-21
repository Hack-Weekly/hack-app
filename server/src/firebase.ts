import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { isProd } from './shared.js'

let firebaseApp
if (!isProd) {
  // Make sure you have FIRESTORE_EMULATOR_HOST=localhost:8080 in your .env, and that you
  // already ran `pnpm run emulators`
  firebaseApp = initializeApp({
    projectId: 'local-emulator-proj',
  })
} else {
  // prod
  firebaseApp = initializeApp()
}

export const firestoreDb = getFirestore(firebaseApp)
