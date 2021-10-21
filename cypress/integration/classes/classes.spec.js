describe('Test classes page', () => {
  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  beforeEach(() => {
    cy.loginAs('consultant')
  })

  it('Check screen name', () => {
    cy.visit('/classes')
    cy.get('.classes-title').should('contain', 'Các lớp học đang quản lý')
  })

  it('Check class links working', () => {
    cy.get('.class_management p.mb-4').then($classes => {
      const rand = randomBetween(0, $classes.length - 1)
      cy.wrap($classes)
        .eq(rand)
        .invoke('text')
        .then($name => {
          cy.wrap($classes)
            .eq(rand)
            .click()
            .then(() => {
              cy.get('.students-title').should('contain', $name)
            })
        })
    })
  })
})
