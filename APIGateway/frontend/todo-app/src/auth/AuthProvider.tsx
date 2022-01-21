import "./";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

const AuthProvider: React.FC = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  async function signUp(username: string, password: string) {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
      });
      console.log(user);
    } catch (error) {
      console.log("error signing up:", error);
    }
  }

  async function confirmSignUp(code: string) {
    try {
      await Auth.confirmSignUp(username, code);
      setLoggedIn(true);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  async function signIn(username: string, password: string) {
    console.log("SIGN in", username);
    try {
      const user = await Auth.signIn(username, password);
      setLoggedIn(true);
      console.log("USER", user);
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async function getUser() {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log("USER");
        setLoggedIn(true);
      })
      .catch((err) => setLoggedIn(false));
  }

  useEffect(() => {
    getUser();
  }, []);

  if (!loggedIn) {
    return (
      <div>
        <button onClick={() => signIn(username, password)}>Sign in</button>
        <form
          onSubmit={(e) => {
            console.log("submit");
            e.preventDefault();
            signIn(username, password);
          }}
        >
          <label htmlFor="username">email</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>

        <button onClick={() => signUp(username, password)}>Sign up</button>
        <form onSubmit={() => signUp(username, password)}>
          <label>email</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>
        <br />
        <input value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => confirmSignUp(code)}>Verify code</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
