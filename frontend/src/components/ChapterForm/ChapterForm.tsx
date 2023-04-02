import React, { useState, FormEvent, ChangeEvent, ReactElement } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";

interface ChapterFormInt {
  navigate: NavigateFunction;
  token: string | null;
  setChapters: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChapterForm = ({
  navigate,
  token,
  setChapters,
}: ChapterFormInt): ReactElement => {
  const handleChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFunction(event.target.value);
    };
  };

  const [title, setTitle] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      navigate("/");
    } else {
      fetch(serverURL() + "/chapters", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
        }),
      }).then((response) => {
        if (response.status === 200) {
          console.log("Success");
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
          console.log("No luck");
        }
      });
    }
  };

  return (
    <>
      <div className="form-page">
        <br></br>
        <div className="header">
          What would you like this chapter to be about?
        </div>
        <br></br>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="title">Title: </label>
            <input
              className="input"
              placeholder="Chapter title"
              id="title"
              data-cy="title"
              type="text"
              style={{ width: "120px" }}
              value={title}
              onChange={handleChange(setTitle)}
            />
          </div>
          <input
            className="save"
            id="submit"
            data-cy="submit-chapter"
            type="submit"
            value="Save"
            style={{ marginLeft: 125 }}
          />
        </form>
      </div>
    </>
  );
};

export default ChapterForm;
