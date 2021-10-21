const randomString = () => `random${Math.random().toString(10).substring(2, 7)}`
const randomEmail = () => `${randomString()}@gmail.com`
describe('Test login page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Check screen elements visible', () => {
    cy.get('label[for="email"]').should('be.visible')
    cy.get('label[for="password"]').should('be.visible')
    cy.get('input[name="email"]').should('be.visible')
    cy.get('input[name="password"]').should('be.visible')
    cy.get('input[name="remember"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Login with valid consultant account', () => {
    cy.loginAs('consultant')
    cy.url().then(url => cy.wrap(url).should('contains', 'dashboard'))
  })

  it('Login with valid student account', () => {
    cy.loginAs('student')
    cy.url().then(url => cy.wrap(url).should('contains', 'dashboard'))
  })

  it('Handle empty input', () => {
    cy.get('button[type="submit"]').click()
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })
  it('Handle empty email', () => {
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]').click()
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })
  it('Handle empty password', () => {
    cy.get('input[name="email"]').type(randomEmail())
    cy.get('button[type="submit"]').click()
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })

  it('Validate email format', () => {
    cy.get('input[name="email"]').type(randomString())
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]').click()
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })

  it('Handle email does not exist', () => {
    cy.get('input[name="email"]').type(randomEmail())
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get('ul.list-inside li')
          .should('be.visible')
          .then($label =>
            expect($label).to.contain('Email hoặc mật khẩu không chính xác')
          )
      })
  })

  it('Handle password does not match', () => {
    cy.get('input[name="email"]').type(Cypress.env('roles').consultant.email)
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]')
      .click()
      .then(() => {
        cy.get('ul.list-inside li')
          .should('be.visible')
          .then($label =>
            expect($label).to.contain('Email hoặc mật khẩu không chính xác')
          )
      })
  })
})
