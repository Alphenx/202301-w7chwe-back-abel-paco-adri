import express from 'express';
import {
  getUserByEmailController,
  getUsersController,
  addFriendByIdController,
  addEnemyByIdController,
} from './users-controller.js';

const router = express.Router();

router.route('/').get(getUsersController);
router.route('/:id').get(getUserByEmailController);
router.route('/:id/friends/:idFriend').patch(addFriendByIdController);
router.route('/:id/enemies/:idEnemy').patch(addEnemyByIdController);

export default router;
