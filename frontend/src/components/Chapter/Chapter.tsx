import { FormEvent } from "react";
import serverURL from "../../serverURL";

interface ChapterInt {
  chapter: any;
  token: string | null;
  setChapters: React.Dispatch<React.SetStateAction<any[]>>;
}

const Chapter = ({ chapter, token, setChapters }: ChapterInt) => {
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
    }
  };

  return (
    <>
      <div>
        <p data-cy="chapter">
          <form onSubmit={handleDelete}>
            <input data-cy="delete-button" type="submit" value="X" />
          </form>
          - {chapter.title} - {chapter.content}
        </p>
      </div>
    </>
  );
};

export default Chapter;
