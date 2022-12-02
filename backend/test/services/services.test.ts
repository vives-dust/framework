import assert from 'assert';
import app from '../../src/app';

describe('\'services\' service', () => {
  it('registered the service', () => {
    const service = app.service('services');

    assert.ok(service, 'Registered the service');
  });
});
