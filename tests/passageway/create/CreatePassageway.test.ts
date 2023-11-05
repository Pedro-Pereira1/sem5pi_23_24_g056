import * as sinon from 'sinon';
import Container from 'typedi';
import { Result } from '../../../src/core/logic/Result';
import { IPassagewayDTO } from '../../../src/dto/passageway/IPassagewayDTO';
import { ICreatePassagewayDTO } from '../../../src/dto/passageway/ICreatePassagewayDTO';
import CreatePassagewayController from '../../../src/controllers/passageway/create/createPassagewayController'
import { Response, Request, NextFunction } from 'express';
import ICreatePassagewayService from '../../../src/services/IServices/passageway/create/ICreatePassagewayService';
import { Passageway } from '../../../src/domain/Passageway/Passageway';
import { PassagewayID } from '../../../src/domain/Passageway/PassagewayID';
import { assert } from 'console';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { Building } from '../../../src/domain/Building/Building';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import { Floor } from '../../../src/domain/Floor/Floor';


describe('Passageway tests', function () {
    let passagewayRepoMock

    beforeEach(function () {
        Container.reset()

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        let floorSchema = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchema)

        let floorRepoClass = require('../../../src/repos/floor/floorRepo').default
        let floorRepoInstance = Container.get(floorRepoClass)
        Container.set('floorRepo', floorRepoInstance)

        let passagewaySchema = require('../../../src/persistence/schemas/passageway/passagewaySchema').default
        Container.set('passagewaySchema', passagewaySchema)

        passagewayRepoMock = {
            findById: sinon.stub(),
            save: sinon.stub()
        }

        Container.set('passagewayRepo', passagewayRepoMock)

        let passagewayRepoClass = require('../../../src/repos/floor/floorRepo').default
        let passagewayRepoInstance = Container.get(passagewayRepoClass)
        Container.set('passagewayRepo', passagewayRepoMock)

        let createPassagewayServiceClass = require('../../../src/services/passageway/create/createPassagewayService').default
        let createPassagewayServiceInstance = Container.get(createPassagewayServiceClass)
        Container.set('createPassagewayService', createPassagewayServiceInstance)
    })

    it('1. Controller with stub service create valid passageway', async function () {
        const createPassagewayJSON = {
            "passagewayId": 1,
            "building1Id": 10,
            "floor1Id": 5,
            "building2Id": 11,
            "floor2Id": 6,
        }

        const passagewayDto = {
            passagewayId: 1
        } as IPassagewayDTO

        const createPassagewayService = Container.get('createPassagewayService')
        sinon.stub(createPassagewayService, 'createPassageway').returns(new Promise((resolve, reject) => {
            resolve(Result.ok<IPassagewayDTO>(passagewayDto))
        }))

        let req: Partial<Request> = {}
        req.body = createPassagewayJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const createPassagewayController = new CreatePassagewayController(createPassagewayService as ICreatePassagewayService)

        await createPassagewayController.createPassageway(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, passagewayDto)
    })

    it('2. Controller with stub service create invalid passageway', async function () {
        const createPassagewayJSON = {
            "passagewayId": 1,
            "building1Id": 10,
            "floor1Id": 5,
            "building2Id": 11,
            "floor2Id": 6,
        }

        const createPassagewayService = Container.get('createPassagewayService')
        sinon.stub(createPassagewayService, 'createPassageway').returns(new Promise((resolve, reject) => {
            resolve(Result.fail<IPassagewayDTO>('Passageway already exists.'))
        }))

        let req: Partial<Request> = {}
        req.body = createPassagewayJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const createPassagewayController = new CreatePassagewayController(createPassagewayService as ICreatePassagewayService)

        await createPassagewayController.createPassageway(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo create valid passageway', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const building1DTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building1Result = Building.create({
            buildingName: new BuildingName({ value: building1DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building1DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building1DTO.buildingLength, width: building1DTO.buildingWidth }),
            floors: [],
        }, building1DTO.buildingCode)

        const building1 = building1Result.getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2Result = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: []
        }, building2DTO.buildingCode)

        const building2 = building2Result.getValue()

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
            }),
        };
        const floor2Id = 2;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        building1.addFloor(floor1)
        building2.addFloor(floor2)

        const floorRepo = Container.get('floorRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2) }))


        sinon.stub(floorRepo, 'findById')
            .onFirstCall()
            .returns(floor1)
            .onSecondCall()
            .returns(floor2)

        sinon.stub(floorRepo, 'save').returns(null)

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isSuccess, true)
    })

    it('4. Service with stub repo create invalid passageway (repeated passageway)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 5,
            building2Id: "B",
            floor2Id: 6,
        } as ICreatePassagewayDTO

        passagewayRepoMock.findById.resolves(new Passageway({}, new PassagewayID(5)))
        passagewayRepoMock.save.resolves(null)

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Service with stub repo create invalid passageway (building 1 doesn\'t exist)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 5,
            building2Id: "B",
            floor2Id: 6,
        } as ICreatePassagewayDTO

        const passagewayRepo = Container.get('passagewayRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode').onFirstCall().returns(new Promise((resolve, reject) => {
            resolve(null)
        }))

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    it('6. Service with stub repo create invalid passageway (building 2 doesn\'t exist)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 5,
            building2Id: "B",
            floor2Id: 6,
        } as ICreatePassagewayDTO

        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        const passagewayRepo = Container.get('passagewayRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building) }))
            .onSecondCall()
            .returns(null)

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    it('7. Service with stub repo create invalid passageway (building 1 and 2 are the same)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "cod1",
            floor1Id: 5,
            building2Id: "cod1",
            floor2Id: 5,
        } as ICreatePassagewayDTO

        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        const passagewayRepo = Container.get('passagewayRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    it('8. Service with stub repo create invalid passageway (floor1 isn\'t on building 1)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const building1DTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building1Result = Building.create({
            buildingName: new BuildingName({ value: building1DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building1DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building1DTO.buildingLength, width: building1DTO.buildingWidth }),
            floors: [],
        }, building1DTO.buildingCode)

        const building1 = building1Result.getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2Result = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: []
        }, building2DTO.buildingCode)

        const building2 = building2Result.getValue()

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
            }),
        };
        const floorId = 5;
        const floor1 = Floor.create(floorProps1, floorId).getValue();

        building1.addFloor(floor1)

        const floorRepo = Container.get('floorRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2) }))

        sinon.stub(floorRepo, 'save')
            .returns()

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    it('9. Service with stub repo create invalid passageway (floor2 isn\'t on building 2)', async function () {
        const createPassagewayDTO = {
            passagewayId: 1,
            building1Id: "A",
            floor1Id: 1,
            building2Id: "B",
            floor2Id: 2,
        } as ICreatePassagewayDTO

        const building1DTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building1Result = Building.create({
            buildingName: new BuildingName({ value: building1DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building1DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building1DTO.buildingLength, width: building1DTO.buildingWidth }),
            floors: [],
        }, building1DTO.buildingCode)

        const building1 = building1Result.getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2Result = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: []
        }, building2DTO.buildingCode)

        const building2 = building2Result.getValue()

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
            }),
        };
        const floor2Id = 4;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        building1.addFloor(floor1)
        building2.addFloor(floor2)

        const floorRepo = Container.get('floorRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2) }))

        sinon.stub(floorRepo, 'save')
            .returns()

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService

        const actual = await createPassagewayService.createPassageway(createPassagewayDTO)

        sinon.assert.match(actual.isFailure, true)
    })

    /////////////////////////////////////
    it('10. Controller + service with stub repo create valid passageway', async function () {
        const createPassagewayJSON = {
            "passagewayId": 1,
            "building1Id": "A",
            "floor1Id": 5,
            "building2Id": "B",
            "floor2Id": 6,
        }

        const passagewayDto = {
            passagewayId: 1
        } as IPassagewayDTO

        const building1DTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building1Result = Building.create({
            buildingName: new BuildingName({ value: building1DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building1DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building1DTO.buildingLength, width: building1DTO.buildingWidth }),
            floors: [],
        }, building1DTO.buildingCode)

        const building1 = building1Result.getValue()

        const building2DTO = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "B",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building2Result = Building.create({
            buildingName: new BuildingName({ value: building2DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building2DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building2DTO.buildingLength, width: building2DTO.buildingWidth }),
            floors: []
        }, building2DTO.buildingCode)

        const building2 = building2Result.getValue()

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
            }),
        };
        const floor1Id = 5;
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
            }),
        };
        const floor2Id = 6;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        building1.addFloor(floor1)
        building2.addFloor(floor2)

        let req: Partial<Request> = {}
        req.body = createPassagewayJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const floorRepo = Container.get('floorRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2) }))


        sinon.stub(floorRepo, 'findById')
            .onFirstCall()
            .returns(floor1)
            .onSecondCall()
            .returns(floor2)

        sinon.stub(floorRepo, 'save').returns(null)

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService
        const createPassagewayController = new CreatePassagewayController(createPassagewayService as ICreatePassagewayService)

        await createPassagewayController.createPassageway(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, passagewayDto)
    })

    /////////////////////////////////////
    it('11. Controller + service with stub repo create invalid passageway', async function () {
        const createPassagewayJSON = {
            "passagewayId": 1,
            "building1Id": "A",
            "floor1Id": 5,
            "building2Id": "A",
            "floor2Id": 5,
        }

        const passagewayDto = {
            passagewayId: 1
        } as IPassagewayDTO

        const building1DTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "A",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building1Result = Building.create({
            buildingName: new BuildingName({ value: building1DTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: building1DTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: building1DTO.buildingLength, width: building1DTO.buildingWidth }),
            floors: [],
        }, building1DTO.buildingCode)

        const building1 = building1Result.getValue()

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
            }),
        };
        const floor1Id = 5;
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
            }),
        };
        const floor2Id = 6;
        const floor2 = Floor.create(floorProps2, floor2Id).getValue();

        building1.addFloor(floor1)

        let req: Partial<Request> = {}
        req.body = createPassagewayJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const floorRepo = Container.get('floorRepo')
        const buildingRepo = Container.get('buildingRepo')

        passagewayRepoMock.findById.resolves(null)
        passagewayRepoMock.save.resolves(null)

        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building1) }))


        sinon.stub(floorRepo, 'findById')
            .onFirstCall()
            .returns(floor1)
            .onSecondCall()
            .returns(floor2)

        sinon.stub(floorRepo, 'save').returns(null)

        const createPassagewayService = Container.get('createPassagewayService') as ICreatePassagewayService
        const createPassagewayController = new CreatePassagewayController(createPassagewayService as ICreatePassagewayService)

        await createPassagewayController.createPassageway(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })
})