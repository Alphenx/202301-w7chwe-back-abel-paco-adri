import { UserModel } from '../users/users-schema';
import { Request, Response } from 'express';
import { loginUserController, registerUserController } from './auth-controller';
import { encryptPassword, generateJWTToken } from './auth-utils';

describe('Given a auth-controllers', () => {
  const request = {
    body: {
      email: 'abelito@gamil.com',
      password: 'password',
    },
  } as Partial<Request>;

  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const newUser = {
    email: 'abelito@gamil.com',
    password: encryptPassword('password'),
  };
  describe('When a user wants to register with a correct email and password', () => {
    test('Then the user will be registered', async () => {
      UserModel.create = jest.fn();
      UserModel.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await registerUserController(
        request as Request,
        response as Response,
        jest.fn(),
      );

      expect(response.status).toHaveBeenCalledWith(201);
      expect(UserModel.create).toHaveBeenCalledWith(newUser);
    });
  });

  describe('When the user already exists', () => {
    test('Then you should receive a 409 error', async () => {
      UserModel.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(1),
      }));

      await registerUserController(
        request as Request,
        response as Response,
        jest.fn(),
      );
      expect(response.status).toHaveBeenCalledWith(409);
    });
  });
});

describe('Given a login controller', () => {
  const request = {
    body: {
      email: 'abelito@gmail.com',
      password: 'abelito1234',
    },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as Partial<Response>;
  const tokenJWT = {
    accesToken: generateJWTToken(request.body.email),
  };

  test('When the user tries to login and the response is successful, a token is returned', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(1),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(tokenJWT);
  });

  test('When the user tries to login and the user is not found, a 404 is returned', async () => {
    UserModel.findOne = jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(null),
    }));
    await loginUserController(
      request as Request,
      response as Response,
      jest.fn(),
    );
    expect(response.status).toHaveBeenCalledWith(404);
  });
});
