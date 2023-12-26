import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreateElevatorController from '../../controllers/IControllers/elevator/create/ICreateElevatorController';
import IEditElevatorController from '../../controllers/IControllers/elevator/edit/IEditElevatorController';
import IListElevatorsInBuildingController from '../../controllers/IControllers/elevator/list/IListElevatorsInBuildingController';
import IDeleteElevatorController from "../../controllers/IControllers/elevator/delete/IDeleteElevatorController";
import IListAllElevatorsController from "../../controllers/IControllers/elevator/list/IListAllElevatorsController";
var validateToken = require('../middlewares/validateToken');

const route = Router();

export default (app: Router) => {
    app.use('/elevators', route)

    const ctrl = Container.get(config.controllers.createElevator.name) as ICreateElevatorController
    const ctrlEdit = Container.get(config.controllers.editElevator.name) as IEditElevatorController
    const ctrlList = Container.get(config.controllers.listElevatorsInBuilding.name) as IListElevatorsInBuildingController
    const ctrlDelete = Container.get(config.controllers.deleteElevator.name) as IDeleteElevatorController
    const ctrlListAll = Container.get(config.controllers.listAllElevators.name) as IListAllElevatorsController
    
    route.post('/create', validateToken,
    celebrate({
        body: Joi.object({
            elevatorId: Joi.number().required().min(1),
            elevatorBrand: Joi.string(),
            elevatorDescription: Joi.string(),
            elevatorModel: Joi.string(),
            elevatorSerialNumber: Joi.string(),
            buildingCode: Joi.string().required(),
            floorIds: Joi.array().items(Joi.number()).required()
        }),
    }),
    (req, res, next) => ctrl.createElevator(req, res, next));

    route.put('/edit', validateToken,
    celebrate({
        body: Joi.object({
            elevatorIdentificationNumber: Joi.number().required().min(1),
            elevatorBrand: Joi.string(),
            elevatorDescription: Joi.string(),
            elevatorModel: Joi.string(),
            elevatorSerialNumber: Joi.string(),
            buildingCode: Joi.string().required(),
            floorsIdToAdd: Joi.array().items(Joi.number()),
            floorsIdToRemove: Joi.array().items(Joi.number())
        }),
    }),
    (req, res, next) => ctrlEdit.editElevator(req, res, next));

    route.get('/listInBuilding/:buildingCode', validateToken,
        (req, res, next) => {ctrlList.listElevatorsInBuilding(req, res, next);
            req.params.buildingCode;
        }
    );

    route.delete('/delete', validateToken,
    celebrate({
        body: Joi.object({
            elevatorIdentificationNumber: Joi.number().required().min(1),
            buildingCode: Joi.string().required()
        }),
    }),
    (req, res, next) => ctrlDelete.deleteElevator(req, res, next));

    route.get('/listAll', validateToken, (req, res, next) => {
        ctrlListAll.listAllElevators(req, res, next); });


        route.get('/listFloorsByElevatorId/:elevatorIdentificationNumber', 
        (req, res, next) => {ctrlListAll.listFloorsByElevatorId(req, res, next);
            req.params.elevatorIdentificationNumber;
        }
    );
}