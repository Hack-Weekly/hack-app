import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
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
  apiKey: "AIzaSyBPOlLlSWGcUaAbviBCq1ge3j_LgHS8pUc",
  authDomain: "hack-weekly-382703.firebaseapp.com",
  projectId: "hack-weekly-382703",
  storageBucket: "hack-weekly-382703.appspot.com",
  messagingSenderId: "881748292428",
  appId: "1:881748292428:web:79ca10bd2f448f955855e9",
  measurementId: "G-Z1QMZXZ948",
};
import { useAppStore } from "./globalState";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
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

export async function githubSignIn() {
  try {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  } catch (e) {
    console.log(e);
  }
}
