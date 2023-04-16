import { FC } from "react";
import styles from "./Login.module.css";
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import Button from "../../components/Button/Button";

const Login: FC = () => {
  const auth = getAuth();

  const githubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      signInWithPopup(auth, provider);
    } catch (e) {}
  };

  return (
    <div className={styles.root}>
      <h3>Welcome</h3>
      <h4>
        Please register both your GitHub and Discord accounts to get
        started
      </h4>
      <div className={styles.signIn}>
        <Button onClick={githubSignIn}>Github Sign In</Button>
        <Button>Discord Sign In</Button>
      </div>
    </div>
  );
};

export default Login;
