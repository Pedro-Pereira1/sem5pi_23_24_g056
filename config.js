import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:4a5627f241f602c27f1b4f7d@vsgate-s1.dei.isep.ipp.pt:11098/?authMechanism=DEFAULT",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/users/roleController"
    },
    createbuilding: {
      name: "createBuildingController",
      path: "../controllers/building/create/createBuildingController"
    },
    createFloor: {
      name: "createFloorController",
      path: "../controllers/floor/create/createFloorController"
    },
    createPassageway: {
      name: "createPassagewayController",
      path: "../controllers/passageway/create/createPassagewayController"
    },
    createElevator: {
      name: "createElevatorController",
      path: "../controllers/elevator/create/createElevatorController"
    },
    createRoom: {
      name: "createRoomController",
      path: "../controllers/room/create/createRoomController"
    },
    deleteRoom: {
      name: "deleteRoomController",
      path: "../controllers/room/delete/deleteRoomController"
    },
    listAllBuildigns: {
      name: "listAllBuildingsController",
      path: "../controllers/building/list/listAllBuildingsController"
    },
    listBuildingsMaxMinFloors: {
      name: "listBuildingsMaxMinFloorsController",
      path: "../controllers/building/list/listBuildingsMaxMinFloorsController"
    },
    listAllFloors: {
      name: "listAllFloorsController",
      path: "../controllers/floor/list/listAllFloorsController"
    },
    listFloorsPassageways: {
      name: "listFloorsPassagewaysController",
      path: "../controllers/floor/list/listFloorsPassagewaysController"
    },
    listElevatorsInBuilding: {
      name: "listElevatorsInBuildingController",
      path: "../controllers/elevator/list/listElevatorsInBuildingController"
    },
    listPassagewaysBetween2Buildings: {
      name: "listPassagewaysBetween2BuildingsController",
      path: "../controllers/passageway/list/listPassagewaysBetween2BuildingsController"
    },
    listAllRoomsInBuilding: {
      name: "listAllRoomsInBuildingController",
      path: "../controllers/room/list/listAllRoomsInBuildingController"
    },
    editBuilding: {
      name: "editBuildingController",
      path: "../controllers/building/edit/EditBuildingController"
    },
    loadFloorMap: {
      name: "loadFloorMapController",
      path: "../controllers/floor/floorMap/LoadFloorMapController"
    },
    editFloor: {
      name: "editFloorController",
      path: "../controllers/floor/edit/editFloorController"
    },
    editElevator: {
      name: "editElevatorController",
      path: "../controllers/elevator/edit/editElevatorController"
    },
    editPassageway: {
      name: "editPassagewayController",
      path: "../controllers/passageway/edit/editPassagewayController"
    },
    createRobotType: {
      name: "createRobotTypeController",
      path: "../controllers/robotType/create/createRobotTypeController"
    },
    createRobot: {
      name: "createRobotController",
      path: "../controllers/robot/create/createRobotController"
    },
    inhibitRobot: {
      name: "inhibitRobotController",
      path: "../controllers/robot/inhibit/inhibitRobotController"
    },
    listAllRobots: {
      name: "listAllRobotsController",
      path: "../controllers/robot/list/listAllRobotsController"
    },
    listAllRobotsByAvailableTask: {
      name: "listAllRobotsByAvailableTaskController",
      path: "../controllers/robot/list/ListAllRobotsByAvailableTasksController"
    },
    listRobotsByDesignation: {
      name: "listRobotsByDesignationController",
      path: "../controllers/robot/list/ListRobotsByDesignationController"
    },
    deleteBuilding: {
      name: "deleteBuildingController",
      path: "../controllers/building/delete/deleteBuildingController"
    },
    robot: {
      name: "robotController",
      path: "../controllers/robot/robotController"
    },
    robotType: {
      name: "robotTypeController",
      path: "../controllers/robotType/robotTypeController"
    },
    deleteElevator: {
      name: "deleteElevatorController",
      path: "../controllers/elevator/delete/deleteElevatorController"
    },
    deleteFloor: {
      name: "deleteFloorController",
      path: "../controllers/floor/delete/DeleteFloorController"
    },
    deletePassageway: {
      name: "deletePassagewayController",
      path: "../controllers/passageway/delete/DeletePassagewayController"
    },
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    building: {
      name: "buildingRepo",
      path: "../repos/building/buildingRepo"
    },
    floor: {
      name: "floorRepo",
      path: "../repos/floor/floorRepo"
    },
    passageway: {
      name: "passagewayRepo",
      path: "../repos/passageway/passagewayRepo"
    },
    elevator: {
      name: "elevatorRepo",
      path: "../repos/elevator/elevatorRepo"
    },
    room: {
      name: "roomRepo",
      path: "../repos/room/roomRepo"
    },
    robotType: {
      name: "robotTypeRepo",
      path: "../repos/robotType/robotTypeRepo"
    },
    robot: {
      name: "robotRepo",
      path: "../repos/robot/robotRepo"
    },
  },

  services: {
    role: {
      name: "roleService",
      path: "../services/roleService"
    },
    createBuilding: {
      name: "createBuildingService",
      path: "../services/building/create/createBuildingService"
    },
    createFloor: {
      name: "createFloorService",
      path: "../services/floor/create/createFloorService"
    },
    createPassageway: {
      name: "createPassagewayService",
      path: "../services/passageway/create/createPassagewayService"
    },
    createRoom: {
      name: "createRoomService",
      path: "../services/room/create/createRoomService"
    },
    deleteRoom: {
      name: "deleteRoomService",
      path: "../services/room/delete/deleteRoomService"
    },
    createElevator: {
      name: "createElevatorService",
      path: "../services/elevator/create/createElevatorService"
    },
    listBuildingsMaxMinFloors: {
      name: "listBuildingsMaxMinFloorsService",
      path: "../services/building/list/listBuildingsMaxMinFloorsService"
    },
    listAllBuildigns: {
      name: "listAllBuildingsService",
      path: "../services/building/list/listAllBuildingsService"
    },
    listAllFloors: {
      name: "listAllFloors",
      path: "../services/floor/list/listAllFloorsService"
    },
    listFloorsPassageways: {
      name: "listFloorsPassagewaysService",
      path: "../services/floor/list/listFloorsPassagewaysService"
    },
    listElevatorsInBuilding: {
      name: "listElevatorsInBuildingService",
      path: "../services/elevator/list/listElevatorsInBuildingService"
    },
    listPassagewaysBetween2Buildings: {
      name: "listPassagewaysBetween2BuildingsService",
      path: "../services/passageway/list/listPassagewaysBetween2BuildingsService"
    },
    editBuilding: {
      name: "editBuildingService",
      path: "../services/building/edit/EditBuildingService"
    },
    loadFloorMap: {
      name: "loadFloorMapService",
      path: "../services/floor/floorMap/LoadFloorMapService"
    },
    editFloor: {
      name: "editFloorService",
      path: "../services/floor/edit/editFloorService"
    },
    editElevator: {
      name: "editElevatorService",
      path: "../services/elevator/edit/editElevatorService"
    },
    editPassageway: {
      name: "editPassagewayService",
      path: "../services/passageway/edit/editPassagewayService"
    },
    createRobotType: {
      name: "createRobotTypeService",
      path: "../services/robotType/create/createRobotTypeService"
    },
    createRobot: {
      name: "createRobotService",
      path: "../services/robot/create/createRobotService"
    },
    inhibitRobot: {
      name: "inhibitRobotService",
      path: "../services/robot/inhibit/inhibitRobotService"
    },
    listAllRobots: {
      name: "listAllRobotsService",
      path: "../services/robot/list/listAllRobotsService"
    },
    listAllRobotsByAvailableTask: {
      name: "listAllRobotsByAvailableTaskService",
      path: "../services/robot/list/ListAllRobotsByAvailableTasksService"
    },
    listRobotsByDesignation: {
      name: "listRobotsByDesignationService",
      path: "../services/robot/list/ListRobotsByDesignationService"
    },
    listAllRoomsInBuilding: {
      name: "listAllRoomsInBuildingService",
      path: "../services/room/list/listAllRoomsInBuildingService"
    },
    deleteBuilding: {
      name: "deleteBuildingService",
      path: "../services/building/delete/deleteBuildingService"
    },
    deleteRobot: {
      name: "deleteRobotService",
      path: "../services/robot/delete/deleteRobotService"
    },
    deleteRobotType: {
      name: "deleteRobotTypeService",
      path: "../services/robotType/delete/deleteRobotTypeService"
    },
    listAllRobotType: {
      name: "listAllRobotTypeService",
      path: "../services/robotType/list/listAllRobotTypeService"
    },
    deleteElevator: {
      name: "deleteElevatorService",
      path: "../services/elevator/delete/deleteElevatorService"
    },
    deleteFloor: {
      name: "deleteFloorService",
      path: "../services/floor/delete/DeleteFloorService"
    },
    deletePassageway: {
      name: "deletePassagewayService",
      path: "../services/passageway/delete/deletePassagewayService"
    },
  },
};
