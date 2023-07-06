import { makeApp } from './config/app.factory';
import { getFromEnv } from './config/env';

makeApp().then((app) => {
  if (process.env.EXECUTION_ENVIRONMENT !== 'serverless') {
    app.listen(getFromEnv('APP_PORT', '3000'), () => {
      //TODO: implement proper logging
      console.log('Server started ');
    });
  }
});
