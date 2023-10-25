import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreatePassagewayController from '../../controllers/IControllers/passageway/create/ICreatePassagewayController';

const route = Router();

export default (app: Router) => {
    app.use('/passageways', route)

    const ctrl = Container.get(config.controllers.createPassageway.name) as ICreatePassagewayController
    
    route.post('/createPassageway', 
    celebrate({
        body: Joi.object({
            passagewayId: Joi.number().required(),
            passagewayCoordinatesTopX : Joi.number().required(),
            passagewayCoordinatesTopY : Joi.number().required(),
            passagewayCoordinatesBottomX : Joi.number().required(),
            passagewayCoordinatesBottomY : Joi.number().required(),
        }),
    }),
    (req, res, next) => ctrl.createPassageway(req, res, next));
}