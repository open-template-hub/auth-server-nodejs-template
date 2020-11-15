import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { AuthController } from '../controller/auth.controller';

const subRoutes = {
  root: '/',
  signup: '/signup',
  login: '/login',
  logout: '/logout',
  token: '/token',
  verify: '/verify',
  forgetPassword: '/forget-password',
  resetPassword: '/reset-password',
};

export const router = Router();

router.post(subRoutes.signup, async (req: Request, res: Response) => {
  const authController = new AuthController();
  const response = await authController.signup(res.locals.ctx.dbProviders.postgreSqlProvider, {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });
  res.status(201).json({ email: response });
});

router.post(subRoutes.login, async (req: Request, res: Response) => {
  const authController = new AuthController();
  const response = await authController.login(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    {
      username: req.body.username,
      password: req.body.password,
    }
  );
  res.status(200).json({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  });
});

router.post(subRoutes.logout, async (req: Request, res: Response) => {
  const authController = new AuthController();
  await authController.logout(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    req.body.token
  );
  res.status(204).json({});
});

router.post(subRoutes.token, async (req: Request, res: Response) => {
  const authController = new AuthController();
  const accessToken = await authController.token(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    req.body.token
  );
  res
    .status(200)
    .json({ accessToken: accessToken, refreshToken: req.body.token });
});

router.post(subRoutes.verify, async (req: Request, res: Response) => {
  const authController = new AuthController();
  await authController.verify(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    req.query.token
  );
  res.status(200).json({});
});

router.post(subRoutes.forgetPassword, async (req: Request, res: Response) => {
  const authController = new AuthController();
  await authController.forgetPassword(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    req.body.username
  );
  res.status(200).json({});
});

router.post(subRoutes.resetPassword, async (req: Request, res: Response) => {
  const authController = new AuthController();
  await authController.resetPassword(
    res.locals.ctx.dbProviders.postgreSqlProvider,
    {
      username: req.body.username,
      password: req.body.password,
    },
    req.body.token
  );
  res.status(200).json({});
});
