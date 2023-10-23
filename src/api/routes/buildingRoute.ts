import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICreateBuildingController from '../../controllers/IControllers/building/createBuilding/ICreateBuildingController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/buildings', route)

    const ctrl = Container.get(config.controllers.createbuilding.name) as ICreateBuildingController
    
    route.post('/createBuilding', 
    celebrate({
        body: Joi.object({
            buildingName:  Joi.string().alphanum().max(50),
            buildingDescription: Joi.string().max(255),
            buildingCode: Joi.require().string().alphanum().max(5)
        }),
    }),
    (req, res, next) => ctrl.createBuilding(req, res, next));
}