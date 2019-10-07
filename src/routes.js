import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

// Middleware Auth
import authMiddleware from './app/middlewares/authenticate';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// Check is Logged
routes.use(authMiddleware);

// Update User
routes.put('/users', UserController.update);
routes.get('/users/meetups_owner', UserController.meetups_owner);
routes.get('/users/meetups_enrolled', UserController.meetups_enrolled);

// Meetups
routes.get('/meetups', MeetupController.index);
routes.get('/meetups/:id', MeetupController.show);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.destroy);

// Subscription Meetup
routes.post('/subscriptions', SubscriptionController.store);

// Upload Files
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
