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
    schema: '../persistence/schema/building/buildingSchema'
  }

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const createBuildingController = {
    name: config.controllers.createbuilding.name,
    path: config.controllers.createbuilding.path
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

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const createBuildingService = {
    name: config.services.createbuilding.name,
    path: config.services.createbuilding.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      buildingSchema
    ],
    controllers: [
      roleController,
      createBuildingController
    ],
    repos: [
      roleRepo,
      userRepo,
      buildingRepo
    ],
    services: [
      roleService,
      createBuildingService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
