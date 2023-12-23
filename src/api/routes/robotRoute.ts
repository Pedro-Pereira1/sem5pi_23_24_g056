import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';

import config from "../../../config";
import ICreateRobotController from '../../controllers/IControllers/robot/create/ICreateRobotController';
import IListAllRobotsController from '../../controllers/IControllers/robot/list/IListAllRobotsController';
import IInhibitRobotController from '../../controllers/IControllers/robot/inhibit/IInhibitRobotController';
import IRobotController from '../../controllers/IControllers/robot/IRobotController';
var validateToken = require('../middlewares/validateToken');

const route = Router();

export default (app: Router) => {
  app.use('/robots', route);

  const ctrl = Container.get(config.controllers.createRobot.name) as ICreateRobotController;
  const ctrlList = Container.get(config.controllers.listAllRobots.name) as IListAllRobotsController;
  const inhibitRobotController = Container.get(config.controllers.inhibitRobot.name) as IInhibitRobotController
  const ctrl1 = Container.get(config.controllers.robot.name) as IRobotController;

  route.post('/createRobot', validateToken,
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

  route.patch('/inhibitRobot', validateToken,
    celebrate({
      body: Joi.object({
        id: Joi.string().required()
      })
    }),
    (req, res, next) => inhibitRobotController.inhibitRobot(req, res, next))

  route.get('/listAll', validateToken, (req, res, next) => { ctrlList.listAllRobots(req, res, next) });

  route.delete('/deleteRobot/:id', validateToken, (req, res, next) => {
    ctrl1.deleteRobot(req, res, next),
    req.params.id
  });
};