import { getConsultantAuth } from '../../support'

describe('Test home page - Consultant', () => {
  before(() => {
    cy.visit('/')
    cy.get('input[name="email"]').type(getConsultantAuth().email)
    cy.get('input[name="password"]').type(getConsultantAuth().password)
    cy.get('button[type="submit"]').click()
  })

  it('Check screen name', () => {
    cy.get('.screen-name')
      .should('be.visible')
      .then($name => expect($name).to.contain('Hệ thống quản lý sinh viên'))
  })
  it('Check slides title', () => {
    cy.get('.slides-title')
      .should('be.visible')
      .then($title =>
        expect($title).to.contain('Các sự kiện của trường đang diễn ra')
      )
  })
  it('Check slide images visible', () => {
    cy.get('.carousel-item img').should('be.visible')
  })
  it('Check slides auto play', () => {
    cy.get('.carousel-indicators li.active')
      .should('be.visible')
      .invoke('attr', 'data-slide-to')
      .then($index => {
        cy.wait(4500)
        cy.get('.carousel-indicators li.active')
          .invoke('attr', 'data-slide-to')
          .then($curr => expect($curr).to.not.equal($index))
      })
  })
  it('Check prev slide button', () => {
    cy.get('.carousel-indicators li.active')
      .should('be.visible')
      .invoke('attr', 'data-slide-to')
      .then($index => {
        cy.get(
          'a[href="#carouselExampleIndicators"][class="carousel-control-prev"]'
        )
          .should('be.visible')
          .click()
        cy.get('.carousel-indicators li.active')
          .invoke('attr', 'data-slide-to')
          .then($curr => expect($curr).to.not.equal($index))
      })
  })
  it('Check next slide button', () => {
    cy.wait(4600)
    cy.get('.carousel-indicators li.active')
      .should('be.visible')
      .invoke('attr', 'data-slide-to')
      .then($index => {
        cy.get(
          'a[href="#carouselExampleIndicators"][class="carousel-control-next"]'
        )
          .should('be.visible')
          .click()
        cy.get('.carousel-indicators li.active')
          .invoke('attr', 'data-slide-to')
          .then($curr => expect($curr).to.not.equal($index))
      })
  })
  it('Check class list title', () => {
    cy.get('h3.class-list').then($title =>
      expect($title).to.contain('Các lớp học đang quản lý')
    )
  })
  it('Check report title', () => {
    cy.get('.report-title').eq(0).should('contain', 'Báo cáo tổng quan')
  })
})
