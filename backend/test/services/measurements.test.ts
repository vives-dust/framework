import assert from 'assert';
import app from '../../src/app';

describe('\'measurements\' service', () => {
  it('registered the service', () => {
    const service = app.service('measurements');

    assert.ok(service, 'Registered the service');
  });
});
