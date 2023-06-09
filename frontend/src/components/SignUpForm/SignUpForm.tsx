import React, { useState, FormEvent, ChangeEvent, ReactElement } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import NavBar from "../navbar/navbar";

interface SignUpFormInt {
  navigate: NavigateFunction;
}

const SignUpForm = ({ navigate }: SignUpFormInt): ReactElement => {
  const handleChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setEmailExists(false);
      setFunction(event.target.value);
    };
  };

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [emptyField, setEmptyField] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch(serverURL() + "/users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Success");
        navigate("/");
      } else if (email === "" || password === "" || name === "") {
        setEmptyField("All fields are required");
      } else {
        setEmailExists(true);
        console.log("No luck");
      }
    });
  };

  const handleError = () => {
    if (emailExists) {
      return (
        <div className="text-red-600 text-base font-semibold">
          Email already exists
        </div>
      );
    } else if (emptyField) {
      return (
        <div className="text-red-600 text-base font-semibold">{emptyField}</div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <NavBar links={[]} />
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8 my-10">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-teal-500">
              Sign up a new account
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="username"
                  data-cy="name"
                  autoComplete="username"
                  required
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Username"
                  value={name}
                  onChange={handleChange(setName)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  data-cy="email"
                  autoComplete="email"
                  required
                  className="relative block w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Email address"
                  value={email}
                  onChange={handleChange(setEmail)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  data-cy="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange(setPassword)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                data-cy="signup-submit"
                className="group relative flex w-full justify-center rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Sign up
              </button>
            </div>
            <a
              className="group relative flex w-full justify-center rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href="/"
            >
              Or sign in
            </a>
          </form>
        </div>
      </div>
      {handleError}
    </>
  );
};

export default SignUpForm;
