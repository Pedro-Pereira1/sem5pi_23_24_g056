import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreateElevatorController from '../../controllers/IControllers/elevator/create/ICreateElevatorController';

const route = Router();

export default (app: Router) => {
    app.use('/elevators', route)

    const ctrl = Container.get(config.controllers.createElevator.name) as ICreateElevatorController
    
    route.post('/createElevator', 
    celebrate({
        body: Joi.object({
            elevatorId: Joi.number().required().min(1),
            elevatorBrand: Joi.string(),
            elevatorDescription: Joi.string(),
            elevatorModel: Joi.string(),
            elevatorSerialNumber: Joi.string(),
            buildingCode: Joi.string().required(),
            floorIds: Joi.array().items(Joi.number()).required()
        }),
    }),
    (req, res, next) => ctrl.createElevator(req, res, next));
}