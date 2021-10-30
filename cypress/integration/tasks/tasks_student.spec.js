describe('Test tasks page - student account', () => {
  const randomString = () =>
    `random${Math.random().toString(10).substring(2, 7)}`
  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  beforeEach(() => {
    cy.loginAs('student')
    cy.visit('/task')
  })

  it('Test screen name', () => {
    cy.get('.task-title').should('contain', 'Công việc')
  })
  it('Check table filter default value', () => {
    cy.get('div[name="select1"] select').should('contain', 'ID')
    cy.get('div[name="select2"] select').should('contain', 'Tăng dần')
    cy.get('div[name="select3"] select').should('contain', '10')
  })
  it('Check search input placeholder', () => {
    cy.get('.task-search')
      .invoke('attr', 'placeholder')
      .should('equal', 'ID, tên công việc, người liên quan')
  })
  // Filters
  it('Test table filter - sort by', () => {
    cy.get('div[name="select2"] select').as('sortASC')
    cy.get('div[name="select1"] select').as('sortBy')
    cy.get('div[name="select1"] select option')
      .as('options')
      .its('length')
      .then(length => {
        const rand = randomBetween(0, length - 1)
        cy.get('@options')
          .eq(rand)
          .invoke('attr', 'value')
          .then(value => {
            cy.get('@sortBy').select(value)
            cy.wait(1000)
            cy.get(`tr td.${value}`)
              .as('filteredList')
              .its('length')
              .then(len => {
                if (len) {
                  for (let i = 0; i < len - 1; i++) {
                    cy.get('@filteredList')
                      .eq(i)
                      .invoke('text')
                      .then(value => {
                        cy.get('@filteredList')
                          .eq(i + 1)
                          .invoke('text')
                          .then(value2 => {
                            cy.get('@sortASC')
                              .invoke('val')
                              .then(ascending => {
                                const asc = !!parseInt(ascending)
                                expect(
                                  value2 >= value ||
                                    parseInt(value2) > parseInt(value) ||
                                    !!value2.localeCompare(value)
                                ).to.equal(asc)
                              })
                          })
                      })
                  }
                }
              })
          })
      })
  })
  it('Test table filter - showing records', () => {
    cy.get('div[name="select3"] select')
      .invoke('val')
      .then(value => {
        const perPage = parseInt(value)
        cy.get('tr td.id')
          .its('length')
          .then(length => assert.isAtMost(length, perPage))
      })
  })
  it('Test table filters', () => {
    const DELAY = 500
    const perPage = 25
    cy.get('div[name="select2"] select').select('0')
    cy.get('div[name="select3"] select').select(`${perPage}`)
    cy.wait(DELAY)
    cy.get('tr td.id')
      .as('list')
      .its('length')
      .then(length => {
        assert.isAtMost(length, perPage)
        for (let i = 0; i < length - 1; i++) {
          cy.get('@list')
            .eq(i)
            .invoke('text')
            .then(value => {
              cy.get('@list')
                .eq(i + 1)
                .invoke('text')
                .then(value2 => {
                  expect(
                    value2 < value || parseInt(value2) < parseInt(value)
                  ).to.equal(true)
                })
            })
        }
      })
  })
  // Search
  it('Search with random string', () => {
    cy.get('.task-search')
      .type(randomString())
      .then(() => {
        cy.wait(1000)
        cy.get('tr td.id').should('not.exist')
      })
  })
  it('Search task by name', () => {
    cy.get('tr td.name').then($names => {
      const rand = randomBetween(0, $names.length - 1)
      cy.wrap($names)
        .eq(rand)
        .invoke('text')
        .then(name => {
          cy.get('.task-search')
            .type(name)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td.name').should('contain', name)
            })
        })
    })
  })
  it('Search task by id', () => {
    cy.get('tr td.id').then($ids => {
      const rand = randomBetween(0, $ids.length - 1)
      cy.wrap($ids)
        .eq(rand)
        .invoke('text')
        .then(id => {
          cy.get('.task-search')
            .type(id)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td.id').should('contain', id)
            })
        })
    })
  })
  // Table
  it('Check table header', () => {
    cy.get('tr > th').as('header')
    cy.get('@header').eq(0).should('contain', 'ID')
    cy.get('@header').eq(1).should('contain', 'Tên')
    cy.get('@header').eq(2).should('contain', 'Kì hạn')
    cy.get('@header').eq(3).should('contain', 'Tiến độ')
    cy.get('@header').eq(4).should('contain', 'Được giao bởi')
    cy.get('@header').eq(5).should('contain', 'Trạng thái')
    cy.get('@header').eq(6).should('contain', 'Hành động')
  })
  it('Click on task row then show task detail', () => {
    cy.get('tr').then($rows => {
      const rand = randomBetween(0, $rows.length - 1)
      cy.wrap($rows)
        .eq(rand)
        .click({ force: true })
        .then(() => cy.get('.expanded-row').should('be.visible'))
    })
  })
  it('Edit task button working', () => {
    cy.get('.edit-task').then($btns => {
      const rand = randomBetween(0, $btns.length - 1)
      cy.wrap($btns)
        .eq(rand)
        .click()
        .then(() => {
          cy.url().should('contain', '/edit')
        })
    })
  })
})
