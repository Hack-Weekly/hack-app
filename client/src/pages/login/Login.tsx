import { FC, useState } from "react";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { githubSignIn } from "../../global-state/firebaseSetup";
import { apiServer } from "../../utils";

const Login: FC = () => {
  return (
    <div className={styles.root}>
      <h3>Welcome</h3>
      <h4>
        Please register both your GitHub and Discord accounts to get started
      </h4>
      <div className={styles.signIn}>
        <a href={`${apiServer}/login/discord`}>Sign up</a>
      </div>
    </div>
  );
};

export default Login;
