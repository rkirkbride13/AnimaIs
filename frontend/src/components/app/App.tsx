import { ReactElement } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpForm from "../SignUpForm/SignUpForm";
import SignInForm from "../SignInForm/SignInForm";
import UserChapters from "../UserChapters/UserChapters";

const App = (): ReactElement => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpForm navigate={useNavigate()} />} />
      <Route path="/" element={<SignInForm navigate={useNavigate()} />} />
      <Route
        path="/chapters"
        element={<UserChapters navigate={useNavigate()} />}
      />
    </Routes>
  );
};

export default App;
