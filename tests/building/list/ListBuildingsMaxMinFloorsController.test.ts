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
import ListBuildingsMaxMinFloorsController from '../../../src/controllers/building/list/listBuildingsMaxMinFloorsController';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';



describe('list buildings max min floors controller', function () {
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
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

	it("BuildingController unit test using BuildingService stub", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
  
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
		  }, 1 ).getValue()

		  building.addFloor(floor);
			
		
		sinon.stub(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors").returns(Result.ok<IBuildingDTO[]>([buildingDTO]));

  
		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);
  
		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match([buildingDTO]));
	});
  
	  it("BuildingController + BuildingService integration test", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
  
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
		  	}, 1 ).getValue()

		building.addFloor(floor);	

		buildingRepoMock.findBuildingsMaxMinFloors.resolves([building]);

		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");
  
		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);
  
		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json,sinon.match([{
			buildingCode: "A",
			buildingDescription: "uma descricao",
			buildingFloors: [1],
			buildingLength: 2,
			buildingName: "EdificioA",
			buildingWidth: 2
		  }]));
		sinon.assert.calledOnce(listBuildingsMaxMinFloorsServiceSpy);
	  });

	  it("BuildingController + BuildingService integration test (Test 500 Internal server Error)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
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
		  }, 1 ).getValue()

		  building.addFloor(floor);

		buildingRepoMock.findBuildingsMaxMinFloors.resolves(building);
		
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");
  
		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);
  
		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json,sinon.match({ error: "Internal Server Error" }));
		sinon.assert.calledOnce(res.status);
		sinon.assert.calledWith(res.status,500);
	  });

	  it("BuildingController + BuildingService integration test (No buildings found)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "1"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		buildingRepoMock.findBuildingsMaxMinFloors.resolves([]);
		
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");
  
		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);
  
		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("No buildings found"));
	  });

	  it("BuildingController + BuildingService integration test (max < min)", async function() {
		// Arrange
		let body = {};
		let req: Partial<Request> = {};
		req.body = body;
		req.params = {
			max: "3",
			min: "5"
		  }
		let res: Partial<Response> = {
		  json: sinon.spy(),
		  status: sinon.stub().returnsThis(),
		  send: sinon.spy()
		};
		let next: Partial<NextFunction> = () => {};
  
		// Stub repo methods
		buildingRepoMock.findBuildingsMaxMinFloors.resolves([]);
		
		let listBuildingsMaxMinFloorsServiceInstance = Container.get("listBuildingsMaxMinFloorsService");
		const listBuildingsMaxMinFloorsServiceSpy = sinon.spy(listBuildingsMaxMinFloorsServiceInstance, "listBuildingsMaxMinFloors");
  
		const ctrl = new ListBuildingsMaxMinFloorsController(listBuildingsMaxMinFloorsServiceInstance as IListBuildingsMaxMinFloorsService);
  
		// Act
		await ctrl.listBuildingsMaxMinFloors(<Request>req, <Response>res, <NextFunction>next);
  
		// Assert
		sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("max < min"));
	  });
});
