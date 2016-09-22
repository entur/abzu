module.exports = {

  '@tags': ['smoke'],
  'Belloads' : function (browser) {
    browser
      .waitForElementVisible('body', 1000)
      .end()
  }

}
