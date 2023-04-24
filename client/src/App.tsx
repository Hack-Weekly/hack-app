import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  clearAllData,
  implementationsCol,
  projectsCol,
  reposCol,
  teamsCol,
  usersCol,
} from "./global-state/firebaseSetup";
import { onSnapshot, query } from "firebase/firestore";
import {
  useAppStore,
  useDbSync,
  useTeam,
  useUsers,
} from "./global-state/globalState";
import { UserT } from "shared";
import { HomePage } from "./pages/home/HomePage";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { TeamPage } from "./pages/team/TeamPage";
import { NewTeamPage } from "./pages/newTeam/NewTeamPage";
import "./globals.css";
import NavBar from "./components/NavBar/NavBar";
import Login from "./pages/login/Login";
import { TestPage } from "./pages/test/TestPage";

const router = createBrowserRouter([
  {
    element: <NavBar />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/login", element: <Login /> },
      {
        path: "/teams/new",
        element: <NewTeamPage />,
      },
      {
        path: "/teams/:teamId",
        loader: (p) => p.params.teamId,
        element: <TeamPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
    ],
  },
]);

function App() {
  const userSync = useDbSync(usersCol, "setUsers");
  const teamSync = useDbSync(teamsCol, "setTeams");
  const reposSync = useDbSync(reposCol, "setRepos");
  const projectsSync = useDbSync(projectsCol, "setProjects");
  const implementationsSync = useDbSync(
    implementationsCol,
    "setImplementations"
  );

  useEffect(() => {
    const unsubs = [
      userSync(),
      teamSync(),
      reposSync(),
      projectsSync(),
      implementationsSync(),
    ];

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, []);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
