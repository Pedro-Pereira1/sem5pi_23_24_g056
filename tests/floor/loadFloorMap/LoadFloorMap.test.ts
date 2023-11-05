import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import ICreateElevatorDTO from '../../../src/dto/elevator/ICreateElevatorDTO';
import { ElevatorID } from '../../../src/domain/Elevator/ElevatorID';
import { ElevatorSerialNumber } from '../../../src/domain/Elevator/ElevatorSerialNumber';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { ElevatorIdentificationNumber } from '../../../src/domain/Elevator/ElevatorIdentificationNumber';
import { ElevatorBrand } from '../../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../../src/domain/Elevator/ElevatorModel';
import { Floor } from '../../../src/domain/Floor/Floor';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import { IFloorDTO } from '../../../src/dto/floor/IFloorDTO';
import ILoadFloorMapDto from '../../../src/dto/floor/ILoadFloorMapDTO';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { Building } from '../../../src/domain/Building/Building'
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import LoadFloorMapController from '../../../src/controllers/floor/floorMap/LoadFloorMapController'
import ILoadFloorMapService from '../../../src/services/IServices/floor/floorMap/ILoadFloorMapService';
import { Result } from '../../../src/core/logic/Result';

describe('upload floor map test', function () {
    const validMap = {
        "floorId": 2,
        "buildingCode": "A",
        "map": [
            [3, 2, 2, 2, 2, 3, 2, 2, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1],
            [2, 2, 14, 0, 2, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 2, 2, 2, 2, 2, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [2, 2, 2, 2, 2, 2, 0, 0, 0]
        ],
        "elevators": [
            [5, 2, 2]
        ],
        "passageways": [],
        "rooms": []
    }

    const validMapDtoExpected = {
        floorId: 1,
        floorNumber: 1,
        floorDescription: "Salas Tps",
        floorMap: {
            map: [
                [3, 2, 2, 2, 2, 3, 2, 2, 1],
                [1, 0, 0, 0, 0, 1, 0, 0, 1],
                [2, 2, 14, 0, 2, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 2, 2, 2, 2, 2, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0],
                [1, 0, 0, 0, 0, 0, 1, 0, 0],
                [2, 2, 2, 2, 2, 2, 0, 0, 0]
            ],
            passageways: [],
            rooms: [],
            elevators: [
                5
            ],
            passagewaysCoords: [],
            elevatorsCoords: [
                [5, 2, 2]
            ],
            roomCoords: []
        }
    } as IFloorDTO

    const invalidMapWrognFormatCoords = {
        "floorId": 1,
        "buildingCode": "A",
        "map": [
            [3, 2, 2, 2, 2, 3, 2, 2, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1],
            [2, 2, 14, 0, 2, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 2, 2, 2, 2, 2, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [2, 2, 2, 2, 2, 2, 0, 0, 0]
        ],
        "elevators": [
            [5, 2, 2, 5]
        ],
        "passageways": [],
        "rooms": []
    }

    const invalidMapDtoWrongFormatCoordsExpected = {
        floorId: 1,
        floorNumber: 1,
        floorDescription: "Salas Tps",
        floorMap: {
            map: [
                [3, 2, 2, 2, 2, 3, 2, 2, 1],
                [1, 0, 0, 0, 0, 1, 0, 0, 1],
                [2, 2, 14, 0, 2, 2, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [3, 2, 2, 2, 2, 2, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0],
                [1, 0, 0, 0, 0, 0, 1, 0, 0],
                [2, 2, 2, 2, 2, 2, 0, 0, 0]
            ],
            passageways: [],
            rooms: [],
            elevators: [,
                5
            ],
            passagewaysCoords: [],
            elevatorsCoords: [
                [5, 2, 2, 5]
            ],
            roomCoords: []
        }
    } as IFloorDTO

    const invalidMapObjectisNotOnSpecifiedCoords = {
        "floorId": 1,
        "buildingCode": "A",
        "map": [
            [3, 2, 2, 2, 2, 3, 2, 2, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 1],
            [2, 2, 0, 0, 2, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [3, 2, 2, 2, 14, 2, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0],
            [2, 2, 2, 2, 2, 2, 0, 0, 0]
        ],
        "elevators": [
            [5, 2, 2]
        ],
        "passageways": [],
        "rooms": []
    }

    const elevatorDto = {
        elevatorId: 5,
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

    const createFloorDTO = {
        floorId: 1,
        floorNumber: 1,
        floorDescription: "Salas Tps",
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

    const floorWithElevatorResult = Floor.create(
        {
            floorDescription: new FloorDescription({ value: createFloorDTO.floorDescription }),
            floorNumber: new FloorNumber({ number: createFloorDTO.floorNumber }),
            floormap: new FloorMap({
                map: [],
                passageways: [],
                elevators: [elevatorResult.getValue()],
                rooms: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomsCoords: [],
            })
        }, createFloorDTO.floorId)

    const floorWithOutElevatorResult = Floor.create(
        {
            floorDescription: new FloorDescription({ value: createFloorDTO.floorDescription }),
            floorNumber: new FloorNumber({ number: createFloorDTO.floorNumber }),
            floormap: new FloorMap({
                map: [],
                passageways: [],
                elevators: [],
                rooms: [],
                passagewaysCoords: [],
                elevatorsCoords: [],
                roomsCoords: [],
            })
        }, createFloorDTO.floorId)

    const building = {
        buildingCode: "A",
        buildingName: "buildingTest",
        buildingDescription: "this is a building",
        buildingLength: 10,
        buildingWidth: 10,
        buildingFloors: []
    } as IBuildingDTO

    const buildingLength = {
        buildingCode: "A",
        buildingName: "buildingTest",
        buildingDescription: "this is a building",
        buildingLength: 5,
        buildingWidth: 10,
        buildingFloors: []
    } as IBuildingDTO

    const buildingWidth = {
        buildingCode: "A",
        buildingName: "buildingTest",
        buildingDescription: "this is a building",
        buildingLength: 10,
        buildingWidth: 5,
        buildingFloors: []
    } as IBuildingDTO

    const buildingResult = Building.create({
        buildingName: new BuildingName({ value: building.buildingName }),
        buildingDescription: new BuildingDescription({ value: building.buildingDescription }),
        buildingSize: new BuildingSize({ length: building.buildingLength, width: building.buildingWidth }),
        floors: [floorWithElevatorResult.getValue()],
    }, building.buildingCode)

    const buildingWithOutFLoorsResult = Building.create({
        buildingName: new BuildingName({ value: building.buildingName }),
        buildingDescription: new BuildingDescription({ value: building.buildingDescription }),
        buildingSize: new BuildingSize({ length: building.buildingLength, width: building.buildingWidth }),
        floors: [],
    }, building.buildingCode)

    const buildingLengthResult = Building.create({
        buildingName: new BuildingName({ value: buildingLength.buildingName }),
        buildingDescription: new BuildingDescription({ value: buildingLength.buildingDescription }),
        buildingSize: new BuildingSize({ length: buildingLength.buildingLength, width: buildingLength.buildingWidth }),
        floors: [floorWithElevatorResult.getValue()],
    }, buildingLength.buildingCode)

    const buildingWitdthResult = Building.create({
        buildingName: new BuildingName({ value: buildingWidth.buildingName }),
        buildingDescription: new BuildingDescription({ value: buildingWidth.buildingDescription }),
        buildingSize: new BuildingSize({ length: buildingWidth.buildingLength, width: buildingWidth.buildingWidth }),
        floors: [floorWithElevatorResult.getValue()],
    }, buildingWidth.buildingCode)


    beforeEach(function () {
        Container.reset()

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let floorRepoClass = require('../../../src/repos/floor/floorRepo').default
        let floorRepoInstance = Container.get(floorRepoClass)
        Container.set('floorRepo', floorRepoInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        let loadFloorMapServiceClass = require('../../../src/services/floor/floorMap/LoadFloorMapService').default
        let loadFloorMapServiceInstance = Container.get(loadFloorMapServiceClass)
        Container.set('loadFloorMapService', loadFloorMapServiceInstance)
    })

    it('1. Controller with stub service valid map', async function () {
        let req: Partial<Request> = {
            body: validMap
        }
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        sinon.stub(service, 'loadFloorMap')
            .returns(new Promise((resolve, reject) => { resolve(Result.ok<IFloorDTO>(validMapDtoExpected)) }))

        const controller = new LoadFloorMapController(service)

        await controller.loadFloorMap(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
    })

    it('2. Controller with stub service invalid map', async function () {
        let req: Partial<Request> = {
            body: invalidMapObjectisNotOnSpecifiedCoords
        }
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        sinon.stub(service, 'loadFloorMap')
            .returns(new Promise((resolve, reject) => { resolve(Result.fail<IFloorDTO>(invalidMapDtoWrongFormatCoordsExpected)) }))

        const controller = new LoadFloorMapController(service)

        await controller.loadFloorMap(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo valid map', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isSuccess, true)
        sinon.assert.match(actual.getValue(), validMapDtoExpected)
    })

    it('4. Service with stub repo invalid map (building doesn\'t exist)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(null)

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Service with stub repo invalid map (floor doesn\'t exist)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('6. Service with stub repo invalid map (floor doesn\'t belong to building)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingWithOutFLoorsResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('7. Service with stub repo invalid map (floor has bigger length than maximum alloweb by building)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingLengthResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('8. Service with stub repo invalid map (floor has bigger witdh than maximum alloweb by building)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingWitdthResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('9. Service with stub repo invalid map (wrong format in elevator coordinates)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(invalidMapWrognFormatCoords as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('10. Service with stub repo invalid map (object ins\'t on specified coords)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(invalidMapObjectisNotOnSpecifiedCoords as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('11. Service with stub repo invalid map (elevator doesn\'t belont to floor)', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithOutElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const actual = await service.loadFloorMap(validMap as ILoadFloorMapDto)

        sinon.assert.match(actual.isFailure, true)
    })

    it('12. Controller + Service with stub repo valid map', async function () {
        let req: Partial<Request> = {
            body: validMap
        }
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const controller = new LoadFloorMapController(service)

        await controller.loadFloorMap(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, validMapDtoExpected)
    })

    it('13. Controller + Service with stub repo invalid map', async function () {
        let req: Partial<Request> = {
            body: validMap
        }
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .returns(buildingResult.getValue())

        const floorRepo = Container.get('floorRepo')
        sinon.stub(floorRepo, 'findById')
            .returns(floorWithOutElevatorResult.getValue())

        sinon.stub(floorRepo, 'save')
            .returns(null)

        const service = Container.get('loadFloorMapService') as ILoadFloorMapService

        const controller = new LoadFloorMapController(service)

        await controller.loadFloorMap(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })
})