import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateBuildingController from '../../controllers/IControllers/building/createBuilding/ICreateBuildingController';
import IListBuildingsMaxMinFloorsController from '../../controllers/IControllers/building/list/IListBuildingsMaxMinFloorsController';


import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/buildings', route)

    const ctrl = Container.get(config.controllers.createbuilding.name) as ICreateBuildingController
    
    const ctrl1 = Container.get(config.controllers.listBuildingsMaxMinFloors.name) as IListBuildingsMaxMinFloorsController   

    route.post('/createBuilding', 
    celebrate({
        body: Joi.object({
            buildingName:  Joi.string().alphanum().max(50),
            buildingDescription: Joi.string().max(255),
            buildingCode: Joi.string().alphanum().max(5).required()
        }),
    }),
    (req, res, next) => ctrl.createBuilding(req, res, next));

    route.get('/listBuildingsMaxMinFloors', (req, res, next) =>
		ctrl1.listBuildingsMaxMinFloors(req, res, next)
	);

}