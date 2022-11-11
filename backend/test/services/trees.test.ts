import assert from 'assert';
import app from '../../src/app';

describe('\'trees\' service', () => {
  it('registered the service', () => {
    const service = app.service('trees');

    assert.ok(service, 'Registered the service');
  });
});
