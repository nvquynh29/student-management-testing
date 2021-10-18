import { getConsultantAuth, getStudentAuth } from '../../support'

const randomString = () => `random${Math.random().toString(10).substring(2, 7)}`
const randomEmail = () => `${randomString()}@gmail.com`
describe('Test login page', () => {
  const DELAY = 1000
  beforeEach(() => {
    cy.visit('/')
  })

  it('Login with valid consultant account', () => {
    cy.get('input[name="email"]').type(getConsultantAuth().email)
    cy.get('input[name="password"]').type(getConsultantAuth().password)
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
    cy.url().then(url => cy.wrap(url).should('contains', 'dashboard'))
  })

  it('Login with valid student account', () => {
    cy.get('input[name="email"]').type(getStudentAuth().email)
    cy.get('input[name="password"]').type(getStudentAuth().password)
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
    cy.url().then(url => cy.wrap(url).should('contains', 'dashboard'))
  })

  it('Handle empty input', () => {
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })
  it('Handle empty email', () => {
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })
  it('Handle empty password', () => {
    cy.get('input[name="email"]').type(randomEmail())
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })

  it('Validate email format', () => {
    cy.get('input[name="email"]').type(randomString())
    cy.get('input[name="password"]').type(randomString())
    cy.get('button[type="submit"]').click()
    cy.wait(DELAY)
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
    cy.get('input[name="email"]').type(getConsultantAuth().email)
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
