import { Request, Response } from 'express';
import { UserModel } from './users-schema.js';
import {
  addEnemyByIdController,
  addFriendByIdController,
  getUserByEmailController,
  getUsersController,
} from './users-controller.js';

describe('Given a getUsersController function from users-controller', () => {
  const request = {} as Request;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const users = [
    {
      name: 'pepito',
      email: 'pepito@gmail.com',
      password: 'pepito123456',
      profileURL: 'https://pepito-img.com',
      friends: [],
      enemies: [],
    },
  ];

  test('When the database response is successfull, then it should respond with a list of users', async () => {
    UserModel.find = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(users),
    }));
    await getUsersController(request, response as Response, jest.fn());
    expect(response.json).toHaveBeenCalledWith(users);
  });

  test('When the database throws an error then it should respond with status 500', async () => {
    UserModel.find = jest.fn();
    await getUsersController(request, response as Response, jest.fn());
    expect(response.status).toHaveBeenCalledWith(500);
  });
});

describe('Given a getUserByEmailController from users-controller', () => {
  const request = {} as Request;

  const response = {
    locals: { email: 'mockEmail@gmail.com' },
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  } as Partial<Response>;

  const user = {
    name: 'pepito',
    email: 'pepito@gmail.com',
    password: 'pepito123456',
    profileURL: 'https://pepito-img.com',
    friends: [],
    enemies: [],
  };

  UserModel.findOne = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(user),
  }));

  test('When the user exists then it should respond with a user', async () => {
    await getUserByEmailController(
      request as Request,
      response as Response,
      jest.fn(),
    );

    expect(response.json).toHaveBeenCalledWith(user);
  });

  test('When the user does not exist then it should return a 404 status', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }));

    await getUserByEmailController(
      request as Request,
      response as Response,
      jest.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ Error: 'User not found' });
  });
});

// ---

describe('Given a addFriendByIdController from user-controller', () => {
  const mockRequest = {
    params: {
      id: 'id1',
      idFriend: 'id2',
    },
  } as Request<{ id: string; idFriend: string }>;

  const mockResponse = {
    sendStatus: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('when the user is found and the friend is added, then it should respond with a 204 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
    });

    await addFriendByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { friends: mockRequest.params.idFriend } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  });

  test('when the user is not found, then it should respond with a 404 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 0,
    });

    await addFriendByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { friends: mockRequest.params.idFriend } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
  });

  test('when there is an error during the update, then it should respond with a 500 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 0,
    });

    await addFriendByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { friends: mockRequest.params.idFriend } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe('Given a addEnemyByIdController from user-controller', () => {
  const mockRequest = {
    params: {
      id: 'id1',
      idEnemy: 'id2',
    },
  } as Request<{ id: string; idEnemy: string }>;

  const mockResponse = {
    sendStatus: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('when the user is found and the enemy is added, then it should respond with a 204 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
    });

    await addEnemyByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { enemies: mockRequest.params.idEnemy } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  });

  test('when the user is not found, then it should respond with a 404 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 0,
    });

    await addEnemyByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { enemies: mockRequest.params.idEnemy } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
  });

  test('when there is an error during the update, then it should respond with a 500 status', async () => {
    UserModel.updateOne = jest.fn().mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 0,
    });

    await addEnemyByIdController(mockRequest, mockResponse, jest.fn());

    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: mockRequest.params.id },
      { $push: { enemies: mockRequest.params.idEnemy } },
    );
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });
});
