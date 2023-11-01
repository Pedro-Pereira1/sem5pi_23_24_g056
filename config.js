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
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:f47522692e278dc5a889a9c8@vsgate-s1.dei.isep.ipp.pt:10746/?authMechanism=DEFAULT",

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
    createRoom:{
      name:"createRoomController",
      path: "../controllers/room/create/createRoomController"
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
    editBuilding: {
      name: "editBuildingController",
      path: "../controllers/building/edit/EditBuildingController"
    },
    editFloor: {
      name: "editFloorController",
      path: "../controllers/floor/edit/editFloorController"
    },
    createRobotType: {
      name: "createRobotTypeController",
      path: "../controllers/robotType/create/createRobotTypeController"
    },
    createRobot: {
      name: "createRobotController",
      path: "../controllers/robot/create/createRobotController"
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
    editBuilding: {
      name: "editBuildingService",
      path: "../services/building/edit/EditBuildingService"
    },
    editFloor: {
      name: "editFloorService",
      path: "../services/floor/edit/editFloorService"
    },
    createRobotType: {
      name: "createRobotTypeService",
      path: "../services/robotType/create/createRobotTypeService"
    },
    createRobot: {
      name: "createRobotService",
      path: "../services/robot/create/createRobotService"
    },
  },
};
