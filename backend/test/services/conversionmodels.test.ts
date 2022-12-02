import assert from 'assert';
import app from '../../src/app';

describe('\'conversionmodels\' service', () => {
  it('registered the service', () => {
    const service = app.service('conversionmodels');

    assert.ok(service, 'Registered the service');
  });
});
