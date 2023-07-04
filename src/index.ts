import { makeApp } from './config/app.factory';

makeApp().then((app) => {
  if (process.env.EXECUTION_ENVIRONMENT !== 'serverless') {
    app.listen(3000, () => {
      //TODO: implement proper logging
      console.log('Server started ');
    });
  }
});
