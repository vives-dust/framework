import assert from 'assert';
import app from '../../src/app';

describe('\'moisture\' service', () => {
  it('registered the service', () => {
    const service = app.service('moisture');

    assert.ok(service, 'Registered the service');
  });
});
