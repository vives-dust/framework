import assert from 'assert';
import app from '../../src/app';

describe('\'sensortypes\' service', () => {
  it('registered the service', () => {
    const service = app.service('sensortypes');

    assert.ok(service, 'Registered the service');
  });
});
