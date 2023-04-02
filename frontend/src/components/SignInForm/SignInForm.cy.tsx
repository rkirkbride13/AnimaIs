import SignInForm from "./SignInForm";

const navigate = () => {}

describe("Signing in", () => {
  it("calls the /tokens endpoint", () => {
    cy.mount(<SignInForm navigate={navigate} />);

    cy.intercept("POST", "/tokens", { token: "token" }).as("signInRequest");
    cy.get('[data-cy="email"]').type("someone@example.com");
    cy.get('[data-cy="password"]').type("password");
    cy.get('[data-cy="signin-submit"]').click();
    cy.wait("@signInRequest").then((interception) => {
      expect(interception.response!.body.token).to.eq("token");
    });
  });
});