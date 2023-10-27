import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateFloorController from '../../controllers/IControllers/floor/create/ICreateFloorController';

import config from "../../../config";
import IListAllFloorsController from '../../controllers/IControllers/floor/list/IListAllFloorsController';

const route = Router();

export default (app: Router) => {
    app.use('/floors', route)

    const ctrl = Container.get(config.controllers.createFloor.name) as ICreateFloorController
    const ctrllistAllFloors = Container.get(config.controllers.listAllFloors.name) as IListAllFloorsController

    route.get('/listAllFloors',
    celebrate({
        body: Joi.object({
          buildingID: Joi.string().alphanum().max(5).required(),
        }),
    }),
    (req, res, next) => { ctrllistAllFloors.listAllFloors(req, res, next)
    });

   route.post('/createFloor',
    celebrate({
        body: Joi.object({
            floorId: Joi.number().required(),
            floorNumber:  Joi.number().max(10),
            floorDescription: Joi.string().max(255),
            buildingCode: Joi.string().alphanum().max(5).required()
        }),
    }),
    (req, res, next) => ctrl.createFloor(req, res, next));
}
