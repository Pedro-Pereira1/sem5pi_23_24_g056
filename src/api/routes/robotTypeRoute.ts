import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';

import config from "../../../config";
import ICreateRobotTypeController from '../../controllers/IControllers/robotType/create/ICreateRobotTypeController';
import IRobotTypeController from '../../controllers/IControllers/robotType/IRobotTypeController';


const route = Router();

export default (app: Router) => {
  app.use('/robotTypes', route);

  const ctrl = Container.get(config.controllers.createRobotType.name) as ICreateRobotTypeController;
  const ctrl1 = Container.get(config.controllers.robotType.name) as IRobotTypeController;

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

    route.get('/listAllRobotTypes', (req, res, next) => {
      ctrl1.listAllRobotTypes(req, res, next)
    });

    route.delete('/deleteRobotType/:id', (req, res, next) => {
      ctrl1.deleteRobotType(req, res, next),
      req.params.id
    });


};