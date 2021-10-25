describe('Test view grade page', () => {
  const randomString = () =>
    `random${Math.random().toString(10).substring(2, 7)}`
  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  beforeEach(() => {
    cy.loginAs('consultant')
    cy.visit('/view-grade')
  })

  it('Test screen name', () => {
    cy.get('.grade-title').should('contain', 'Kết quả học tập')
  })
  it('Check table filter default value', () => {
    cy.get('div[name="select1"] select').should('contain', 'MSV')
    cy.get('div[name="select2"] select').should('contain', 'Tăng dần')
    cy.get('div[name="select3"] select').should('contain', '10')
    cy.get('div[name="select4"] select').should('contain', 'Tất cả các lớp')
  })
  it('Check search input placeholder', () => {
    cy.get('.grade-search')
      .invoke('attr', 'placeholder')
      .should('equal', 'Tìm kiếm tên hoặc mã sinh viên')
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
        // cy.get('@options')
        //   .eq(rand)
        //   .invoke('attr', 'data-test')
        //   .then(slug => {

        //   })
      })
  })
  it('Test table filter - class filter', () => {
    cy.get('div[name="select4"] select')
      .as('classFilter')
      .find('option')
      .then($options => {
        const rand = randomBetween(0, $options.length - 1)
        cy.wrap($options)
          .eq(rand)
          .invoke('text')
          .then(className => {
            cy.get('@classFilter').select(className)
            cy.wait(1000)
            cy.get('.class-name')
              .as('filteredList')
              .its('length')
              .then(length => {
                for (let i = 0; i < length - 1; i++) {
                  cy.get('@filteredList').eq(i).should('contain', className)
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
        cy.get('tr td[class="msv"]')
          .its('length')
          .then(length => assert.isAtMost(length, perPage))
      })
  })
  it('Test table filters', () => {
    const DELAY = 500
    const perPage = 25
    const className = 'QH-2019-I/CQ-J'
    cy.get('div[name="select2"] select').select('0')
    cy.get('div[name="select3"] select').select(`${perPage}`)
    cy.get('div[name="select4"] select').select(className)
    cy.wait(DELAY)
    cy.get('tr td[class="msv"]')
      .as('list')
      .should('have.length', perPage)
      .then(() => {
        for (let i = 0; i < perPage - 1; i++) {
          cy.get('@list')
            .eq(i)
            .invoke('text')
            .then(value => {
              cy.get('@list')
                .eq(i + 1)
                .invoke('text')
                .then(value2 => {
                  expect(value2 < value).to.equal(true)
                })
            })
        }
      })
    cy.get('tr td.class-name')
      .as('classes')
      .its('length')
      .then(length => {
        for (let i = 0; i < length; i++) {
          cy.get('@classes').eq(i).should('contain', className)
        }
      })
  })
  // Search
  it('Search with random string', () => {
    cy.get('.grade-search')
      .type(randomString())
      .then(() => {
        cy.wait(1000)
        cy.get('tr td[class="msv"]').should('not.exist')
      })
  })
  it('Search student by name', () => {
    cy.get('tr td.name').then($names => {
      const rand = randomBetween(0, $names.length - 1)
      cy.wrap($names)
        .eq(rand)
        .invoke('text')
        .then(name => {
          cy.get('.grade-search')
            .type(name)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td.name').should('contain', name)
            })
        })
    })
  })
  it('Search student by id', () => {
    cy.get('tr td.msv').then($ids => {
      const rand = randomBetween(0, $ids.length - 1)
      cy.wrap($ids)
        .eq(rand)
        .invoke('text')
        .then(id => {
          cy.get('.grade-search')
            .type(id)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td.msv').should('contain', id)
            })
        })
    })
  })
  // Table
  it('Check table header', () => {
    cy.get('tr > th').as('header')
    cy.get('@header').eq(0).should('contain', 'Mã SV')
    cy.get('@header').eq(1).should('contain', 'Tên SV')
    cy.get('@header').eq(2).should('contain', 'Lớp')
    cy.get('@header').eq(3).should('contain', 'Số TC tích lũy')
    cy.get('@header').eq(4).should('contain', 'GPA')
    cy.get('@header').eq(5).should('contain', 'Số TC đang nợ')
    cy.get('@header').eq(6).should('contain', 'Số lần nhắc nhở')
  })
  it('Check table pagination', () => {
    cy.get('.page-link').then($pages => {
      const rand = randomBetween(1, $pages.length - 2)
      cy.wrap($pages)
        .eq(rand)
        .click()
        .then(() => {
          if (rand !== 1) {
            cy.wait(1000)
            cy.url().should('contain', `?page=${rand}`)
          }
        })
    })
  })
})
