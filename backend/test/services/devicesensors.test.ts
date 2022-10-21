import assert from 'assert';
import app from '../../src/app';

describe('\'devicesensors\' service', () => {
  it('registered the service', () => {
    const service = app.service('devicesensors');

    assert.ok(service, 'Registered the service');
  });
});
