import React, {
  useState,
  FormEvent,
  ChangeEvent,
  ReactElement,
} from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";

interface SignInFormInt {
  navigate: NavigateFunction;
}

const SignInForm = ({ navigate }: SignInFormInt): ReactElement => {
  const handleChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setUserFound(true);
      setFunction(event.target.value);
    };
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userFound, setUserFound] = useState<boolean>(true);
  const [emptyField, setEmptyField] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let response = await fetch(serverURL() + "/tokens", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.status === 200) {
      console.log("Success");
      let data = await response.json();
      window.localStorage.setItem("token", data.token);
      navigate("/acts");
    } else if (email === "" || password === "") {
      setEmptyField("All fields are required");
    } else {
      setUserFound(false);
      console.log("No luck");
    }
  };

  const handleError = () => {
    if (!userFound) {
      return <div className="invalid-details">This user was not found</div>;
    } else if (emptyField) {
      return <div className="invalid-details">{emptyField}</div>;
    } else {
      return <></>;
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="flanking-block-left"></div>
        <div className="form-page">
          <br></br>
          <div className="header">Please sign in below</div>
          <br></br>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="email">Email: </label>
              <input
                className="input"
                placeholder="Your email"
                id="email"
                data-cy="email"
                type="text"
                style={{ width: "120px" }}
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password: </label>
              <input
                className="input"
                placeholder="Your password"
                id="password"
                data-cy="password"
                type="password"
                value={password}
                onChange={handleChange(setPassword)}
              />
            </div>
            {handleError()}
            <br></br>
            <div className="submit-with-link">
              <input
                className="submit"
                id="submit"
                data-cy="signin-submit"
                type="submit"
                value="Sign In"
              />
              <a href="/signup">Or sign up</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignInForm;
