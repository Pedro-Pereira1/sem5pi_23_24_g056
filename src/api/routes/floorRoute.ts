import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateFloorController from '../../controllers/IControllers/floor/create/ICreateFloorController';

import config from "../../../config";
import IListAllFloorsController from '../../controllers/IControllers/floor/list/IListAllFloorsController';
import ILoadFloorMapController from '../../controllers/IControllers/floor/floorMap/ILoadFloorMapController';

import multer from 'multer'
import bodyParser from 'body-parser';

const route = Router();

export default (app: Router) => {
    app.use('/floors', route)

    app.use(multer)
    app.use(bodyParser.urlencoded({ extended: false }))

    const upload = multer({ storage: multer.memoryStorage() })

    const ctrl = Container.get(config.controllers.createFloor.name) as ICreateFloorController
    const ctrllistAllFloors = Container.get(config.controllers.listAllFloors.name) as IListAllFloorsController
    const ctrlLoadFLoorMap = Container.get(config.controllers.loadFloorMap.name) as ILoadFloorMapController

    route.get('/listAllFloors/:buildingId',
        (req, res, next) => {
            ctrllistAllFloors.listAllFloors(req, res, next);
            req.params.buildingId
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

    route.patch('/loadFloorMap',
    celebrate({
        body: Joi.object({
            //floorId: Joi.number().required(),
            //floorMap: Joi.required(),
        })
    }), upload.single('floorMap'), (req, res, next) => ctrlLoadFLoorMap.loadFloorMap(req, res, next))
}
