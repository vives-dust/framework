import assert from 'assert';
import app from '../../src/app';

describe('\'soilmodels\' service', () => {
  it('registered the service', () => {
    const service = app.service('soilmodels');

    assert.ok(service, 'Registered the service');
  });
});
