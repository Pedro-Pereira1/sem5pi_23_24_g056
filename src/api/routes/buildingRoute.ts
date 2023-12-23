import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import ICreateBuildingController from '../../controllers/IControllers/building/createBuilding/ICreateBuildingController';
import IListBuildingsMaxMinFloorsController from '../../controllers/IControllers/building/list/IListBuildingsMaxMinFloorsController';
import config from "../../../config";
import IListAllBuildingsController from '../../controllers/IControllers/building/list/IListAllBUildingsController';
import IEditBuildingontroller from '../../controllers/IControllers/building/edit/IEditBuildingController';
import IDeleteBuildingController from '../../controllers/IControllers/building/delete/IdeleteBuildingController';
var validateToken = require('../middlewares/validateToken');

const route = Router();

export default (app: Router) => {
  app.use('/buildings', validateToken, route)

  const ctrlCreate = Container.get(config.controllers.createbuilding.name) as ICreateBuildingController
  const ctrlListAllBuildings = Container.get(config.controllers.listAllBuildigns.name) as IListAllBuildingsController
  const ctrlEditBuilding = Container.get(config.controllers.editBuilding.name) as IEditBuildingontroller
  const ctrl1 = Container.get(config.controllers.listBuildingsMaxMinFloors.name) as IListBuildingsMaxMinFloorsController
  const ctrlDelete = Container.get(config.controllers.deleteBuilding.name) as IDeleteBuildingController

  route.delete('/deleteBuilding/:id', (req, res, next) => {
    ctrlDelete.deleteBuilding(req, res, next),
    req.params.id;
  });


  route.post('/createBuilding', validateToken,
    celebrate({
      body: Joi.object({
        buildingName: Joi.string().alphanum().max(50),
        buildingDescription: Joi.string().max(255),
        buildingCode: Joi.string().alphanum().max(5).required(),
        buildingLength: Joi.number().min(0),
        buildingWidth: Joi.number().min(0)
      }),
    }),
    (req, res, next) => ctrlCreate.createBuilding(req, res, next));


  route.get('/listAllBuildings', validateToken, (req, res, next) => {
    ctrlListAllBuildings.listAllBuildings(req, res, next)
  });

  route.get('/listBuildingsMaxMinFloors/:max/:min', validateToken,
    (req, res, next) =>  { ctrl1.listBuildingsMaxMinFloors(req, res, next);
      req.params.max;
      req.params.min;
    }
  );

  route.put('/editBuilding', validateToken,
    celebrate(
      {
        body: Joi.object({
          buildingName: Joi.string().alphanum().max(50),
          buildingDescription: Joi.string().max(255),
          buildingCode: Joi.string().alphanum().max(5).required(),
          buildingLength: Joi.number().min(0),
          buildingWidth: Joi.number().min(0)
        }),
      }),
    (req, res, next) => ctrlEditBuilding.editBuilding(req, res, next))

}
