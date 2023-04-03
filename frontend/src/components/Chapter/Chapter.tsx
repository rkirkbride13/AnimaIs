import { FormEvent } from "react";
import serverURL from "../../serverURL";

interface ChapterInt {
  chapter: any;
  token: string | null;
  setChapters: React.Dispatch<React.SetStateAction<any[]>>;
}

const Chapter = ({ chapter, token, setChapters }: ChapterInt) => {
  const renderChapters = () => {
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
    }
  };

  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(serverURL() + "/chapters", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        chapter_id: chapter._id,
      },
    });

    if (response.status !== 200) {
      console.log("chapter NOT deleted");
    } else {
      console.log("chapter deleted");
      renderChapters();
    }
  };

  const handleExtend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(serverURL() + "/chapters", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        chapter_id: chapter._id,
      },
      body: JSON.stringify({ content: chapter.content.join().slice(-700) }),
    });

    if (response.status !== 200) {
      console.log("chapter NOT extended");
    } else {
      console.log("chapter extended");
      renderChapters();
    }
  };

  return (
    <>
      <div className="mb-2 relative pt-12 flex justify-between items-center">
        <p className="flex-none text-lg font-semibold text-teal-600">
          {chapter.title}
        </p>
        <div className="flex-none flex items-center">
          <form onSubmit={handleDelete}>
            <input
              className="rounded-md bg-teal-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              data-cy="delete-button"
              type="submit"
              value="Delete"
            />
          </form>
          <form onSubmit={handleExtend}>
            <input
              className="ml-2 rounded-md bg-teal-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              data-cy="extend-button"
              type="submit"
              value="Extend"
            />
          </form>
        </div>
      </div>

      <div className="mb-20 border-2 rounded-lg p-2">
        <p data-cy="chapter">
          {chapter.content}
        </p>
      </div>
    </>
  );
};

export default Chapter;
