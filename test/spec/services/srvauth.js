'use strict';

describe('Service: srvAuth', function () {

  // load the service's module
  beforeEach(module('fbPageScraperApp'));

  // instantiate service
  var srvAuth;
  beforeEach(inject(function (_srvAuth_) {
    srvAuth = _srvAuth_;
  }));

  it('should do something', function () {
    expect(!!srvAuth).toBe(true);
  });

});
