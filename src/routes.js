import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/authenticate';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Check is Logged
routes.use(authMiddleware);

// Update User
routes.put('/users', UserController.update);

export default routes;
