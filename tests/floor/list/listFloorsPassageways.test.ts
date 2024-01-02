import {Container} from "typedi";
import {NextFunction, Request, Response} from "express";
import {IBuildingDTO} from "../../../src/dto/building/IBuildingDTO";
import {Building} from "../../../src/domain/Building/Building";
import {BuildingName} from "../../../src/domain/Building/BuildingName";
import {BuildingDescription} from "../../../src/domain/Building/BuildingDescription";
import {BuildingSize} from "../../../src/domain/Building/BuildingSize";
import {IFloorDTO} from "../../../src/dto/floor/IFloorDTO";
import {Floor} from "../../../src/domain/Floor/Floor";
import FloorNumber from "../../../src/domain/Floor/FloorNumber";
import {FloorDescription} from "../../../src/domain/Floor/FloorDescription";
import {FloorMap} from "../../../src/domain/Floor/FloorMap";
import {Result} from "../../../src/core/logic/Result";
import * as sinon from 'sinon';
import {ICreatePassagewayDTO} from "../../../src/dto/passageway/ICreatePassagewayDTO";
import {Passageway} from "../../../src/domain/Passageway/Passageway";
import ListFloorsPassagewaysController from "../../../src/controllers/floor/list/listFloorsPassagewaysController";
import IListFloorsPassagewaysService from "../../../src/services/IServices/floor/list/IListFloorsPassagewaysService";

describe('list floors with passageways to other buildings', function () {
    const sandbox = sinon.createSandbox();
    let buildingRepoMock;
    let floorRepoMock;
    let passagewayRepoMock;


    beforeEach(function () {
        Container.reset();

        buildingRepoMock = {
            findByBuidingCode: sinon.stub(),
            findAll: sinon.stub(),
            save: sinon.stub(),
            exists: sinon.stub(),
            findBuildingsMaxMinFloors: sinon.stub(),
            findByFloor: sinon.stub(),
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

        let listFloorsPassagewaysServiceClass = require('../../../src/services/floor/list/listFloorsPassagewaysService').default
        let listFloorsPassagewaysServiceInstance = Container.get(listFloorsPassagewaysServiceClass)
        Container.set('listFloorsPassagewaysService', listFloorsPassagewaysServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it("ListFloorsPassagewaysController unit test using ListFloorsPassagewaysService stub", async function() {

        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "A"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

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

        const Floor2DTO = {
            floorId: 2,
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

        const floor2 = Floor.create(
            {
                "floorNumber": new FloorNumber({number: Floor2DTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: Floor2DTO.floorDescription }),
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
            }, Floor2DTO.floorId).getValue()

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

        building.addFloor(floor);
        building2.addFloor(floor2);
        floor.addPassageway(passageway);
        floor2.addPassageway(passageway)

        sinon.stub(listFloorsPassagewaysServiceInstance, "listFloorsPassageways").returns(
            Result.ok<IFloorDTO[]>([FloorDTO])
        );


        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        // Act
        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match([FloorDTO]));
    });

    it("ListFloorsPassagewaysController + ListFloorsPassagewaysService integration test", async function() {
        // Arrange
        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "A"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

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

        const Floor2DTO = {
            floorId: 2,
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

        const floor2 = Floor.create(
            {
                "floorNumber": new FloorNumber({number: Floor2DTO.floorNumber}),
                "floorDescription": new FloorDescription({ value: Floor2DTO.floorDescription }),
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
            }, Floor2DTO.floorId).getValue()

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

        building.addFloor(floor);
        building2.addFloor(floor2);
        floor.addPassageway(passageway);
        floor2.addPassageway(passageway)

        buildingRepoMock.findByBuidingCode.resolves(building);
        buildingRepoMock.findByFloor.resolves(building);
        floorRepoMock.findByPassageway.resolves([building2]);
        floorRepoMock.findByPassageway.resolves([floor, floor2]);


        const listFloorsPassagewaysServiceSpy = sinon.spy(listFloorsPassagewaysServiceInstance, "listFloorsPassageways");

        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json,sinon.match([{
            floorNumber: 1,
            floorId: 1,
            floorDescription: "Joi.string().max(255)",
            floorMap: {
                passageways: [
                    1
                ],
            },
            floorConnected: [
                "2",
                "A"
            ]
        }]));
        sinon.assert.calledOnce(listFloorsPassagewaysServiceSpy);
    });

    it("ListFloorsPassagewaysController + ListFloorsPassagewaysService integration test (Building Not Found)", async function() {

        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "C"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

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
                        roomsCoords: [],
			doorsCoords: [],
                    }
                )
            }, FloorDTO.floorId).getValue()

        buildingRepoMock.findByBuidingCode.resolves(null);
        buildingRepoMock.findByFloor.resolves(building);


        const listFloorsPassagewaysServiceSpy = sinon.spy(listFloorsPassagewaysServiceInstance, "listFloorsPassageways");

        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(listFloorsPassagewaysServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building C not found"));
    });

    it("ListFloorsPassagewaysController + ListFloorsPassagewaysService integration test (Building No Floors)", async function() {
        let body = {};
        let req: Partial<Request> = {};
        req.body = body;
        req.params = {
            buildingCode: "A"
        }
        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
        let listFloorsPassagewaysServiceInstance = Container.get("listFloorsPassagewaysService");

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

        buildingRepoMock.findByBuidingCode.resolves(building);
        buildingRepoMock.findByFloor.resolves(null);

        const listFloorsPassagewaysServiceSpy = sinon.spy(listFloorsPassagewaysServiceInstance, "listFloorsPassageways");

        const ctrl = new ListFloorsPassagewaysController(listFloorsPassagewaysServiceInstance as IListFloorsPassagewaysService);

        await ctrl.listFloorsPassageways(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(listFloorsPassagewaysServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Building A has no floors"));
    });

});