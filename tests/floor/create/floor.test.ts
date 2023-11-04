import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Floor } from '../../../src/domain/Floor/Floor';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import assert from 'assert';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { Room } from '../../../src/domain/Room/Room';
import { Passageway } from '../../../src/domain/Passageway/Passageway';
import { Result } from '../../../src/core/logic/Result';
import CreateFloorService from '../../../src/services/floor/create/createFloorService';
import createFloorController from '../../../src/controllers/floor/create/createFloorController';
import ICreateFloorService from '../../../src/services/IServices/floor/create/ICreateFloorService';
import { IFloorDTO } from '../../../src/dto/floor/IFloorDTO';
import  FloorRepo  from '../../../src/repos/floor/floorRepo';
import  BuildingRepo from '../../../src/repos/building/buildingRepo';
import CreateFloorController from '../../../src/controllers/floor/create/createFloorController';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import FloorID from '../../../src/domain/Floor/FloorId';


describe("Create floor", function () {
    const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;


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

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let createBuildingServiceClass = require('../../../src/services/building/create/createBuildingService').default
        let createBuildingServiceInstance = Container.get(createBuildingServiceClass)
        Container.set('createBuildingService', createBuildingServiceInstance)

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let createFloorServiceClass = require('../../../src/services/floor/create/createFloorService').default
        let createFloorServiceInstance = Container.get(createFloorServiceClass)
        Container.set('createFloorService', createFloorServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('should create a valid floor', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'Test floor' }),
          floorNumber: new FloorNumber({number: 1}),
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
            elevatorsCoords: [],
            roomsCoords: [],
            passagewaysCoords: [],
          }),
        };
        const floorId = 5;
        const result = Floor.create(floorProps, floorId);

        assert(result.isSuccess);
        assert(result.getValue().description.description === 'Test floor');
        assert(result.getValue().id.toValue() === 5);
        assert(result.getValue().map.props.map.length === 1);
        assert(result.getValue().map.props.passageways.length === 0);
        assert(result.getValue().map.props.rooms.length === 0);
        assert(result.getValue().map.props.elevators.length === 0);

      });

      it('should fail to create a floor with negative id', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'Test floor' }),
          floorNumber: new FloorNumber({number: 1}),
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
            elevatorsCoords: [],
            roomsCoords: [],
            passagewaysCoords: [],
          }),
        };
        const floorId = -1;
        const result = Floor.create(floorProps, floorId);

        assert(result.isFailure);
        assert(result.error === 'Invalid floor');
      });

      it('should fail to create a floor with description longer than 250 characters', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'a'.repeat(251) }),
          floorNumber: new FloorNumber({number: 1}),
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
            elevatorsCoords: [],
            roomsCoords: [],
            passagewaysCoords: [],
          }),
        };
        const floorId = 5;
        const result = Floor.create(floorProps, floorId);

        assert(result.isFailure);
        assert(result.error === 'Invalid floor');
      });

      it('createFloorController unit test using createFloorService stub', async function () {
        // Arrange
        let body = {
          "floorId": 1,
          "floorNumber":  1,
          "floorDescription": "Joi.string().max(255)",
          "buildingCode": "A"
        };
        let req: Partial<Request> = {};
          req.body = body;
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const buildingDTO = {
          buildingName: "EdificioA",
          buildingDescription: "uma descricao",
          buildingCode: "A",
          buildingLength: 2,
          buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
          buildingName: new BuildingName({ value: buildingDTO.buildingName }),
          buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
          buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
          floors: [],
        }, buildingDTO.buildingCode)

        buildingRepoMock.findByBuidingCode.resolves(building)

        let createFloorServiceInstance = Container.get("createFloorService");
        sinon.stub(createFloorServiceInstance, "createFloor").returns(Result.ok<IFloorDTO>(
          {
            "floorId": 1,
            "floorNumber": 1,
            "floorDescription": "Joi.string().max(255)",
            "floorMap": {
                "map": [],
                "passageways": [],
                "rooms": [],
                "elevators": [],
                "passagewaysCoords": [],
                "elevatorsCoords": [],
                "roomCoords": []
            }
        } ));

        const ctrl = new createFloorController(createFloorServiceInstance as ICreateFloorService);

        // Act
        await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
          "floorId": 1,
          "floorNumber": 1,
          "floorDescription": "Joi.string().max(255)",
          "floorMap": {
              "map": [],
              "passageways": [],
              "rooms": [],
              "elevators": [],
              "passagewaysCoords": [],
              "elevatorsCoords": [],
              "roomCoords": []
          }
      }));
      });

      it("BuildingController + BuildingService integration test", async function() {
        // Arrange
        let body = {
          "floorId": 1,
          "floorNumber":  1,
          "floorDescription": "Joi.string().max(255)",
          "buildingCode": "A"
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
        const buildingDTO = {
          buildingName: "EdificioA",
          buildingDescription: "uma descricao",
          buildingCode: "A",
          buildingLength: 2,
          buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
          buildingName: new BuildingName({ value: buildingDTO.buildingName }),
          buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
          buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
          floors: [],
        }, buildingDTO.buildingCode)

        buildingRepoMock.findByBuidingCode.resolves(building.getValue())

        floorRepoMock.findById.resolves(null);
        floorRepoMock.save.resolves(Floor.create(
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
              }
            )
        }, 1 ).getValue());


        let floorServiceInstance = Container.get("createFloorService");
        const floorServiceSpy = sinon.spy(floorServiceInstance, "createFloor");

        const ctrl = new CreateFloorController(floorServiceInstance as ICreateFloorService);

        // Act
        await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
          "floorId": 1,
          "floorNumber": 1,
          "floorDescription": "Joi.string().max(255)",
          "floorMap": {
              "map": [],
              "passageways": [],
              "rooms": [],
              "elevators": [],
              "passagewaysCoords": [],
              "elevatorsCoords": [],
              "roomCoords": []
          }
      }));
        sinon.assert.calledOnce(floorServiceSpy);

      }); 

      it("BuildingController + BuildingService integration test (Building Not Found)", async function() {
        // Arrange
        let body = {
          "floorId": 1,
          "floorNumber":  1,
          "floorDescription": "Joi.string().max(255)",
          "buildingCode": "A"
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
        buildingRepoMock.findByBuidingCode.resolves(null)
        floorRepoMock.findById.resolves(null);
        floorRepoMock.save.resolves(Floor.create(
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
              }
            )
        }, 1 ).getValue());


        let floorServiceInstance = Container.get("createFloorService");
        const floorServiceSpy = sinon.spy(floorServiceInstance, "createFloor");

        const ctrl = new CreateFloorController(floorServiceInstance as ICreateFloorService);

        // Act
        await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert

        sinon.assert.calledOnce(floorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building not found"));

      });

      it("BuildingController + BuildingService integration test (Floor Already exist)", async function() {
        // Arrange
        let body = {
          "floorId": 1,
          "floorNumber":  1,
          "floorDescription": "Joi.string().max(255)",
          "buildingCode": "A"
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
        const buildingDTO = {
          buildingName: "EdificioA",
          buildingDescription: "uma descricao",
          buildingCode: "A",
          buildingLength: 2,
          buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
          buildingName: new BuildingName({ value: buildingDTO.buildingName }),
          buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
          buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
          floors: [],
        }, buildingDTO.buildingCode)

        buildingRepoMock.findByBuidingCode.resolves(Result.ok<Building>(building.getValue()))

        floorRepoMock.findById.resolves(Floor.create(
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
              }
            )
        }, 1 ).getValue())


        let floorServiceInstance = Container.get("createFloorService");
        const floorServiceSpy = sinon.spy(floorServiceInstance, "createFloor");

        const ctrl = new CreateFloorController(floorServiceInstance as ICreateFloorService);

        // Act
        await ctrl.createFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor already exists"));

      });


});
