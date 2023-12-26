import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import { IFloorDTO } from '../../../src/dto/floor/IFloorDTO';
import IEditFloorService from '../../../src/services/IServices/floor/edit/IEditFloorService';
import editFloorController from '../../../src/controllers/floor/edit/editFloorController';
import { IEditFloorDTO } from '../../../src/dto/floor/IEditFloorDTO';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { Floor } from '../../../src/domain/Floor/Floor';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';


describe('edit floors controller', function () {
	const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;


    beforeEach(function () {
        Container.reset();

        buildingRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
            findByBuidingCode: sinon.stub(),
            findByFloorId: sinon.stub(),
            findAll: sinon.stub()
        };
        Container.set("buildingRepo", buildingRepoMock);

        floorRepoMock = {
          exists: sinon.stub(),
          save: sinon.stub(),
          findById: sinon.stub(),
        };
        Container.set("floorRepo", floorRepoMock);

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let editFloorServiceClass = require('../../../src/services/floor/edit/editFloorService').default
        let editFloorServiceInstance = Container.get(editFloorServiceClass)
        Container.set('editFloorService', editFloorServiceInstance)
        
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('editFloorController unit test using editFloorService stub', async function () {
        // Arrange
        let body = {
            "floorId": 1,
            "floorNumber":  2,
            "floorDescription": "Joi.string().max(254)"
        };
        let req: Partial<Request> = {};
          req.body = body;
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const FloorDTO = {  
            floorId: 1,
            floorNumber: 2,
            floorDescription: "Joi.string().max(254)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }     
        } as IEditFloorDTO
        

        let editFloorServiceInstance = Container.get("editFloorService");
        sinon.stub(editFloorServiceInstance, "editFloor").returns(Result.ok<IEditFloorDTO>(FloorDTO));

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({  
            floorId: 1,
            floorNumber: 2,
            floorDescription: "Joi.string().max(254)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomCoords: []
            }     
            }));

    });

    it("editFloorController + editFloorService integration test (All values)", async function() {
        // Arrange
        let body = {
            "floorId": 1,
            "floorNumber":  2,
            "floorDescription": "Joi.string().max(254)"
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
                roomCoords: [],
			doorsCoords: [],
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
			doorsCoords: [],
				}
			  )
		}, FloorDTO.floorId).getValue()

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

          building.addFloor(floor)
          
        
        
        floorRepoMock.findById.resolves(floor);
        buildingRepoMock.findByFloorId.resolves(building);
        
        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            floorDescription: "Joi.string().max(254)",
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
            floorNumber: 2
          }));   
    }); 

    it("editFloorController + editFloorService integration test (Only Number)", async function() {
         // Arrange
         let body = {
            "floorId": 1,
            "floorNumber":  2
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
			doorsCoords: [],
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
			doorsCoords: [],
				  roomsCoords: [],
				}
			  )
		}, FloorDTO.floorId).getValue()

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

          building.addFloor(floor)
        
        
        floorRepoMock.findById.resolves(floor);
        buildingRepoMock.findByFloorId.resolves(building);
        
        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
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
            floorNumber: 2
          }));   
    });

    it("editFloorController + editFloorService integration test (Only Description)", async function() {
        // Arrange
        let body = {
            "floorId": 1,
            "floorDescription": "Joi.string().max(254)"
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
			doorsCoords: [],
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
			doorsCoords: [],
				  elevatorsCoords: [],
				  roomsCoords: [],
				}
			  )
		}, FloorDTO.floorId).getValue()

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

          building.addFloor(floor)
        
        
        floorRepoMock.findById.resolves(floor);
        buildingRepoMock.findByFloorId.resolves(building);
        
        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            floorDescription: "Joi.string().max(254)",
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
          }));   
    });
    
    it("editFloorController + editFloorService integration test (Nothing)", async function() {
        // Arrange
        let body = {
            "floorId": 1
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
        const FloorDTO = {  
            floorId: 1,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
                passageways: [],
                rooms: [],
                elevators: [],
			doorsCoords: [],
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
			doorsCoords: [],
				  elevatorsCoords: [],
				  roomsCoords: [],
				}
			  )
		}, FloorDTO.floorId).getValue()

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

          building.addFloor(floor)
        
        
        floorRepoMock.findById.resolves(floor);
        buildingRepoMock.findByFloorId.resolves(building);
        
        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
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
          }));   
    });

    it("editFloorController + editFloorService integration test (Invalid Floor)", async function() {
        // Arrange
        let body = {
            "floorId": 2,
            "floorNumber":  2,
            "floorDescription": "Joi.string().max(254)"
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
        const FloorDTO = {  
            floorId: 1,
            floorNumber: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                map: [],
			doorsCoords: [],
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
			doorsCoords: [],
				}
			  )
		}, FloorDTO.floorId).getValue()

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

          building.addFloor(floor)
        
        
        floorRepoMock.findById.resolves(null);
        buildingRepoMock.findByFloorId.resolves(building);
        
        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor dont exists on system!!"));  
    });

    /*
    it("editFloorController + editFloorService integration test (Invalid Floor)", async function() {
        // Arrange
        let body = {
            "floorId": 1,
            "floorNumber":  2,
            "floorDescription": "Joi.string().max(254)"
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
        const FloorDTO = {  
            floorId: 1,
            floorNumber: 2,
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

        building.addFloor(floor)
        building.floorsNumber.push(1)
        
        floorRepoMock.findById.resolves(floor);
        buildingRepoMock.findByFloorId.resolves(building);

        let editFloorServiceInstance = Container.get("editFloorService");
        const editFloorServiceSpy = sinon.spy(editFloorServiceInstance, "editFloor");

        const ctrl = new editFloorController(editFloorServiceInstance as IEditFloorService);

        // Act
        await ctrl.editFloor(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editFloorServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor number already exists"));  
    });
    */
	

});
