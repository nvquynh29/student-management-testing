describe('Test courses page', () => {
  const randomString = () =>
    `random${Math.random().toString(10).substring(2, 7)}`
  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  beforeEach(() => {
    cy.loginAs('consultant')
    cy.visit('/course')
  })

  it('Test screen name', () => {
    cy.get('.courses-title').should('contain', 'Môn học')
  })
  it('Check table filter default value', () => {
    cy.get('div[name="select1"] select').should('contain', 'Mã môn học')
    cy.get('div[name="select2"] select').should('contain', 'Tăng dần')
    cy.get('div[name="select3"] select').should('contain', '10')
  })
  it('Add course button working', () => {
    cy.get('.add-course').click()
    cy.url().should('contain', 'course/create')
  })
  it('Check search input placeholder', () => {
    cy.get('.courses-search')
      .invoke('attr', 'placeholder')
      .should('equal', 'Tìm kiếm tên, mã môn, năm học')
  })
  it('Test table filter', () => {
    cy.get('div[name="select2"] select')
      .select('0')
      .then(() => {
        cy.get('div[name="select3"] select')
          .select('100')
          .then(() => {
            cy.wait(2000)
            cy.get('tr td[class="id"]')
              .as('courseIds')
              .its('length')
              .then(length => {
                if (length) {
                  cy.get('@courseIds').then(() => {
                    for (let i = 0; i < length - 1; i++) {
                      cy.get('@courseIds')
                        .eq(i)
                        .invoke('text')
                        .then(id => {
                          cy.get('@courseIds')
                            .eq(i + 1)
                            .invoke('text')
                            .then(id2 => expect(id2 < id).to.equal(true))
                        })
                    }
                  })
                }
              })
          })
      })
  })
  it('Search with random string', () => {
    cy.get('.courses-search')
      .type(randomString())
      .then(() => {
        cy.wait(2000)
        cy.get('tr td[class="id"]').should('not.exist')
      })
  })
  it('Search courses by name', () => {
    cy.get('tr td[class="name"]').then($courseNames => {
      const rand = randomBetween(0, $courseNames.length - 1)
      cy.wrap($courseNames)
        .eq(rand)
        .invoke('text')
        .then(name => {
          cy.get('.courses-search')
            .type(name)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td[class="name"]').should('contain', name)
            })
        })
    })
  })
  it('Search courses by id', () => {
    cy.get('tr td[class="id"]').then($courseIds => {
      const rand = randomBetween(0, $courseIds.length - 1)
      cy.wrap($courseIds)
        .eq(rand)
        .invoke('text')
        .then(courseId => {
          cy.get('.courses-search')
            .type(courseId)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td[class="id"]').should('contain', courseId)
            })
        })
    })
  })
  it('Check table header', () => {
    cy.get('tr > th').as('header')
    cy.get('@header').eq(0).should('contain', 'STT')
    cy.get('@header').eq(1).should('contain', 'Mã môn học')
    cy.get('@header').eq(2).should('contain', 'Tên môn học')
    cy.get('@header').eq(3).should('contain', 'Kì')
    cy.get('@header').eq(4).should('contain', 'Năm')
    cy.get('@header').eq(5).should('contain', 'Số tín chỉ')
    cy.get('@header').eq(6).should('contain', 'Hành động')
  })
  it('Hide table pagination when filter value greater than list courses length', () => {
    cy.get('div[name="select3"] select')
      .select('100')
      .then(() => {
        cy.wait(2000)
        cy.get('.page-link').should('not.exist')
      })
  })
  it('Show table pagination when filter value less than list courses length', () => {
    cy.get('div[name="select3"] select')
      .select('10')
      .then(() => {
        cy.wait(2000)
        cy.get('.page-link').should('exist')
      })
  })
  it('Check table pagination', () => {
    cy.get('.page-link').then($pages => {
      const rand = randomBetween(1, $pages.length - 2)
      cy.wrap($pages)
        .eq(rand)
        .click()
        .then(() => {
          if (rand !== 1) {
            cy.wait(2000)
            cy.url().should('contain', `?page=${rand}`)
          }
        })
    })
  })
  it('Edit button working', () => {
    cy.get('.edit-course').then($editBtns => {
      const rand = randomBetween(0, $editBtns.length - 1)
      cy.wrap($editBtns)
        .eq(rand)
        .click()
        .then(() => cy.url().should('contain', 'edit'))
    })
  })
  /**
   * This testcase will delete random data in database
   * Be careful when use it
   */
  // it('Delete button working', () => {
  //   cy.get('tr td[class="id"]').then($courseIds => {
  //     const rand = randomBetween(0, $courseIds.length - 1)
  //     cy.wrap($courseIds)
  //       .eq(rand)
  //       .invoke('text')
  //       .then(courseId => {
  //         cy.get('.delete-course')
  //           .eq(rand)
  //           .click()
  //           .then(() => {
  //             cy.wait(2000)
  //             cy.get('.courses-search')
  //               .type(courseId)
  //               .then(() => {
  //                 cy.wait(1000)
  //                 cy.get('tr td[class="id"]').should('not.exist')
  //               })
  //           })
  //       })
  //   })
  // })
})
