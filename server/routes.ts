import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';
import ItemCtrl from './controllers/item';
import CustomFieldCtrl from './controllers/customfield';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const itemCtrl = new ItemCtrl();
  const customFieldCtrl = new CustomFieldCtrl();

  router.route('/Items').get(itemCtrl.getAll);
  router.route('/Item/:id').get(itemCtrl.get);
  router.route('/ItemInfo/:id').get(itemCtrl.getItemInfo);
  router.route('/ChildItems/:parentid').get(itemCtrl.getChildItems);
  router.route('/ChildItems').get(itemCtrl.getChildItems);
  router.route('/ItemSearch/:text').get(itemCtrl.search);
  router.route('/customfields').get(customFieldCtrl.getAll);

  router.route('/FullTree').get(itemCtrl.getFullTree);
  


  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
