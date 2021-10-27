/// <reference types="cypress"/>
// var casual = require('casual')
const randomString = length => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
beforeEach(() => {
  cy.loginAs('consultant')
  cy.visit('/user/profile')
})

describe('Profile pages', () => {
  it('The title shows up in the middle of the screen at the top with the text: "Personal Page"', () => {
    cy.get('.max-w-7xl > .font-semibold')
      .should('be.visible')
      .should('have.css', 'text-align', 'center')
  })

  it('Button "Trang chủ" displayed on a par with the screen title, close to the left', () => {
    cy.get('header .btn')
      .should('be.visible')
      .then(element => {
        expect(element.position().left).to.lessThan(100)
      })
  })

  it('When hovering over the "Trang chủ" button, the mouse pointer changes to a hand icon', () => {
    cy.get('header .btn')
      .should('be.visible')
      .trigger('mouseover')
      .should('have.css', 'cursor', 'pointer')
  })

  it('When you click on the "Trang chủ" button, you will go to the dashboard', () => {
    cy.get('header .btn')
      .should('be.visible')
      .click()
      .then(() => {
        cy.url().then(url => cy.wrap(url).should('contain', 'dashboard'))
      })
  })
  it('Show basic information of the user', () => {
    cy.get('[data-cy=avatar]').should('be.visible')
    cy.get('#name').should('be.visible')
    cy.get('#email').should('be.visible')
    cy.get('[data-cy=change-avt-btn]')
      .contains('Chọn ảnh đại diện mới')
      .should('be.visible')
  })

  it('Edit name, email', () => {
    cy.get('#name').should('be.visible').clear().click().type(randomString(20))
    cy.get('#email')
      .should('be.visible')
      .clear()
      .click()
      .type(`${randomString(10)}@gmail.com`)
    cy.get('[data-cy=save-btn]')
      .click()
      .then(() => {
        cy.contains('Đã lưu')
      })
  })

  it('Show password input boxes', () => {
    cy.get('#current_password').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.get('#password_confirmation').should('be.visible')
  })

  it('Do not enter password, click "Lưu" button', () => {
    cy.get('#current_password').should('be.visible').clear()
    cy.get('#password').should('be.visible').clear()
    cy.get('#password_confirmation').should('be.visible').clear()
    cy.get('[data-cy=save-password]').click()
    cy.contains('current password được yêu cầu.')
    cy.contains('password được yêu cầu.')
  })

  it('New password and confirm password do not match', () => {
    cy.get('#password').should('be.visible').type(randomString(10))
    cy.get('#password_confirmation').should('be.visible').type(randomString(10))
    cy.get('[data-cy=save-password]').click()
    cy.contains('password xác nhận không trùng khớp.')
  })

  it('2FA on/off status', () => {
    cy.contains('Bạn đang tắt tính năng xác thực hai yếu tố').then(() => {
      cy.get('[data-cy=active-btn]')
        .click()
        .then(() => {
          cy.contains('Xác thực tài khoản').should('be.visible')
          cy.contains(
            'Để bảo mật tài khoản của bạn, vui lòng xác nhận mật khẩu để tiếp tục'
          ).should('be.visible')
          cy.contains('Quay lại')
            .click()
            .then(() => {
              cy.contains('Xác thực tài khoản').should('be.hidden')
              cy.contains(
                'Để bảo mật tài khoản của bạn, vui lòng xác nhận mật khẩu để tiếp tục'
              ).should('be.hidden')
            })
        })
    })
  })

  it('Delete account', () => {
    cy.get('[data-cy=delete-btn]')
      .click()
      .then(() => {
        cy.get('[data-cy=confirm-modal]').should('be.visible')
      })
  })
})
