import { authMiddleware } from './auth-middleware';

// Creamos una función para simular una solicitud y una respuesta de Express
const mockRequest = () => {
  const req = {} as any;
  req.headers = {};
  return req;
};

const mockResponse = () => {
  const res = {} as any;
  res.locals = {};
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe('Given an authMiddleware function', () => {
  it('When no JWT is provided, should send 401', () => {
    const req = mockRequest();
    const res = mockResponse();

    authMiddleware(req, res, () => {});

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
