import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateFloorController from '../../controllers/IControllers/floor/create/ICreateFloorController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/floors', route)

    const ctrl = Container.get(config.controllers.createFloor.name) as ICreateFloorController
    
    route.post('/createFloor', 
    celebrate({
        body: Joi.object({
            floorNumber:  Joi.number.max(10),
            floorDescription: Joi.string().max(255),
        }),
    }),
    (req, res, next) => ctrl.createFloor(req, res, next));
}