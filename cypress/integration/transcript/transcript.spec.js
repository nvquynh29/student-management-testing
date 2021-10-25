describe('Test Academic transcript page - Consultant role', () => {
  const randomString = () =>
    `random${Math.random().toString(10).substring(2, 7)}`
  const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const id = 5
  beforeEach(() => {
    cy.loginAs('consultant')
    cy.visit(`marks/${id}`)
  })

  it('Test screen name', () => {
    cy.get('.grade').should('contain', 'Kết quả học tập')
  })
  it('Check table filter default value', () => {
    cy.get('div[name="select1"] select').should('contain', 'Mã MH')
    cy.get('div[name="select2"] select').should('contain', 'Tăng dần')
    cy.get('div[name="select3"] select').should('contain', '10')
    cy.get('div[name="select4"] select').should('contain', 'Tất cả kì học')
  })
  it('Check search input placeholder', () => {
    cy.get('.grade-search')
      .invoke('attr', 'placeholder')
      .should('equal', 'Tìm kiếm tên hoặc mã môn học')
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
  it('Test table filter - showing records', () => {
    cy.get('div[name="select3"] select')
      .invoke('val')
      .then(value => {
        const perPage = parseInt(value)
        cy.get('tr td.index')
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
    cy.get('tr td.maMH')
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
                  expect(value2 < value).to.equal(true)
                })
            })
        }
      })
  })
  // Search
  it('Search with random string', () => {
    cy.get('.grade-search')
      .type(randomString())
      .then(() => {
        cy.wait(1000)
        cy.get('tr td.maMH').should('not.exist')
      })
  })
  it('Search course by name', () => {
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
  it('Search course by id', () => {
    cy.get('tr td.maMH').then($ids => {
      const rand = randomBetween(0, $ids.length - 1)
      cy.wrap($ids)
        .eq(rand)
        .invoke('text')
        .then(id => {
          cy.get('.grade-search')
            .type(id)
            .then(() => {
              cy.wait(1000)
              cy.get('tr td.maMH').should('contain', id)
            })
        })
    })
  })
  // Table
  it('Check table header', () => {
    cy.get('tr > th').as('header')
    cy.get('@header').eq(0).should('contain', 'STT')
    cy.get('@header').eq(1).should('contain', 'Mã MH')
    cy.get('@header').eq(2).should('contain', 'Tên môn học')
    cy.get('@header').eq(3).should('contain', 'Số TC')
    cy.get('@header').eq(4).should('contain', 'Điểm hệ 10')
    cy.get('@header').eq(5).should('contain', 'Điểm chữ')
    cy.get('@header').eq(6).should('contain', 'Điểm hệ 4')
    cy.get('@header').eq(7).should('contain', 'Chi tiết')
  })
  it('Mark detail button', () => {
    cy.get('td lord-icon').then($btns => {
      const rand = randomBetween(0, $btns.length - 1)
      cy.wrap($btns)
        .eq(rand)
        .click()
        .then(() => {
          cy.get('.modal-content').should('be.visible')
        })
    })
  })
})
