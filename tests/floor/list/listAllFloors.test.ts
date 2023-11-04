import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import IListBuildingsMaxMinFloorsService from "../../../src/services/IServices/building/IListBuildingsMaxMinFloorsService";
import listBuildingsMaxMinFloorsController from "../../../src/controllers/building/list/listBuildingsMaxMinFloorsController";
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { Floor } from '../../../src/domain/Floor/Floor';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { Room } from '../../../src/domain/Room/Room';
import { Passageway } from '../../../src/domain/Passageway/Passageway';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import ListAllFloorController from '../../../src/controllers/floor/list/listAllFloorsController';
import ListAllFloorsController from '../../../src/controllers/floor/list/listAllFloorsController';
import IListAllFloorsService from '../../../src/services/IServices/floor/list/IListAllFloorsService';
import { IFloorDTO } from '../../../src/dto/floor/IFloorDTO';


describe.only('list buildings max min floors controller', function () {
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

		let listBuildingsWithMinAndMaxFloorsServiceClass = require('../../../src/services/building/list/listBuildingsMaxMinFloorsService').default
		let listBuildingsWithMinAndMaxFloorsServiceInstance = Container.get(listBuildingsWithMinAndMaxFloorsServiceClass)
		Container.set('listBuildingsMaxMinFloorsService', listBuildingsWithMinAndMaxFloorsServiceInstance)
    
        let listAllFloorsServiceClass = require('../../../src/services/floor/list/listAllFloorsService').default
        let listAllFloorsServiceInstance = Container.get(listAllFloorsServiceClass)
        Container.set('listAllFloorsService', listAllFloorsServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

	it("ListAllFloorsController unit test using ListAllFloorsService stub", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
            buildingId: "A"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		let listAllFloorsServiceInstance = Container.get("listAllFloorsService");
  
		// Stub the createBuilding method in the BuildingService
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
		  }, buildingDTO.buildingCode).getValue()

          const FloorDTO = {  
          floorId: 1,
          floorNumber: 1,
          floorDescription: "Joi.string().max(255)",
          floorMap: {
              map: [],
              passageways: [],
              rooms: [],
              elevators: [],
              passagewaysCoords: [],
              elevatorsCoords: [],
              roomCoords: []
          }     
          } as IFloorDTO

		  const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: FloorDTO.floorNumber}),
			  "floorDescription": new FloorDescription({ value: FloorDTO.floorDescription }),
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
		  }, FloorDTO.floorId).getValue()

		  building.addFloor(floor);
			
		
		sinon.stub(listAllFloorsServiceInstance, "listAllFloors").returns(
            Result.ok<IFloorDTO[]>([FloorDTO])
        );

  
		const ctrl = new ListAllFloorsController(listAllFloorsServiceInstance as IListAllFloorsService);
  
		// Act
		await ctrl.listAllFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match([FloorDTO]));
	});
  
	it("ListAllFloorsController + ListAllFloorsService integration test", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
            buildingId: "A"
		}
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		let listAllFloorsServiceInstance = Container.get("listAllFloorsService");
  
		// Stub the createBuilding method in the BuildingService
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
		  }, buildingDTO.buildingCode).getValue()

          const FloorDTO = {  
          floorId: 1,
          floorNumber: 1,
          floorDescription: "Joi.string().max(255)",
          floorMap: {
              map: [],
              passageways: [],
              rooms: [],
              elevators: [],
              passagewaysCoords: [],
              elevatorsCoords: [],
              roomCoords: []
          }     
          } as IFloorDTO

		  const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: FloorDTO.floorNumber}),
			  "floorDescription": new FloorDescription({ value: FloorDTO.floorDescription }),
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
		}, FloorDTO.floorId).getValue()

		building.addFloor(floor);	

        buildingRepoMock.findByBuidingCode.resolves(building);
		
		const listAllFloorsServiceSpy = sinon.spy(listAllFloorsServiceInstance, "listAllFloors");
  
		const ctrl = new ListAllFloorController(listAllFloorsServiceInstance as IListAllFloorsService);
  
		// Act
		await ctrl.listAllFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json,sinon.match([{
            floorDescription: "Joi.string().max(255)",
            floorId: 1,
            floorMap: {
              elevators: [],
              elevatorsCoords: [],
              map: [[]],
              passageways: [],
              passagewaysCoords: [],
              roomCoords: [],
              rooms: []
            },
            floorNumber: 1
          }]));
		sinon.assert.calledOnce(listAllFloorsServiceSpy);
	});

    it("ListAllFloorsController + ListAllFloorsService integration test (Building Not Found)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
            buildingId: "C"
		}
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		let listAllFloorsServiceInstance = Container.get("listAllFloorsService");
  
		// Stub the createBuilding method in the BuildingService
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
		  }, buildingDTO.buildingCode).getValue()

          const FloorDTO = {  
          floorId: 1,
          floorNumber: 1,
          floorDescription: "Joi.string().max(255)",
          floorMap: {
              map: [],
              passageways: [],
              rooms: [],
              elevators: [],
              passagewaysCoords: [],
              elevatorsCoords: [],
              roomCoords: []
          }     
          } as IFloorDTO

		  const floor = Floor.create(
			{
			  "floorNumber": new FloorNumber({number: FloorDTO.floorNumber}),
			  "floorDescription": new FloorDescription({ value: FloorDTO.floorDescription }),
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
		}, FloorDTO.floorId).getValue()

		building.addFloor(floor);	

        buildingRepoMock.findByBuidingCode.resolves(null);
		
		const listAllFloorsServiceSpy = sinon.spy(listAllFloorsServiceInstance, "listAllFloors");
  
		const ctrl = new ListAllFloorController(listAllFloorsServiceInstance as IListAllFloorsService);
  
		// Act
		await ctrl.listAllFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		
		sinon.assert.calledOnce(listAllFloorsServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building C not found"));
	});

    it("ListAllFloorsController + ListAllFloorsService integration test (Building No Floors)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
            buildingId: "C"
		}
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		let listAllFloorsServiceInstance = Container.get("listAllFloorsService");
  
		// Stub the createBuilding method in the BuildingService
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
		  }, buildingDTO.buildingCode).getValue()

          const FloorDTO = {  
          floorId: 1,
          floorNumber: 1,
          floorDescription: "Joi.string().max(255)",
          floorMap: {
              map: [],
              passageways: [],
              rooms: [],
              elevators: [],
              passagewaysCoords: [],
              elevatorsCoords: [],
              roomCoords: []
          }     
          } as IFloorDTO	

        buildingRepoMock.findByBuidingCode.resolves(building);
		
		const listAllFloorsServiceSpy = sinon.spy(listAllFloorsServiceInstance, "listAllFloors");
  
		const ctrl = new ListAllFloorController(listAllFloorsServiceInstance as IListAllFloorsService);
  
		// Act
		await ctrl.listAllFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		
		sinon.assert.calledOnce(listAllFloorsServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building C has no floors"));
	});

});
