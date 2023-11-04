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

        let buildingSchemaInstance = require('../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let floorSchemaInstance = require('../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let elevatorSchemaInstance = require('../../src/persistence/schemas/elevator/elevatorSchema').default
        Container.set('elevatorSchema', elevatorSchemaInstance)

        let elevatorRepoClass = require('../../src/repos/elevator/elevatorRepo').default
        let elevatorRepoInstance = Container.get(elevatorRepoClass)
        Container.set('elevatorRepo', elevatorRepoInstance)
 
        let createElevatorServiceClass = require('../../src/services/elevator/create/createElevatorService').default
        let createElevatorServiceInstance = Container.get(createElevatorServiceClass)
        Container.set('createElevatorService', createElevatorServiceInstance)
        
        
    });

    afterEach(function () {
        sandbox.restore();
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
            json: sinon.spy()
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


    it('Service unit test with stud repo, valid elevator', async function () {

        let body = {
            "elevatorId": 20,
            "elevatorBrand": "Apple",
            "elevatorIdentificationNumber": 35,
            "elevatorDescription": 'This is an elevator',
            "elevatorModel": 'Ieli',
            "elevatorSerialNumber": '445'
        }

        let req: Partial<Request> = {
            body: body
        }

        let res: Partial<Response> = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
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

        buildingRepoMock.findByBuidingCode.resolves(building.getValue())







/*
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 3,
            buildingWidth: 3,
            buildingFloors: []
        } as IBuildingDTO

        const buildingResult = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        const building = buildingResult.getValue()

        const floorDTO = {
            floorId: 1,
            floorNumber: 2,
            floorDescription: "its a floor",
            floorMap: {}
        } as IFloorDTO

        const floorResult = Floor.create({
            floorDescription: new FloorDescription({value: floorDTO.floorDescription}),
            floorNumber: new FloorNumber({number: floorDTO.floorNumber}),
            floormap: new FloorMap({map: [],
                passageways: [],
                elevators: [],
                rooms: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomsCoords: [],}),
        }, floorDTO.floorId)

        const floor = floorResult.getValue()

        const elevatorDto = {
            elevatorId: 20,
            elevatorBrand: 'Apple',
            elevatorDescription: 'This is an elevator',
            elevatorModel: 'Ieli',
            elevatorSerialNumber: '445'
        } as ICreateElevatorDTO

        const elevatorResult = Elevator.create({
            elevatorIdentificationNumber: new ElevatorIdentificationNumber({ identificationNumber: 2 }),
            elevatorBrand: new ElevatorBrand({ brand: elevatorDto.elevatorBrand }),
            elevatorDescription: new ElevatorDescription({ description: elevatorDto.elevatorDescription }),
            elevatorModel: new ElevatorModel({ model: elevatorDto.elevatorModel }),
            elevatorSerialNumber: new ElevatorSerialNumber({ serialNumber: elevatorDto.elevatorSerialNumber })
        }, new ElevatorID(elevatorDto.elevatorId))

        const elevator = elevatorResult.getValue()

        const elevatorRepoInstance = Container.get('elevatorRepo')
        const elevatorRepoMock = sinon.mock(elevatorRepoInstance, "save")
        elevatorRepoMock.expects("save")
            .once()
            .withArgs(elevator)
            .returns(new Promise<Elevator>((resolve, reject) => { resolve(elevator) }))

        const buildingRepoInstance = Container.get('buildingRepo')
        const buildingRepoMock = sinon.mock(buildingRepoInstance, "save")
        buildingRepoMock.expects("save")
            .once()
            .withArgs(building)
            .returns(new Promise<Building>((resolve, reject) => { resolve(building) }))

        const floorRepoInstance = Container.get('floorRepo')
        const floorRepoMock = sinon.mock(floorRepoInstance, "save")
        floorRepoMock.expects("save")
            .once()
            .withArgs(floor)
            .returns(new Promise<Floor>((resolve, reject) => { resolve(floor) }))

        const createElevatorService = new CreateElevatorService(elevatorRepoMock as IElevatorRepo, buildingRepoMock as IBuildingRepo, floorRepoMock as IFloorRepo)

        const actual = await createElevatorService.createElevator(elevatorDto)

        elevatorRepoMock.verify()
        assert.equal(elevatorDto, actual.getValue())

 */
    })

    it('Service unit test with stud repo, invalid elevator', async function () {

    })

    it('Repo unit test, valid elevator', async function () {

    })

    it('Repo unit test, invalid elevator', async function () {

    })

    it('Controller + service integration test using elevatorRepo and elevator stub', async function () {

    })

    it('Controller + service + repo integration test', async function () {

    })

})