import { useEffect, useState, useReducer, ChangeEvent } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";
import ChapterForm from "../ChapterForm/ChapterForm";
import Chapter from "../Chapter/Chapter";
import NavBar from "../navbar/navbar";

interface ChaptersInt {
  navigate: NavigateFunction;
}

const UserChapters = ({ navigate }: ChaptersInt) => {
  const [chapters, setChapters] = useState<Array<any>>([]);
  const [token] = useState<string | null>(window.localStorage.getItem("token"));
  const [loading, setLoading] = useState<boolean>(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const navbarLinks = () => {
    if (!token) {
      return [{ href: "/", text: "Login", handleClick: () => {} }];
    } else {
      return [
        {
          href: "/",
          text: "Logout",
          handleClick: (e: ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            window.localStorage.removeItem("token");
            forceUpdate();
            navigate("/");
          },
        },
      ];
    }
  };

  useEffect(() => {
    if (token) {
      fetch(serverURL() + "/chapters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          setChapters(data.chapters);
        });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      <nav>
        <NavBar links={navbarLinks()} />
      </nav>
      <div className="mt-10">
        <ChapterForm
          navigate={navigate}
          setChapters={setChapters}
          token={token}
          loading={loading}
          setLoading={setLoading}
        />
        <div className="mx-20">
          {chapters.map((chapter) => (
            <Chapter
              key={chapter._id}
              chapter={chapter}
              token={token}
              setChapters={setChapters}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserChapters;
