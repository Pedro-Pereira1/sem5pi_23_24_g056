import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';

import config from "../../../config";
import ICreateRobotTypeController from '../../controllers/IControllers/robotType/create/ICreateRobotTypeController';

const route = Router();

export default (app: Router) => {
  app.use('/robotTypes', route);

  const ctrl = Container.get(config.controllers.createRobotType.name) as ICreateRobotTypeController;

  route.post('/createRobotType',
    celebrate({
      body: Joi.object({
        robotTypeID: Joi.string().alphanum().max(25).required(),
        robotBrand: Joi.string().max(50).required(),
        robotModel: Joi.string().max(100).required(),
        availableTasks: Joi.array().items(Joi.string().max(50)).required()
      })
    }),
    (req, res, next) => ctrl.createRobotType(req, res, next) );

};