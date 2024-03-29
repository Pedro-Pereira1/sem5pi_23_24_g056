import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({expressApp}) => {
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

    const robotTypeSchema = {
        name: 'robotTypeSchema',
        schema: '../persistence/schemas/robotType/robotTypeSchema'
    }

    const robotSchema = {
        name: 'robotSchema',
        schema: '../persistence/schemas/robot/robotSchema'
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

    const createRoomController = {
        name: config.controllers.createRoom.name,
        path: config.controllers.createRoom.path
    }

    const deleteRoomController = {
        name: config.controllers.deleteRoom.name,
        path: config.controllers.deleteRoom.path
    }

    const listAllBuildingsController = {
        name: config.controllers.listAllBuildigns.name,
        path: config.controllers.listAllBuildigns.path
    }

    const listBuildingsMaxMinFloorsController = {
        name: config.controllers.listBuildingsMaxMinFloors.name,
        path: config.controllers.listBuildingsMaxMinFloors.path
    }

    const listElevatorsInBuildingController = {
        name: config.controllers.listElevatorsInBuilding.name,
        path: config.controllers.listElevatorsInBuilding.path
    }

    const editBuildingController = {
        name: config.controllers.editBuilding.name,
        path: config.controllers.editBuilding.path
    }

    const listAllFloorsController = {
        name: config.controllers.listAllFloors.name,
        path: config.controllers.listAllFloors.path
    }

    const listFloorsPassagewaysController = {
        name: config.controllers.listFloorsPassageways.name,
        path: config.controllers.listFloorsPassageways.path
    }

    const ListPassagewaysBetween2BuildingsController = {
        name: config.controllers.listPassagewaysBetween2Buildings.name,
        path: config.controllers.listPassagewaysBetween2Buildings.path
    }

    const listAllPassagewaysController = {
        name: config.controllers.listAllPassageways.name,
        path: config.controllers.listAllPassageways.path
    }

    const listAllRobotsController = {
        name: config.controllers.listAllRobots.name,
        path: config.controllers.listAllRobots.path
    }

    const listAllRoomsInBuildingController = {
        name: config.controllers.listAllRoomsInBuilding.name,
        path: config.controllers.listAllRoomsInBuilding.path
    }

    const listAllElevatorsController = {
        name: config.controllers.listAllElevators.name,
        path: config.controllers.listAllElevators.path
    }

    const editFloorController = {
        name: config.controllers.editFloor.name,
        path: config.controllers.editFloor.path
    }

    const editElevatorController = {
        name: config.controllers.editElevator.name,
        path: config.controllers.editElevator.path
    }

    const editPassagewayController = {
        name: config.controllers.editPassageway.name,
        path: config.controllers.editPassageway.path
    }

    const createRobotTypeController = {
        name: config.controllers.createRobotType.name,
        path: config.controllers.createRobotType.path
    }

    const createRobotController = {
        name: config.controllers.createRobot.name,
        path: config.controllers.createRobot.path
    }

    const loadFlorMapController = {
        name: config.controllers.loadFloorMap.name,
        path: config.controllers.loadFloorMap.path
    }

    const inhibitRobotController = {
        name: config.controllers.inhibitRobot.name,
        path: config.controllers.inhibitRobot.path
    }

    const deleteBuildingController = {
        name: config.controllers.deleteBuilding.name,
        path: config.controllers.deleteBuilding.path
    }

    const robotController = {
        name: config.controllers.robot.name,
        path: config.controllers.robot.path
    }

    const robotTypeController = {
        name: config.controllers.robotType.name,
        path: config.controllers.robotType.path
    }

    const deleteElevatorController = {
        name: config.controllers.deleteElevator.name,
        path: config.controllers.deleteElevator.path
    }

    const deleteFloorController = {
        name: config.controllers.deleteFloor.name,
        path: config.controllers.deleteFloor.path
    }

    const authController = {
        name: config.controllers.auth.name,
        path: config.controllers.auth.path
    }

    const deletePassagewayController = {
        name: config.controllers.deletePassageway.name,
        path: config.controllers.deletePassageway.path
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

    const robotTypeRepo = {
        name: config.repos.robotType.name,
        path: config.repos.robotType.path
    }

    const robotRepo = {
        name: config.repos.robot.name,
        path: config.repos.robot.path
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

    const createRoomService = {
        name: config.services.createRoom.name,
        path: config.services.createRoom.path
    }

    const deleteRoomService = {
        name: config.services.deleteRoom.name,
        path: config.services.deleteRoom.path
    }

    const listAllBuildingsService = {
        name: config.services.listAllBuildigns.name,
        path: config.services.listAllBuildigns.path
    }

    const listBuildingsMaxMinFloorsService = {
        name: config.services.listBuildingsMaxMinFloors.name,
        path: config.services.listBuildingsMaxMinFloors.path
    }

    const listElevatorsInBuildingService = {
        name: config.services.listElevatorsInBuilding.name,
        path: config.services.listElevatorsInBuilding.path
    }

    const listAllRoomsInBuildingService = {
        name: config.services.listAllRoomsInBuilding.name,
        path: config.services.listAllRoomsInBuilding.path
    }

    const editBuildingService = {
        name: config.services.editBuilding.name,
        path: config.services.editBuilding.path
    }

    const listAllFloorsService = {
        name: config.services.listAllFloors.name,
        path: config.services.listAllFloors.path
    }

    const listFloorsPassagewaysService = {
        name: config.services.listFloorsPassageways.name,
        path: config.services.listFloorsPassageways.path
    }

    const listPassagewaysBetween2BuildingsService = {
        name: config.services.listPassagewaysBetween2Buildings.name,
        path: config.services.listPassagewaysBetween2Buildings.path
    }

    const listAllPassagewaysService = {
        name: config.services.listAllPassageways.name,
        path: config.services.listAllPassageways.path
    }

    const listAllRobotsService = {
        name: config.services.listAllRobots.name,
        path: config.services.listAllRobots.path
    }

    const listAllElevatorsService = {
        name: config.services.listAllElevators.name,
        path: config.services.listAllElevators.path
    }

    const editFloorService = {
        name: config.services.editFloor.name,
        path: config.services.editFloor.path
    }

    const editElevatorService = {
        name: config.services.editElevator.name,
        path: config.services.editElevator.path
    }

    const editPassagewayService = {
        name: config.services.editPassageway.name,
        path: config.services.editPassageway.path
    }

    const createRobotTypeService = {
        name: config.services.createRobotType.name,
        path: config.services.createRobotType.path
    }

    const createRobotService = {
        name: config.services.createRobot.name,
        path: config.services.createRobot.path
    }


    const loadFlorMapService = {
        name: config.services.loadFloorMap.name,
        path: config.services.loadFloorMap.path
    }

    const inhibitRobotService = {
        name: config.services.inhibitRobot.name,
        path: config.services.inhibitRobot.path
    }

    const listAllRobotsByAvailableTask = {
        name: config.services.listAllRobotsByAvailableTask.name,
        path: config.services.listAllRobotsByAvailableTask.path
    }

    const listAllRobotsByDesignation = {
        name: config.services.listRobotsByDesignation.name,
        path: config.services.listRobotsByDesignation.path
    }

    const deleteBuildingService = {
        name: config.services.deleteBuilding.name,
        path: config.services.deleteBuilding.path
    }

    const deleteRobotService = {
        name: config.services.deleteRobot.name,
        path: config.services.deleteRobot.path
    }

    const deleteRobotTypeService = {
        name: config.services.deleteRobotType.name,
        path: config.services.deleteRobotType.path
    }

    const listAllRobotTypeService = {
        name: config.services.listAllRobotType.name,
        path: config.services.listAllRobotType.path
    }

    const deleteElevatorService = {
        name: config.services.deleteElevator.name,
        path: config.services.deleteElevator.path
    }

    const deleteFloorService = {
        name: config.services.deleteFloor.name,
        path: config.services.deleteFloor.path
    }

    const deletePassagewayService = {
        name: config.services.deletePassageway.name,
        path: config.services.deletePassageway.path
    }

    const authService = {
        name: config.services.auth.name,
        path: config.services.auth.path
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
            passagewaySchema,
            robotTypeSchema,
            robotSchema
        ],
        controllers: [
            roleController,
            createBuildingController,
            createFloorController,
            createPassagewayController,
            createElevatorController,
            createRoomController,
            listAllBuildingsController,
            listBuildingsMaxMinFloorsController,
            editBuildingController,
            listAllFloorsController,
            listFloorsPassagewaysController,
            listElevatorsInBuildingController,
            editFloorController,
            editElevatorController,
            editPassagewayController,
            createRobotTypeController,
            createRobotController,
            loadFlorMapController,
            listAllRobotsController,
            inhibitRobotController,
            ListPassagewaysBetween2BuildingsController,
            deleteRoomController,
            deleteBuildingController,
            robotController,
            robotTypeController,
            ListPassagewaysBetween2BuildingsController,
            listAllPassagewaysController,
            deleteElevatorController,
            listAllRoomsInBuildingController,
            listAllElevatorsController,
            deleteFloorController,
            deletePassagewayController,
            authController
        ],
        repos: [
            roleRepo,
            userRepo,
            buildingRepo,
            floorRepo,
            passagewayRepo,
            elevatorRepo,
            roomRepo,
            robotTypeRepo,
            robotRepo
        ],
        services: [
            roleService,
            createBuildingService,
            createFloorService,
            createPassagewayService,
            createElevatorService,
            createRoomService,
            listBuildingsMaxMinFloorsService,
            listAllBuildingsService,
            editBuildingService,
            listAllFloorsService,
            listFloorsPassagewaysService,
            listElevatorsInBuildingService,
            editFloorService,
            editElevatorService,
            editPassagewayService,
            createRobotTypeService,
            createRobotService,
            loadFlorMapService,
            listAllRobotsService,
            inhibitRobotService,
            listPassagewaysBetween2BuildingsService,
            listAllPassagewaysService,
            deleteRoomService,
            deleteElevatorService,
            listPassagewaysBetween2BuildingsService,
            deleteBuildingService,
            deleteRobotTypeService,
            listAllRobotTypeService,
            deleteRobotService,
            listAllRoomsInBuildingService,
            listAllElevatorsService,
            deleteFloorService,
            deletePassagewayService,
            authService
        ]
    });
    Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

    await expressLoader({app: expressApp});
    Logger.info('✌️ Express loaded');
};
