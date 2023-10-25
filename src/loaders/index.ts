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

  const roomSchema = {
    name: 'roomSchema',
    schema: '../persistence/schemas/room/roomSchema'
  }

  const elevatorSchema = {
    name: 'elevatorSchema',
    schema: '../persistence/schemas/elevator/elevatorSchema'
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

  const createElevatorController = {
    name: config.controllers.createElevator.name,
    path: config.controllers.createElevator.path
  }

  const listAllBuildingsController = {
    name: config.controllers.listAllBuildigns.name,
    path: config.controllers.listAllBuildigns.path
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

  const elevatorRepo = {
    name: config.repos.elevator.name,
    path: config.repos.elevator.path
  }

  const roomRepo = {
    name: config.repos.room.name,
    path: config.repos.room.path
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

  const createElevatorService = {
    name: config.services.createElevator.name,
    path: config.services.createElevator.path
  }

  const listAllBuildingsService = {
    name: config.services.listAllBuildigns.name,
    path: config.services.listAllBuildigns.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      buildingSchema,
      floorSchema,
      roomSchema,
      elevatorSchema,
      passagewaySchema
    ],
    controllers: [
      roleController,
      createBuildingController,
      createFloorController,
      createPassagewayController,
      createElevatorController,
      listAllBuildingsController
    ],
    repos: [
      roleRepo,
      userRepo,
      buildingRepo,
      floorRepo,
      passagewayRepo,
      elevatorRepo,
      roomRepo
    ],
    services: [
      roleService,
      createBuildingService,
      createFloorService,
      createPassagewayService,
      createElevatorService,
      listAllBuildingsService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
