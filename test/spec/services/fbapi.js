'use strict';

describe('Service: fbAPI', function () {

  // load the service's module
  beforeEach(module('fbPageScraperApp'));

  // instantiate service
  var fbAPI;
  beforeEach(inject(function (_fbAPI_) {
    fbAPI = _fbAPI_;
  }));

  it('should do something', function () {
    expect(!!fbAPI).toBe(true);
  });

});
