import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreatePassagewayController from '../../controllers/IControllers/passageway/create/ICreatePassagewayController';
import IListPassagewaysBetween2BuildingsController from '../../controllers/IControllers/passageway/list/IListPassagewaysBetween2BuildingsController';

const route = Router();

export default (app: Router) => {
    app.use('/passageways', route)

    const ctrl = Container.get(config.controllers.createPassageway.name) as ICreatePassagewayController
    const ctrlList = Container.get(config.controllers.listPassagewaysBetween2Buildings.name) as IListPassagewaysBetween2BuildingsController

    route.post('/createPassageway',
    celebrate({
        body: Joi.object({
            passagewayId: Joi.number().required(),
            building1Id: Joi.string().alphanum().required(),
            floor1Id: Joi.number().required(),
            building2Id: Joi.string().alphanum().required(),
            floor2Id: Joi.number().required()
        }),
    }),
    (req, res, next) => ctrl.createPassageway(req, res, next));

    route.get('/list/building1/:building1Code/building2/:building2Code', 
    (req, res, next) => {ctrlList.listPassagewaysBetween2Buildings(req, res, next);
        req.params.building1Code;
        req.params.building2Code});
}
