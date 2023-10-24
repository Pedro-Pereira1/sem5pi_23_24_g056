import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const buildingSchema = {
    name: 'buildingSchema',
    schema: '../persistence/schemas/building/buildingSchema'
  }

  const floorSchema = {
    name: 'floorSchema',
    schema: '../persistence/schemas/floor/floorSchema'
  }

  const passagewaySchema = {
    name: 'passagewaySchema',
    schema: '../persistence/schemas/passageway/passagewaySchema'
  }

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const createBuildingController = {
    name: config.controllers.createbuilding.name,
    path: config.controllers.createbuilding.path
  }

  const createFloorController = {
    name: config.controllers.createFloor.name,
    path: config.controllers.createFloor.path
  }

  const createPassagewayController = {
    name: config.controllers.createPassageway.name,
    path: config.controllers.createPassageway.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const buildingRepo = {
    name: config.repos.building.name,
    path: config.repos.building.path
  }

  const floorRepo = {
    name: config.repos.floor.name,
    path: config.repos.floor.path
  }

  const passagewayRepo = {
    name: config.repos.passageway.name,
    path: config.repos.passageway.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const createBuildingService = {
    name: config.services.createBuilding.name,
    path: config.services.createBuilding.path
  }

  const createFloorService = {
    name: config.services.createFloor.name,
    path: config.services.createFloor.path
  }

  const createPassagewayService = {
    name: config.services.createPassageway.name,
    path: config.services.createPassageway.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      buildingSchema,
      floorSchema,
      passagewaySchema
    ],
    controllers: [
      roleController,
      createBuildingController,
      createFloorController,
      createPassagewayController
    ],
    repos: [
      roleRepo,
      userRepo,
      buildingRepo,
      floorRepo,
      passagewayRepo
    ],
    services: [
      roleService,
      createBuildingService,
      createFloorService,
      createPassagewayService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
