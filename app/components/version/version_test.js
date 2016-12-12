'use strict';

describe('appLolIse.version module', function() {
  beforeEach(module('appLolIse.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
