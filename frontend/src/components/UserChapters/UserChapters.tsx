import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";
import ChapterForm from "../ChapterForm/ChapterForm";
import Chapter from "../Chapter/Chapter";

interface ChaptersInt {
  navigate: NavigateFunction;
}

const UserChapters = ({ navigate }: ChaptersInt) => {
  const [chapters, setChapters] = useState<Array<any>>([]);
  const [token] = useState<string | null>(window.localStorage.getItem("token"));

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
      <div>
        <ChapterForm
          navigate={navigate}
          setChapters={setChapters}
          token={token}
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
