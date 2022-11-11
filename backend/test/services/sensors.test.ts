import assert from 'assert';
import app from '../../src/app';

describe('\'sensors\' service', () => {
  it('registered the service', () => {
    const service = app.service('sensors');

    assert.ok(service, 'Registered the service');
  });
});
