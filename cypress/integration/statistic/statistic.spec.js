/// <reference types="cypress"/>
beforeEach(() => {
  cy.loginAs('consultant')
  cy.visit('/statistical')
})
describe('Chart', () => {
  it('Check the content of the chart title', () => {
    cy.get(
      '[data-cy=chart-wrapper] > :nth-child(1) > .card > .card-body > .card-title'
    )
      .should('be.visible')
      .should('contain.text', 'Bảng thống kê học lực của sinh viên ')
    //   .should('contain.', 'Bảng Thống Kê Học Lực Của Sinh Viên')
    //   .contains('Bảng Thống Kê Học Lực Của Sinh Viên')
  })
  it('Check filter display', () => {
    cy.get('.chart-header').should('be.visible')
    cy.get('.chart-header > :nth-child(1) > .text-center')
      .should('be.visible')
      .then(element => {
        expect(element.text()).to.equals('---Chọn loại biểu đồ---')
      })
    cy.get('.chart-header > :nth-child(2) > .text-center')
      .should('be.visible')
      .then(element => {
        expect(element.text()).to.equals('---Chọn lớp học---')
      })
  })
  it('Check default value chart type ', () => {
    cy.get('#select2-select-chart-type-container')
      .should('be.visible')
      .should('contain.text', 'Biểu đồ dạng cột')
  })
  it('Check default classe', () => {
    cy.get('#select2-select-class-container')
      .should('be.visible')
      .should('contain.text', 'QH-2019-I/CQ-C-B')
  })
  it('Get API data', () => {
    cy.intercept('GET', '/statistical')
  })
  it('When choosing radar chart', () => {
    cy.get('#select2-select-chart-type-container')
      .click()
      .as('clicked')
      .then(() => {
        cy.get('.select2-results__options')
          .children()
          .contains('Biểu đồ Radar')
          .click()
          .then(() => {
            cy.get('#select2-select-chart-type-container')
              .contains('Biểu đồ Radar')
              .should('be.visible')
          })
        cy.contains('Biểu đồ Radar').should('be.visible')
      })
  })

  it('When choosing line chart', () => {
    cy.get('#select2-select-chart-type-container')
      .click()
      .as('clicked')
      .then(() => {
        cy.get('.select2-results__options')
          .children()
          .contains('Biểu đồ dạng đường')
          .click()
          .then(() => {
            cy.get('#select2-select-chart-type-container')
              .contains('Biểu đồ dạng đường')
              .should('be.visible')
          })
        cy.contains('Biểu đồ dạng đường').should('be.visible')
      })
  })
  it('When choosing area chart', () => {
    cy.get('#select2-select-chart-type-container')
      .click()
      .as('clicked')
      .then(() => {
        cy.get('.select2-results__options')
          .children()
          .contains('Biểu đồ vùng cực')
          .click()
          .then(() => {
            cy.get('#select2-select-chart-type-container')
              .contains('Biểu đồ vùng cực')
              .should('be.visible')
          })
        cy.contains('Biểu đồ vùng cực').should('be.visible')
      })
  })
})
describe('Tabel of classes lack of tuition tatble ', () => {
  it('Check the content of the chart title', () => {
    cy.get('[data-cy=lack-tuition-table-classes]')
      .should('be.visible')
      .children()
      .should('be.visible')
    cy.get(
      '[data-cy=lack-tuition-table-classes] > .col-md-12 > .card > .card-body > .card-title'
    ).should('be.visible')
    cy.get('.table-responsive thead')
      .eq(0)
      .children('tr')
      .children('th')
      .should('have.length', 4)
      .should(
        'contain.text',
        'Tên lớp họcTổng học phíHạn chót nộp học phíTrạng thái'
      )
  })
  it('Check the total tuition fee of any class', () => {
    cy.get('.table-responsive tbody')
      .eq(0)
      .children()
      .each(item => {
        expect(item[0].innerText).not.null
      })
  })
})
describe('Tabel of students lack of tuition table ', () => {
  it('Check the content of table', () => {
    cy.get('[data-cy=lack-tuition-table-students]')
    cy.get('.table-responsive thead')
      .eq(1)
      .children('tr')
      .children('th')
      .should('have.length', 7)
      .should(
        'contain.text',
        'Họ và tênMã số sinh viênLớpTổng học phíĐã nộpCòn thiếuNhắc nhở'
      )
  })
  it('Check the total tuition fee of any class', () => {
    cy.get('.table-responsive tbody')
      .eq(1)
      .children()
      .each(item => {
        expect(item[0].innerText).not.null
        expect(item[0].innerText).contain('Nhắc nhở')
      })
  })
})
describe('Table of students at risk of falling out of school', () => {
  it('Check the content of table', () => {
    cy.get('[data-cy=force-quite]')
    cy.get('.table-responsive thead')
      .eq(2)
      .children('tr')
      .children('th')
      .should('have.length', 8)
      .should(
        'contain.text',
        'Họ và tênMã số sinh viênLớpGPASố tín đang nợSố lần cảnh báoNămCảnh báo'
      )
  })
  it('Check the total tuition fee of any class', () => {
    cy.get('.table-responsive tbody')
      .eq(2)
      .children()
      .each(item => {
        expect(item[0].innerText).not.null
        expect(item[0].innerText).contain('Cảnh báo')
      })
  })
})
