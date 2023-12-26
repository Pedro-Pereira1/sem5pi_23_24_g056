import * as sinon from 'sinon';

import IElevatorDTO from '../../src/dto/elevator/IElevatorDTO';
import { Elevator } from '../../src/domain/Elevator/Elevator';
import assert from 'assert';
import { ElevatorIdentificationNumber } from '../../src/domain/Elevator/ElevatorIdentificationNumber';
import { ElevatorBrand } from '../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../src/domain/Elevator/ElevatorModel';
import { ElevatorSerialNumber } from '../../src/domain/Elevator/ElevatorSerialNumber';
import {ElevatorID} from "../../src/domain/Elevator/ElevatorID";
import {NextFunction, Request, Response} from "express";
import { Container } from 'typedi';
import {Result} from "../../src/core/logic/Result";
import ICreateElevatorService from "../../src/services/IServices/elevator/ICreateElevatorService";
import CreateElevatorController from "../../src/controllers/elevator/create/createElevatorController";
import {Building} from "../../src/domain/Building/Building";
import IBuildingRepo from "../../src/services/IRepos/building/IBuildingRepo";
import CreateElevatorService from "../../src/services/elevator/create/createElevatorService";
import ICreateElevatorDTO from "../../src/dto/elevator/ICreateElevatorDTO";
import IElevatorRepo from "../../src/services/IRepos/elevator/IElevatorRepo";
import {Floor} from "../../src/domain/Floor/Floor";
import IFloorRepo from "../../src/services/IRepos/floor/IFloorRepo";
import {IBuildingDTO} from "../../src/dto/building/IBuildingDTO";
import {BuildingName} from "../../src/domain/Building/BuildingName";
import {BuildingDescription} from "../../src/domain/Building/BuildingDescription";
import {BuildingSize} from "../../src/domain/Building/BuildingSize";
import {ICreateFloorDTO} from "../../src/dto/floor/ICreateFloorDTO";
import FloorNumber from "../../src/domain/Floor/FloorNumber";
import {FloorDescription} from "../../src/domain/Floor/FloorDescription";
import BuildingCode from "../../src/domain/Building/BuildingCode";
import {IFloorDTO} from "../../src/dto/floor/IFloorDTO";
import {FloorMap} from "../../src/domain/Floor/FloorMap";

