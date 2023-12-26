import {Container} from "typedi";
import {NextFunction, Request, Response} from "express";
import {Result} from "../../../src/core/logic/Result";
import {Floor} from "../../../src/domain/Floor/Floor";
import FloorNumber from "../../../src/domain/Floor/FloorNumber";
import {FloorDescription} from "../../../src/domain/Floor/FloorDescription";
import {FloorMap} from "../../../src/domain/Floor/FloorMap";
import {IBuildingDTO} from "../../../src/dto/building/IBuildingDTO";
import {Building} from "../../../src/domain/Building/Building";
import {BuildingName} from "../../../src/domain/Building/BuildingName";
import {BuildingDescription} from "../../../src/domain/Building/BuildingDescription";
import {BuildingSize} from "../../../src/domain/Building/BuildingSize";
import * as sinon from 'sinon';
import IEditPassagewayDTO from "../../../src/dto/passageway/IEditPassagewayDTO";
import {IPassagewayDTO} from "../../../src/dto/passageway/IPassagewayDTO";
import IEditPassagewayService from "../../../src/services/IServices/passageway/edit/IEditPassagewayService";
import EditPassagewayController from "../../../src/controllers/passageway/edit/editPassagewayController";
import {Passageway} from "../../../src/domain/Passageway/Passageway";
import {ICreatePassagewayDTO} from "../../../src/dto/passageway/ICreatePassagewayDTO";

