'use strict';

describe('abzu.version module', function() {
  beforeEach(module('abzu.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
