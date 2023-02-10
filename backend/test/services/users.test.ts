import assert from 'assert';
import app from '../../src/app';

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });

  it('create a user and encrypts password', async () => {
    // Requests for creating users will always be external
    const params = { provider: 'external' };

    const user = await app.service('users').create({
      email: 'chuck@norris.com',
      password: 'verysecret',
      name: 'Chuck Norris'
    }, 
    params
    );
    
    // Makes sure the password got encrypted
    assert.ok(user.password !== 'verysecret');
  });

  it('removes password after creation', async () => {
    // Setting `provider` indicates an external request
    const params = { provider: 'rest' };

    const user = await app.service('users').create(
      {
        email: 'test@example.com',
        password: 'verysecret'
      },
      params
    );

    // Makes sure the password got encrypted
    assert.ok(user.password !== 'verysecret');

    // Make sure password has been removed
    assert.ok(!user.password);
  });
});
