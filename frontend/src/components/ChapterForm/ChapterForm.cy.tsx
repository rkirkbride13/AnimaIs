import ChapterForm from "./ChapterForm";

const navigate = () => {};

describe("Chapter Form", () => {
  it("sends a request when the form is submitted", () => {
    let setChaptersMock = cy.stub();
    let setLoadingMock = cy.stub();
    cy.mount(
      <ChapterForm
        navigate={navigate}
        token={"tokenMock"}
        setChapters={setChaptersMock}
        loading={false}
        setLoading={setLoadingMock}
      />
    );

    cy.intercept("POST", "/chapters", { message: "OK" }).as("saveChapter");

    cy.get('[data-cy="animal"]').type("Dog");
    cy.get('[data-cy="age"]').type("5");
    cy.get('[data-cy="facts"]').type("3");
    cy.get('[data-cy="submit-chapter"]').click();

    cy.wait("@saveChapter").then((interception) => {
      expect(interception.response!.body.message).to.eq("OK");
    });
  });
});
