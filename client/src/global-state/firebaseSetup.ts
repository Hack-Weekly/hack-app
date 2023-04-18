import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  collection,
  getDocs,
  getDoc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  CollectionReference,
  DocumentReference,
  deleteDoc,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  dummyImplementations,
  dummyProjects,
  dummyRepos,
  dummyTeams,
  dummyUsers,
} from "../dummy/dummyData";

const firebaseConfig = {
  apiKey: "AIzaSyBO50wyxMIGVvnpNWVI22YoTOkuC6lNzAI",
  authDomain: "hack-weekly.firebaseapp.com",
  projectId: "hack-weekly",
  storageBucket: "hack-weekly.appspot.com",
  messagingSenderId: "725295282240",
  appId: "1:725295282240:web:a82e2b527f44c4c57587a5",
  measurementId: "G-8RVZLGJ0CL",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// enable for emulator config
// import { emulator } from "./firebaseEmulator";
// emulator();

export const usersCol = collection(db, "users");
export const teamsCol = collection(db, "teams");
export const projectsCol = collection(db, "projects");
export const implementationsCol = collection(db, "implementations");
export const reposCol = collection(db, "repos");

export async function clearAllData() {
  await clearCollection(usersCol);
  await clearCollection(teamsCol);
}

async function clearCollection(collection: CollectionReference) {
  console.log("clearing");
  const r = await getDocs(collection);
  r.forEach((docSnap) => {
    deleteDoc(docSnap.ref);
  });
}

async function loadDataForCol(data: any[], col: CollectionReference) {
  for (const d of data) {
    setDoc(doc(db, col.id, d.id), d);
  }
}
export async function loadDummyData() {
  loadDataForCol(dummyUsers, usersCol);
  loadDataForCol(dummyTeams, teamsCol);
  loadDataForCol(dummyRepos, reposCol);
  loadDataForCol(dummyProjects, projectsCol);
  loadDataForCol(dummyImplementations, implementationsCol);
}
