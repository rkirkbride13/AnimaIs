import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";
import ChapterForm from "../ChapterForm/ChapterForm";

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

  const mapChapters = () => {
    return (
      <>
        {chapters.map((chapter) => {
          return (
            <>
              <div className="chapter-block">
                <div data-cy="chapter">{chapter.title}</div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="main-container">
        <div className="chapters-container">
          <ChapterForm
            navigate={navigate}
            setChapters={setChapters}
            token={token}
          />
          <div>{mapChapters()}</div>
        </div>
      </div>
    </>
  );
};

export default UserChapters;
