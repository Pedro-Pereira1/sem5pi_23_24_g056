import {Container} from "typedi";
import assert from "assert";
import {NextFunction, Request, Response} from "express";
import {Result} from "../../src/core/logic/Result";
import {IBuildingDTO} from "../../src/dto/building/IBuildingDTO";
import {Building} from "../../src/domain/Building/Building";
import {BuildingName} from "../../src/domain/Building/BuildingName";
import {BuildingDescription} from "../../src/domain/Building/BuildingDescription";
import {BuildingSize} from "../../src/domain/Building/BuildingSize";
import {Floor} from "../../src/domain/Floor/Floor";
import FloorNumber from "../../src/domain/Floor/FloorNumber";
import {FloorDescription} from "../../src/domain/Floor/FloorDescription";
import {FloorMap} from "../../src/domain/Floor/FloorMap";
import * as sinon from 'sinon';
import IRoomDTO from "../../src/dto/room/IRoomDTO";
import {Room} from "../../src/domain/Room/Room";
import {RoomCategory} from "../../src/domain/Room/RoomCategory";
import {RoomDescription} from "../../src/domain/Room/RoomDescription";
import {RoomName} from "../../src/domain/Room/RoomName";
import ICreateRoomService from "../../src/services/IServices/room/ICreateRoomService";
import CreateRoomController from "../../src/controllers/room/create/createRoomController";

describe("Create room", function () {
    const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;
    let roomRepoMock;

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

        roomRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set("roomRepo", roomRepoMock);

        let buildingSchemaInstance = require('../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let floorSchemaInstance = require('../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let roomSchemaInstance = require('../../src/persistence/schemas/room/roomSchema').default
        Container.set('roomSchema', roomSchemaInstance)

        let createRoomServiceClass = require('../../src/services/room/create/createRoomService').default
        let createRoomServiceInstance = Container.get(createRoomServiceClass)
        Container.set('createRoomService', createRoomServiceInstance)


    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('Create room test, valid room', async function () {
        const roomDTO = {
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        } as IRoomDTO

        const elevator = Room.create({
            roomDescription: new RoomDescription({ value: roomDTO.roomDescription }),
            roomCategory: new RoomCategory({ value: roomDTO.roomCategory })
        }, new RoomName( roomDTO.roomName ))

        assert.equal(elevator.isSuccess, true)
    })

    it('Controller unit test with stub service, valid room', async function () {
        let body = {
            "roomName": "A101",
            "roomDescription": "This is a room",
            "roomCategory": "Other",
            "floorId": 1
        }

        let expected = {
            "roomName": "A101",
            "roomDescription": "This is a room",
            "roomCategory": "Other",
            "floorId": 1
        }

        let req: Partial<Request> = {}
        req.body = body

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createRoomService = Container.get('createRoomService')

        sinon.stub(createRoomService, 'createRoom').returns(Result.ok<IRoomDTO>({
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        } as IRoomDTO))

        const createRoomController = new CreateRoomController(createRoomService as ICreateRoomService)

        await createRoomController.createRoom(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.json)
        sinon.match(expected)
    })

    it("createRoomController +createRoomService integration test", async function() {
        let body = {
            "roomName": "A101",
            "roomDescription": "This is a room",
            "roomCategory": "Other",
            "floorId": 1
        }
        let req: Partial<Request> = {
            body: body
        };
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const roomDTO = {
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        } as IRoomDTO

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
                        doorsCoords: [],
                    }
                )
            }, 1 ).getValue();

        building.addFloor(floor)


        roomRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(floor);

        let createRoomServiceInstance = Container.get("createRoomService");
        const createRoomServiceSpy = sinon.spy(createRoomServiceInstance, "createRoom");

        const ctrl = new CreateRoomController(createRoomServiceInstance as ICreateRoomService);

        // Act
        await ctrl.createRoom(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRoomServiceSpy);
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        }));
    });

    it("createRoomController +createRoomService integration test (A Room with this Name already exists!)", async function() {
        let body = {
            "roomName": "A101",
            "roomDescription": "This is a room",
            "roomCategory": "Other",
            "floorId": 1
        }
        let req: Partial<Request> = {
            body: body
        };
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const roomDTO = {
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        } as IRoomDTO

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
                        doorsCoords: [],
                    }
                )
            }, 1 ).getValue();

        building.addFloor(floor)


        roomRepoMock.findById.resolves(Room.create({
            roomDescription: new RoomDescription({ value: "Description" }),
            roomCategory: new RoomCategory({ value: "Other" })
        }, new RoomName("A101")).getValue());
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(floor);

        let createRoomServiceInstance = Container.get("createRoomService");
        const createRoomServiceSpy = sinon.spy(createRoomServiceInstance, "createRoom");

        const ctrl = new CreateRoomController(createRoomServiceInstance as ICreateRoomService);

        // Act
        await ctrl.createRoom(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRoomServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match('A Room with this Name already exists!'));

    });


    it("createElevatorController +createElevatorService integration test (Floor does not exist!)", async function() {
        let body = {
            "roomName": "A101",
            "roomDescription": "This is a room",
            "roomCategory": "Other",
            "floorId": 1
        }
        let req: Partial<Request> = {
            body: body
        };
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const roomDTO = {
            roomName: "A101",
            roomDescription: "This is a room",
            roomCategory: "Other"
        } as IRoomDTO

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
                        doorsCoords: [],
                        roomsCoords: [],
                    }
                )
            }, 1 ).getValue();

        building.addFloor(floor)


        roomRepoMock.findById.resolves(null);
        buildingRepoMock.findByBuidingCode.resolves(building);
        floorRepoMock.findById.resolves(null);

        let createRoomServiceInstance = Container.get("createRoomService");
        const createRoomServiceSpy = sinon.spy(createRoomServiceInstance, "createRoom");

        const ctrl = new CreateRoomController(createRoomServiceInstance as ICreateRoomService);

        // Act
        await ctrl.createRoom(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRoomServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Floor does not exist!"));

    });

})