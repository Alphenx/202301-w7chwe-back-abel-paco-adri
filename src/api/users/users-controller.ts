import { RequestHandler } from 'express';
import { User, UserModel } from './users-schema.js';
import { queryProjection, queryProjectionPopulated } from './users-types.js';

export const getUsersController: RequestHandler<unknown, User[]> = async (
  _req,
  res,
) => {
  try {
    const foundUsers = await UserModel.find({}, queryProjection).exec();
    res.json(foundUsers);
  } catch {
    res.status(500);
  }
};

export const getUserByEmailController: RequestHandler = async (_req, res) => {
  const { email } = res.locals;
  const user = await UserModel.findOne({ email }, queryProjection)
    .populate('friends', queryProjectionPopulated)
    .populate('enemies', queryProjectionPopulated)
    .exec();

  if (user !== null) {
    return res.json(user);
  }

  res.status(404).json({ Error: 'User not found' });
};

// Patch Friend
export const addFriendByIdController: RequestHandler<{
  id: string;
  idFriend: string;
}> = async (req, res) => {
  const { id, idFriend } = req.params;

  const updatedFriend = await UserModel.updateOne(
    { _id: id },
    { $push: { friends: idFriend } },
  );

  if (updatedFriend.matchedCount === 0) {
    return res.sendStatus(404);
  }

  if (updatedFriend.modifiedCount === 1) {
    return res.sendStatus(204);
  }

  res.sendStatus(500);
};

// Patch Enemy
export const addEnemyByIdController: RequestHandler<{
  id: string;
  idEnemy: string;
}> = async (req, res) => {
  const { id, idEnemy } = req.params;

  const updatedEnemy = await UserModel.updateOne(
    { _id: id },
    { $push: { enemies: idEnemy } },
  );

  if (updatedEnemy.matchedCount === 0) {
    return res.sendStatus(404);
  }

  if (updatedEnemy.modifiedCount === 1) {
    return res.sendStatus(204);
  }

  res.sendStatus(500);
};
