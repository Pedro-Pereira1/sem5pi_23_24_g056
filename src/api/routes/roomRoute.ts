import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';


import config from "../../../config";
import ICreateRoomController from '../../controllers/IControllers/room/create/ICreateRoomController';
import IDeleteRoomController from '../../controllers/IControllers/room/delete/IDeleteRoomController';
import IListAllRoomsInBuildingController from '../../controllers/IControllers/room/list/IListAllRoomsInBuildingController';
var validateToken = require('../middlewares/validateToken');


const route = Router();

export default (app: Router) => {
    app.use('/rooms', route)

    const ctrlCreate = Container.get(config.controllers.createRoom.name) as ICreateRoomController
    const ctrlDelete = Container.get(config.controllers.deleteRoom.name) as IDeleteRoomController
    const ctrlList = Container.get(config.controllers.listAllRoomsInBuilding.name) as IListAllRoomsInBuildingController

    route.post('/createRoom', validateToken,
        celebrate({
            body: Joi.object({
                roomName: Joi.string().required().max(50),
                roomDescription: Joi.string().required().max(50),
                roomCategory: Joi.string().required().max(250),
                floorId: Joi.number().required()
            }),
        }),
        (req, res, next) => ctrlCreate.createRoom(req, res, next));

    route.delete('/delete/:roomName', validateToken, (req, res, next) => {ctrlDelete.deleteRoom(req, res, next);
        req.params.roomName;})

    route.get('/listAllInBuilding/:buildingCode', validateToken, (req, res, next) => {ctrlList.listAllRoomsInBuilding(req, res, next);
        req.params.buildingCode;})

}