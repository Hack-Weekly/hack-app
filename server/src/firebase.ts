import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseApp = initializeApp()
export const firestoreDb = getFirestore(firebaseApp)