describe('edit Passageways', function () {
    const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;
    let passagewayRepoMock;


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
            findByPassageway: sinon.stub(),
        };
        Container.set("floorRepo", floorRepoMock);

        passagewayRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        }
        Container.set("passagewayRepo", passagewayRepoMock);

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let editPassagewayServiceClass = require('../../../src/services/passageway/edit/editPassagewayService').default
        let editPassagewayServiceInstance = Container.get(editPassagewayServiceClass)
        Container.set('editPassagewayService', editPassagewayServiceInstance)

    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('editPassagewayController unit test using editPassagewayService stub', async function () {
        // Arrange
        let body = {
            "passagewayId": 5,
            "floor1Id": 1,
            "floor2Id": 3,
        };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const PassagewayDTO = {
            passagewayId: 5,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 3,
        } as IEditPassagewayDTO


        let editPassagewayServiceInstance = Container.get("editPassagewayService");
        sinon.stub(editPassagewayServiceInstance, "editPassageway").returns(Result.ok <IPassagewayDTO>(PassagewayDTO));

        const ctrl = new EditPassagewayController(editPassagewayServiceInstance as IEditPassagewayService);

        // Act
        await ctrl.editPassageway(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            passagewayId: 5,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 3,
        }));

    });

    it("editPassagewayController + editPassagewayService integration test (All values)", async function() {
        // Arrange
        let body = {
            "passagewayId": 5,
            "floor1Id": 1,
            "floor2Id": 3,
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
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const passageway = Passageway.create(
            {
                passagewayId: createPassagewayDTO.passagewayId,
                building1Id: createPassagewayDTO.building1Id,
                floor1Id: createPassagewayDTO.floor1Id,
                building2Id: createPassagewayDTO.building2Id,
                floor2Id: createPassagewayDTO.floor2Id,
            }).getValue()

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


        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2 = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: [],
        }, building2DTO.buildingCode).getValue()


        const floorProps1 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor1Id = 1;
        const floor1 = Floor.create(floorProps1, floor1Id).getValue();

        const floorProps2 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor2Id = 2;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        const floorProps3 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 2 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor3Id = 3;
        const floor3 = Floor.create(floorProps3, floor3Id).getValue();

        building.addFloor(floor1)
        building2.addFloor(floor2)
        building2.addFloor(floor3)
        floor1.addPassageway(passageway)
        floor2.addPassageway(passageway)


        buildingRepoMock.findByFloorId.resolves(building);
        buildingRepoMock.findByFloorId.resolves(building2);
        floorRepoMock.findById.resolves(floor1);
        floorRepoMock.findById.resolves(floor2);
        floorRepoMock.findById.resolves(floor3);
        passagewayRepoMock.findById.resolves(passageway);
        floorRepoMock.findByPassageway.resolves([floor1, floor2]);

        let editPassagewayServiceInstance = Container.get("editPassagewayService");
        const editPassagewayServiceSpy = sinon.spy(editPassagewayServiceInstance, "editPassageway");

        const ctrl = new EditPassagewayController(editPassagewayServiceInstance as IEditPassagewayService);

        await ctrl.editPassageway(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(editPassagewayServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            passagewayId: 1
        }));
    });

    it("editPassagewayController + editPassagewayService integration test (Nothing)", async function() {
        // Arrange
        let body = {
            "passagewayId": 5,
            "floor1Id": 1,
            "floor2Id": 2,
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
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const passageway = Passageway.create(
            {
                passagewayId: createPassagewayDTO.passagewayId,
                building1Id: createPassagewayDTO.building1Id,
                floor1Id: createPassagewayDTO.floor1Id,
                building2Id: createPassagewayDTO.building2Id,
                floor2Id: createPassagewayDTO.floor2Id,
            }).getValue()

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


        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2 = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: [],
        }, building2DTO.buildingCode).getValue()


        const floorProps1 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor1Id = 1;
        const floor1 = Floor.create(floorProps1, floor1Id).getValue();

        const floorProps2 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor2Id = 2;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        const floorProps3 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 2 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor3Id = 3;
        const floor3 = Floor.create(floorProps3, floor3Id).getValue();

        building.addFloor(floor1)
        building2.addFloor(floor2)
        building2.addFloor(floor3)
        floor1.addPassageway(passageway)
        floor2.addPassageway(passageway)


        buildingRepoMock.findByFloorId.resolves(building);
        buildingRepoMock.findByFloorId.resolves(building2);
        floorRepoMock.findById.resolves(floor1);
        floorRepoMock.findById.resolves(floor2);
        floorRepoMock.findById.resolves(floor3);
        passagewayRepoMock.findById.resolves(passageway);
        floorRepoMock.findByPassageway.resolves([floor1, floor2]);

        let editPassagewayServiceInstance = Container.get("editPassagewayService");
        const editPassagewayServiceSpy = sinon.spy(editPassagewayServiceInstance, "editPassageway");

        const ctrl = new EditPassagewayController(editPassagewayServiceInstance as IEditPassagewayService);

        await ctrl.editPassageway(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(editPassagewayServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            passagewayId: 1
        }));
    });

    it("editFloorController + editFloorService integration test (Invalid Floor)", async function() {
        // Arrange
        let body = {
            "passagewayId": 5,
            "floor1Id": 1,
            "floor2Id": 5,
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
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const passageway = Passageway.create(
            {
                passagewayId: createPassagewayDTO.passagewayId,
                building1Id: createPassagewayDTO.building1Id,
                floor1Id: createPassagewayDTO.floor1Id,
                building2Id: createPassagewayDTO.building2Id,
                floor2Id: createPassagewayDTO.floor2Id,
            }).getValue()

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


        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2 = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: [],
        }, building2DTO.buildingCode).getValue()


        const floorProps1 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor1Id = 1;
        const floor1 = Floor.create(floorProps1, floor1Id).getValue();

        const floorProps2 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor2Id = 2;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        const floorProps3 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 2 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor3Id = 3;
        const floor3 = Floor.create(floorProps3, floor3Id).getValue();

        building.addFloor(floor1)
        building2.addFloor(floor2)
        building2.addFloor(floor3)
        floor1.addPassageway(passageway)
        floor2.addPassageway(passageway)


        buildingRepoMock.findByFloorId.resolves(building);
        buildingRepoMock.findByFloorId.resolves(building2);
        floorRepoMock.findById.resolves(floor1);
        floorRepoMock.findById.resolves(floor2);
        floorRepoMock.findById.resolves(null);
        passagewayRepoMock.findById.resolves(passageway);
        floorRepoMock.findByPassageway.resolves([floor1, floor2]);

        let editPassagewayServiceInstance = Container.get("editPassagewayService");
        const editPassagewayServiceSpy = sinon.spy(editPassagewayServiceInstance, "editPassageway");

        const ctrl = new EditPassagewayController(editPassagewayServiceInstance as IEditPassagewayService);

        await ctrl.editPassageway(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editPassagewayServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor does not exist!"));
    });

    it("editFloorController + editFloorService integration test (Invalid Passageway)", async function() {
        // Arrange
        let body = {
            "passagewayId": 5,
            "floor1Id": 1,
            "floor2Id": 5,
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


        const floorProps1 = {
            floorDescription: new FloorDescription({ value: 'Test floor' }),
            floorNumber: new FloorNumber({ number: 1 }),
            floormap: new FloorMap({
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: [],
                elevatorsCoords: [],
                roomsCoords: [],
                passagewaysCoords: [],
                doorsCoords: [],
            }),
        };
        const floor1Id = 1;
        const floor1 = Floor.create(floorProps1, floor1Id).getValue();

        building.addFloor(floor1)

        buildingRepoMock.findByFloorId.resolves(building);
        floorRepoMock.findById.resolves(floor1);
        passagewayRepoMock.findById.resolves(null);

        let editPassagewayServiceInstance = Container.get("editPassagewayService");
        const editPassagewayServiceSpy = sinon.spy(editPassagewayServiceInstance, "editPassageway");

        const ctrl = new EditPassagewayController(editPassagewayServiceInstance as IEditPassagewayService);

        await ctrl.editPassageway(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(editPassagewayServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Passageway does not exist!"));
    });
});