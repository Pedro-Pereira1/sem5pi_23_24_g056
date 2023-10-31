import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';

import config from "../../../config";
import ICreateRobotController from '../../controllers/IControllers/robot/create/ICreateRobotController';

const route = Router();

export default (app: Router) => {
  app.use('/robots', route);

  const ctrl = Container.get(config.controllers.createRobot.name) as ICreateRobotController;

  route.post('/createRobot',
    celebrate({
      body: Joi.object({
        code: Joi.string().alphanum().max(30).required(),
        nickname: Joi.string().alphanum().max(30).required(),
        type: Joi.string().alphanum().max(25).required(),
        serialNumber: Joi.string().alphanum().max(50).required(),
        description: Joi.string().max(250)
      })
    }),
    (req, res, next) => ctrl.createRobot(req, res, next) );

};