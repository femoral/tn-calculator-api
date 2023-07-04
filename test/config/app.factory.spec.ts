import { makeApp } from '../../src/config/app.factory';

describe('Application Bootstrap', () => {
  it('should bootstrap the application', async () => {
    const app = await makeApp();

    expect(app).toBeDefined();
  });
});
