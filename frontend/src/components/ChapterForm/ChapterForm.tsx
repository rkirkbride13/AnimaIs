import React, { useState, FormEvent, ChangeEvent, ReactElement } from "react";
import { NavigateFunction } from "react-router";
import serverURL from "../../serverURL";

interface ChapterFormInt {
  navigate: NavigateFunction;
  token: string | null;
  setChapters: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChapterForm = ({
  navigate,
  token,
  setChapters,
  setLoading,
}: ChapterFormInt): ReactElement => {
  const handleChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFunction(event.target.value);
    };
  };

  const [animal, setAnimal] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [facts, setFacts] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

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
          animal: animal,
          age: age,
          facts: facts,
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
              setLoading(false);
              setChapters(data.chapters);
            });
        } else {
          setLoading(false);
          console.log("No luck");
        }
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center relative isolate overflow-hidden py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-teal-500 sm:text-4xl">
                Generate a chapter.
              </h2>
              <p className="mt-4 text-lg leading-8 text-teal-500">
                Fill the boxes below with an animal, the target age of the
                reader and the number of facts to include and hit generate to
                see your chapter come to life.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4">
                <input
                  id="animal"
                  name="animal"
                  type="animal"
                  data-cy="animal"
                  autoComplete="animal"
                  required
                  className="min-w-0 flex-auto rounded-md border-2 bg-white/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Animal"
                  value={animal}
                  onChange={handleChange(setAnimal)}
                />
                <input
                  id="age"
                  name="age"
                  type="age"
                  data-cy="age"
                  autoComplete="age"
                  required
                  className="min-w-0 flex-auto rounded-md border-2 bg-white/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Age"
                  value={age}
                  onChange={handleChange(setAge)}
                />
                <input
                  id="facts"
                  name="facts"
                  type="facts"
                  data-cy="facts"
                  autoComplete="facts"
                  required
                  className="min-w-0 flex-auto rounded-md border-2 bg-white/5 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  placeholder="Facts"
                  value={facts}
                  onChange={handleChange(setFacts)}
                />
                <button
                  onClick={handleSubmit}
                  type="submit"
                  data-cy="submit-chapter"
                  className="flex-none rounded-md bg-teal-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterForm;
