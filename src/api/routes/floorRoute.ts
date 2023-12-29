import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateFloorController from '../../controllers/IControllers/floor/create/ICreateFloorController';
import IDeleteFloorController from '../../controllers/IControllers/floor/delete/IDeleteFLoorController';

import config from "../../../config";
import IListAllFloorsController from '../../controllers/IControllers/floor/list/IListAllFloorsController';
import IEditFloorController from '../../controllers/IControllers/floor/edit/IEditFloorController';
import ILoadFloorMapController from '../../controllers/IControllers/floor/floorMap/ILoadFloorMapController';
import IListFloorsPassagewaysController from "../../controllers/IControllers/floor/list/IListFloorsPassagewaysController";

const route = Router();

export default (app: Router) => {
    app.use('/floors', route)

    const ctrl = Container.get(config.controllers.createFloor.name) as ICreateFloorController
    const ctrllistAllFloors = Container.get(config.controllers.listAllFloors.name) as IListAllFloorsController
    const ctrllistFloorsPassageways = Container.get(config.controllers.listFloorsPassageways.name) as IListFloorsPassagewaysController
    const ctrlEditFloor = Container.get(config.controllers.editFloor.name) as IEditFloorController
    const ctrlLoadFLoorMap = Container.get(config.controllers.loadFloorMap.name) as ILoadFloorMapController
    const ctrlDelete = Container.get(config.controllers.deleteFloor.name) as IDeleteFloorController

    route.get('/listAllFloors/:buildingId',
        (req, res, next) => {
            ctrllistAllFloors.listAllFloors(req, res, next);
            req.params.buildingId
        });

    route.get('/listFloorsPassageways/:buildingCode',
        (req, res, next) => {
            ctrllistFloorsPassageways.listFloorsPassageways(req, res, next);
            req.params.buildingCode
        });

    route.post('/createFloor',
        celebrate({
            body: Joi.object({
                floorId: Joi.number().required(),
                floorNumber: Joi.number().max(10),
                floorDescription: Joi.string().max(255),
                buildingCode: Joi.string().alphanum().max(5).required()
            }),
        }),
        (req, res, next) => ctrl.createFloor(req, res, next));

    route.put('/editFloor',
        celebrate({
            body: Joi.object({
                floorId: Joi.number().required(),
                floorNumber: Joi.number().max(10),
                floorDescription: Joi.string().max(255),
            }),
        }),
        (req, res, next) => ctrlEditFloor.editFloor(req, res, next)
    );

    route.patch('/loadFloorMap',
    celebrate({
        body: Joi.object({
            floorId: Joi.number().required(),
            buildingCode: Joi.string().alphanum().max(5).required(),
            map: Joi.required(),
            passageways: Joi.required(),
            rooms: Joi.required(),
            roomsCoords: Joi.required(),
            elevators: Joi.required(),
            doors: Joi.required()
        })
    }), (req, res, next) => ctrlLoadFLoorMap.loadFloorMap(req, res, next))

    route.delete('/deleteFloor/:id', (req, res, next) => ctrlDelete.deleteFloor(req, res, next)
    )
}
