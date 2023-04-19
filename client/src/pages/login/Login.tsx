import { FC } from "react";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button";
import { githubSignIn } from "../../global-state/firebaseApi";

const Login: FC = () => {
  return (
    <div className={styles.root}>
      <h3>Welcome</h3>
      <h4>
        Please register both your GitHub and Discord accounts to get started
      </h4>
      <div className={styles.signIn}>
        <Button onClick={githubSignIn}>Github Sign In</Button>
        <Button>Discord Sign In</Button>
      </div>
    </div>
  );
};

export default Login;