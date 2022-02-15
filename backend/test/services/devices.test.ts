import assert from 'assert';
import app from '../../src/app';

describe('\'devices\' service', () => {
  it('registered the service', () => {
    const service = app.service('devices');

    assert.ok(service, 'Registered the service');
  });
});