describe("Create elevator", function () {
    const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;
    let elevatorRepoMock;

    beforeEach(function () {
        Container.reset();

        buildingRepoMock = {
            findByBuidingCode: sinon.stub(),
            findAll: sinon.stub(),
            save: sinon.stub(),
            exists: sinon.stub(),
            findBuildingsMaxMinFloors: sinon.stub(),
        };

        Container.set("buildingRepo", buildingRepoMock);

        floorRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set("floorRepo", floorRepoMock);

        elevatorRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set("elevatorRepo", elevatorRepoMock);

        let buildingSchemaInstance = require('../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let floorSchemaInstance = require('../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let elevatorSchemaInstance = require('../../src/persistence/schemas/elevator/elevatorSchema').default
        Container.set('elevatorSchema', elevatorSchemaInstance)

        let createElevatorServiceClass = require('../../src/services/elevator/create/createElevatorService').default
        let createElevatorServiceInstance = Container.get(createElevatorServiceClass)
        Container.set('createElevatorService', createElevatorServiceInstance)


    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('Create elevator test, valid elevator', async function () {
        const elevatorDto = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const elevator = Elevator.create({
            elevatorIdentificationNumber: new ElevatorIdentificationNumber({ identificationNumber: elevatorDto.elevatorIdentificationNumber }),
            elevatorBrand: new ElevatorBrand({ brand: elevatorDto.elevatorBrand }),
            elevatorDescription: new ElevatorDescription({ description: elevatorDto.elevatorDescription }),
            elevatorModel: new ElevatorModel({ model: elevatorDto.elevatorModel }),
            elevatorSerialNumber: new ElevatorSerialNumber({ serialNumber: elevatorDto.elevatorSerialNumber })
        }, new ElevatorID(elevatorDto.elevatorId))

        assert.equal(elevator.isSuccess, true)
    })

    it('Controller unit test with stub service, valid elevator', async function () {
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445'
        }

        let expected = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445'
        }

        let req: Partial<Request> = {}
        req.body = body

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createElevatorService = Container.get('createElevatorService')

        sinon.stub(createElevatorService, 'createElevator').returns(Result.ok<IElevatorDTO>({
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO))

        const createElevatorController = new CreateElevatorController(createElevatorService as ICreateElevatorService)

        await createElevatorController.createElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.json)
        sinon.match(expected)
    })

    it("createElevatorController +createElevatorService integration test", async function() {
        // Arrange
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445',
            "buildingCode": "A",
            "floorIds": [1]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const elevatorDTO = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const buildingDTO = {
            buildingCode: "bgdA1",
            buildingName: "buildingTest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const floor = Floor.create(
            {
              "floorNumber": new FloorNumber({number: 1}),
              "floorDescription": new FloorDescription({ value: 'Test floor' }),
              "floormap": new FloorMap(
                {
                  map: [[]],
                  passageways: [],
                  rooms: [],
                  elevators: [],
                  passagewaysCoords: [],
                  elevatorsCoords: [],
                  roomsCoords: [],
			doorsCoords: []
                }
              )
          }, 1 ).getValue();

        building.addFloor(floor)


        elevatorRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(floor);

        let createElevatorServiceInstance = Container.get("createElevatorService");
        const createElevatorServiceSpy = sinon.spy(createElevatorServiceInstance, "createElevator");

        const ctrl = new CreateElevatorController(createElevatorServiceInstance as ICreateElevatorService);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createElevatorServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            elevatorBrand: "Apple",
            elevatorDescription: "This is an elevator",
            elevatorId: 20,
            elevatorIdentificationNumber: 1,
            elevatorModel: "Ieli",
            elevatorSerialNumber: "445"
          }));
    });

    it("createElevatorController +createElevatorService integration test (An Elevator with this Id already exists!)", async function() {
        // Arrange
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445',
            "buildingCode": "A",
            "floorIds": [1]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const elevatorDTO = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const buildingDTO = {
            buildingCode: "bgdA1",
            buildingName: "buildingTest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const floor = Floor.create(
            {
              "floorNumber": new FloorNumber({number: 1}),
              "floorDescription": new FloorDescription({ value: 'Test floor' }),
              "floormap": new FloorMap(
                {
                  map: [[]],
                  passageways: [],
                  rooms: [],
                  elevators: [],
                  passagewaysCoords: [],
                  elevatorsCoords: [],
                  roomsCoords: [],
			doorsCoords: []
                }
              )
          }, 1 ).getValue();

        building.addFloor(floor)


        elevatorRepoMock.findById.resolves(Elevator.create({
            elevatorIdentificationNumber: new ElevatorIdentificationNumber({ identificationNumber: 1 }),
            elevatorBrand: new ElevatorBrand({ brand: 'Apple' }),
            elevatorDescription: new ElevatorDescription({ description: 'This is an elevator' }),
            elevatorModel: new ElevatorModel({ model: 'Ieli' }),
            elevatorSerialNumber: new ElevatorSerialNumber({ serialNumber: '445' })
            }, new ElevatorID(20)).getValue());
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(floor);

        let createElevatorServiceInstance = Container.get("createElevatorService");
        const createElevatorServiceSpy = sinon.spy(createElevatorServiceInstance, "createElevator");

        const ctrl = new CreateElevatorController(createElevatorServiceInstance as ICreateElevatorService);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createElevatorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("An Elevator with this Id already exists!"));

    });

    it("createElevatorController +createElevatorService integration test (Building does not exist!)", async function() {
        // Arrange
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445',
            "buildingCode": "A",
            "floorIds": [1]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const elevatorDTO = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const buildingDTO = {
            buildingCode: "bgdA1",
            buildingName: "buildingTest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const floor = Floor.create(
            {
              "floorNumber": new FloorNumber({number: 1}),
              "floorDescription": new FloorDescription({ value: 'Test floor' }),
              "floormap": new FloorMap(
                {
                  map: [[]],
                  passageways: [],
                  rooms: [],
                  elevators: [],
                  passagewaysCoords: [],
                  elevatorsCoords: [],
                  roomsCoords: [],
			doorsCoords: []
                }
              )
          }, 1 ).getValue();

        building.addFloor(floor)


        elevatorRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(null);
        floorRepoMock.findById.resolves(floor);

        let createElevatorServiceInstance = Container.get("createElevatorService");
        const createElevatorServiceSpy = sinon.spy(createElevatorServiceInstance, "createElevator");

        const ctrl = new CreateElevatorController(createElevatorServiceInstance as ICreateElevatorService);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createElevatorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building does not exist!"));

    });

    it("createElevatorController +createElevatorService integration test (Floor does not exist!)", async function() {
        // Arrange
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445',
            "buildingCode": "A",
            "floorIds": [1]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const elevatorDTO = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const buildingDTO = {
            buildingCode: "bgdA1",
            buildingName: "buildingTest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const floor = Floor.create(
            {
              "floorNumber": new FloorNumber({number: 1}),
              "floorDescription": new FloorDescription({ value: 'Test floor' }),
              "floormap": new FloorMap(
                {
                  map: [[]],
                  passageways: [],
                  rooms: [],
                  elevators: [],
                  passagewaysCoords: [],
                  elevatorsCoords: [],
                  roomsCoords: [],
			doorsCoords: []
                }
              )
          }, 1 ).getValue();

        building.addFloor(floor)


        elevatorRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(null);

        let createElevatorServiceInstance = Container.get("createElevatorService");
        const createElevatorServiceSpy = sinon.spy(createElevatorServiceInstance, "createElevator");

        const ctrl = new CreateElevatorController(createElevatorServiceInstance as ICreateElevatorService);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createElevatorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor does not exist!"));

    });

    it("createElevatorController +createElevatorService integration test ('Brand was provided so Model is also required!')", async function() {
        // Arrange
        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorSerialNumber": '445',
            "buildingCode": "A",
            "floorIds": [1]
        };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        const elevatorDTO = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorIdentificationNumber: 35,
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as IElevatorDTO

        const buildingDTO = {
            buildingCode: "bgdA1",
            buildingName: "buildingTest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode).getValue()

        const floor = Floor.create(
            {
              "floorNumber": new FloorNumber({number: 1}),
              "floorDescription": new FloorDescription({ value: 'Test floor' }),
              "floormap": new FloorMap(
                {
                  map: [[]],
                  passageways: [],
                  rooms: [],
                  elevators: [],
                  passagewaysCoords: [],
                  elevatorsCoords: [],
                  roomsCoords: [],
			doorsCoords: []
                }
              )
          }, 1 ).getValue();

        building.addFloor(floor)


        elevatorRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(floor);

        let createElevatorServiceInstance = Container.get("createElevatorService");
        const createElevatorServiceSpy = sinon.spy(createElevatorServiceInstance, "createElevator");

        const ctrl = new CreateElevatorController(createElevatorServiceInstance as ICreateElevatorService);

        // Act
        await ctrl.createElevator(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createElevatorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Brand was provided so Model is also required!"));

    });
})
