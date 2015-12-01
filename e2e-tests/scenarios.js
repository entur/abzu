'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('abzu', function() {


  it('should automatically redirect to /StopPlaceList when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/StopPlaceList");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/view1');
    });


    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });

});
