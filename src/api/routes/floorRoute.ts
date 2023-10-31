import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateFloorController from '../../controllers/IControllers/floor/create/ICreateFloorController';

import config from "../../../config";
import IListAllFloorsController from '../../controllers/IControllers/floor/list/IListAllFloorsController';
import IEditFloorController from '../../controllers/IControllers/floor/edit/IEditFloorController';

const route = Router();

export default (app: Router) => {
    app.use('/floors', route)

    const ctrl = Container.get(config.controllers.createFloor.name) as ICreateFloorController
    const ctrllistAllFloors = Container.get(config.controllers.listAllFloors.name) as IListAllFloorsController
    const ctrlEditFloor = Container.get(config.controllers.editFloor.name) as IEditFloorController

    route.get('/listAllFloors/:buildingId',
    (req, res, next) => { ctrllistAllFloors.listAllFloors(req, res, next);
        req.params.buildingId
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

    route.put('/editFloor',
		celebrate({
            body: Joi.object({
                floorId: Joi.number().required(),
                floorNumber:  Joi.number().max(10),
                floorDescription: Joi.string().max(255),
            }),
		}),
		(req, res, next) => ctrlEditFloor.editFloor(req, res, next)
	);
}
