import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import ICreateElevatorController from '../../controllers/IControllers/elevator/create/ICreateElevatorController';
import IEditElevatorController from '../../controllers/IControllers/elevator/edit/IEditElevatorController';
import IListElevatorsInBuildingController from '../../controllers/IControllers/elevator/list/IListElevatorsInBuildingController';

const route = Router();

export default (app: Router) => {
    app.use('/elevators', route)

    const ctrl = Container.get(config.controllers.createElevator.name) as ICreateElevatorController
    const ctrlEdit = Container.get(config.controllers.editElevator.name) as IEditElevatorController
    const ctrlList = Container.get(config.controllers.listElevatorsInBuilding.name) as IListElevatorsInBuildingController
    
    route.post('/create', 
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

    route.put('/edit', 
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

    route.get('/listInBuilding/:buildingCode', 
        (req, res, next) => {ctrlList.listElevatorsInBuilding(req, res, next);
            req.params.buildingCode;
        }
    );
}