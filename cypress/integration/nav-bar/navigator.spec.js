/// <reference types="cypress"/>

beforeEach(() => {
  cy.loginAs('consultant')
})

describe('Navigator bar', () => {
  it('Check logo display on the left of screen ', () => {
    cy.get('.navbar-brand')
      .should('be.visible')
      .then(element => {
        expect(element.position().left).to.equal(0)
        expect(element.position().top).to.lessThan(10)
      })
  })
  it('Check hamburgerIcon display near on the right of logo', () => {
    cy.get('.navbar-brand').as('logo')
    cy.get('.navbar-toggler')
      .should('be.visible')
      .then(element => {
        cy.get('@logo').then(logo => {
          expect(logo.position().left).lessThan(element.position().left)
        })
      })
  })
  it('Check user avatar display on the right of navigator bar', () => {
    cy.get('.navbar-nav')
      .children('nav')
      .find('img')
      .should('be.ok')
      .should('be.visible')
      .then(element => {
        expect(element[0].x).lessThan(window.outerWidth)
        expect(element[0].x).greaterThan(window.outerWidth / 2)
      })
  })
})

describe('Logo', () => {
  it('Hover Logo then cursor change to pointer', () => {
    cy.get('.brand-logo > .mr-2')
      .trigger('mouseover')
      .should('have.css', 'cursor', 'pointer')
  })
  it('Click on the logo then route to dashbroad ', () => {
    cy.get('.brand-logo > .mr-2')
      .click()
      .then(() => {
        cy.url().then(url => cy.wrap(url).should('contains', 'dashboard'))
      })
  })
})

describe('Menu icon (hamburger icon)', () => {
  it('Hover on hamburger menu then cusor change to pointer', () => {
    cy.get('[data-toggle="minimize"] > .icon-menu')
      .trigger('mouseover')
      .should('have.css', 'cursor', 'pointer')
  })
  it('Click on menu icon when sidebar is expanded', () => {
    cy.get('[data-toggle="minimize"] > .icon-menu')
      .click()
      .then(() => {
        cy.get('.brand-logo-mini > img').should('be.visible')
        cy.get('.sidebar-icon-only').should('be.visible')
      })
  })
  it('Click on menu icon when sidebar is collapsed', () => {
    cy.get('[data-toggle="minimize"] > .icon-menu')
      .click()
      .then(() => {
        cy.get('.brand-logo-mini > img').should('be.visible')
        cy.get('.sidebar-icon-only').should('be.visible')
      })
      .then(() => {
        cy.get('[data-toggle="minimize"] > .icon-menu')
          .click()
          .then(() => {
            cy.get('.brand-logo-mini > img').should('be.hidden')
            cy.get('.brand-logo > .mr-2').should('be.visible')
          })
      })
  })
})
describe('Avatar', () => {
  it('The default avatar is the initials of the user last name, first name', () => {
    cy.get('.navbar-nav > nav').should('be.visible')
  })
  it('Display the account management window with two options: Personal page, Log out', () => {
    cy.get('.navbar-nav > nav')
      .click()
      .then(() => {
        cy.get('a')
          .contains('Trang cá nhân')
          .invoke('text')
          .then(element => {
            expect(element).to.equals('Trang cá nhân')
          })
        cy.get('a')
          .contains('Đăng xuất')
          .invoke('text')
          .then(element => {
            expect(element).to.equals('Đăng xuất')
          })
      })
  })
  it('Click on the "Personal Page" option', () => {
    cy.get('a')
      .contains('Trang cá nhân')
      .then(element => {
        element[0].click()
        cy.url().then(url => cy.wrap(url).should('contains', 'user/profile'))
      })
  })
  it('Click on the "Logout" option', () => {
    cy.get('a')
      .contains('Đăng xuất')
      .then(element => {
        element[0].click()
      })
    cy.wait(0)
    cy.url().then(url => cy.wrap(url).should('contains', 'login'))
  })
})

describe('Side bar', () => {
  it('Show sidebar', () => {
    cy.get('.active > .nav-link')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(75, 73, 172)')
  })
  it('Hover over the lines in the sidebar', () => {
    cy.get('.nav-item')
      .eq(2)
      .trigger('mouseover')
      .then(element => {
        console.log(element.css('background-color'))
      })
    // .should('have.css', 'background-color', 'rgb(75, 73, 172)')
  })
  it('when hovering over a line, it will display text like the expanded state next to that line.', () => {
    cy.get('[data-toggle="minimize"] > .icon-menu')
      .click()
      .then(() => {
        cy.get('.brand-logo-mini > img').should('be.visible')
        cy.get('.sidebar-icon-only').should('be.visible')
      })
      .then(() => {
        cy.get('.nav-item').should('be.visible')
      })
  })
})
