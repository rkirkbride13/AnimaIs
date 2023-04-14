import Chapter from "./Chapter";

const chapter: any = {
  title: "The Dog",
  content: "Something about dogs",
  user_id: "123xyz",
};

describe("Chapter", () => {
  it("renders with a chapter and delete button", () => {
    let setChaptersMock = cy.stub();

    cy.mount(
      <Chapter
        chapter={chapter}
        token={"tokenMock"}
        setChapters={setChaptersMock}
        loading={false}
      />
    );

    cy.get('[data-cy="chapter"]').should(
      "contain.text",
      "Something about dogs"
    );
    cy.get('[data-cy="delete-button"]')
      .invoke("attr", "type")
      .should("eq", "submit");
  });

  it("sends a DELETE request and can delete a chapter", () => {
    let setChaptersMock = cy.stub();

    cy.mount(
      <Chapter
        chapter={chapter}
        token={"tokenMock"}
        setChapters={setChaptersMock}
        loading={false}
      />
    );
    cy.intercept("DELETE", "chapters", { message: "DELETED" }).as(
      "deleteChapter"
    );

    cy.get('[data-cy="delete-button"]').click();
    cy.wait("@deleteChapter").then((interception) => {
      expect(interception.response!.body.message).to.eq("DELETED");
    });
  });
});
