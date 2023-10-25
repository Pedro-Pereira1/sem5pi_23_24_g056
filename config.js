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
  databaseURL: process.env.MONGODB_URI || "mongodb://vsgate-s1.dei.isep.ipp.pt:10746",

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
      name: "CreateBuildingController",
      path: "../controllers/building/create/createBuildingController"
    },
    createFloor: {
      name: "CreateBuildingController",
      path: "../controllers/floor/create/createFloorController"
    },
    createPassageway: {
      name: "CreatePassagewayController",
      path: "../controllers/passageway/create/createPassagewayController"
    }
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
      name: "BuildingRepo",
      path: "../repos/building/buildingRepo"
    },
    floor: {
      name: "FloorRepo",
      path: "../repos/floor/floorRepo"
    },
    passageway: {
      name: "PassagewayRepo",
      path: "../repos/passageway/passagewayRepo"
    },
    elevator: {
      name: "ElevatorRepo",
      path: "../repos/elevator/elevatorRepo"
    },
    room: {
      name: "RoomRepo",
      path: "../repos/room/roomRepo"
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
    createBuilding: {
      name: "CreateBuildingService",
      path: "../services/building/create/createBuildingService"
    },
    createFloor: {
      name: "CreateFloorService",
      path: "../services/floor/create/createFloorService"
    },
    createPassageway: {
      name: "CreatePassagewayService",
      path: "../services/passageway/create/createPassagewayService"
    }
  },
};
