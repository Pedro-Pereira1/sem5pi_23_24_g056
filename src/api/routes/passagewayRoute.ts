import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreatePassagewayController from '../../controllers/IControllers/passageway/create/ICreatePassagewayController';
import IListPassagewaysBetween2BuildingsController from '../../controllers/IControllers/passageway/list/IListPassagewaysBetween2BuildingsController';
import IEditPassagewayController from "../../controllers/IControllers/passageway/edit/IEditPassagewayController";
import IDeletePassagewayController from '../../controllers/IControllers/passageway/delete/IDeletePassagewayController';
import IListAllPassagewaysController
    from "../../controllers/IControllers/passageway/list/IListAllPassagewaysController";
var validateToken = require('../middlewares/validateToken');

const route = Router();

export default (app: Router) => {
    app.use('/passageways', route)

    const ctrl = Container.get(config.controllers.createPassageway.name) as ICreatePassagewayController
    const ctrlEdit = Container.get(config.controllers.editPassageway.name) as IEditPassagewayController
    const ctrlList = Container.get(config.controllers.listPassagewaysBetween2Buildings.name) as IListPassagewaysBetween2BuildingsController
    const ctrlDelete = Container.get(config.controllers.deletePassageway.name) as IDeletePassagewayController
    const ctrlListAll = Container.get(config.controllers.listAllPassageways.name) as IListAllPassagewaysController

    route.post('/createPassageway', validateToken,
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

    route.put('/editPassageway', validateToken,
        celebrate({
            body: Joi.object({
                passagewayId: Joi.number().required().min(1),
                floor1Id: Joi.number().required(),
                floor2Id: Joi.number().required()
            }),
        }),
        (req, res, next) => ctrlEdit.editPassageway(req, res, next));

    route.get('/list/building1/:building1Code/building2/:building2Code', validateToken,
    (req, res, next) => {ctrlList.listPassagewaysBetween2Buildings(req, res, next);
        req.params.building1Code;
        req.params.building2Code});


    route.delete('/deletePassageway/:id', validateToken, (req, res, next) => { ctrlDelete.deletePassageway(req, res, next); });

    route.get('/listAll', validateToken, (req, res, next) => {
        ctrlListAll.listAllPassageways(req, res, next); });

    route.get('/findFloorsByPassageway/:passagewayId', validateToken, (req, res, next) => {
        ctrlList.findFloorsByPassageway(req, res, next); });
}
