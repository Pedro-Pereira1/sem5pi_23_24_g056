import * as sinon from 'sinon';
import Container from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { Result } from '../../../src/core/logic/Result';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { ICreateFloorDTO } from '../../../src/dto/floor/ICreateFloorDTO';
import { Floor } from '../../../src/domain/Floor/Floor';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import { ICreatePassagewayDTO } from '../../../src/dto/passageway/ICreatePassagewayDTO';
import { Passageway } from '../../../src/domain/Passageway/Passageway';
import {IListPassagewaysBetween2BuildingsDTO} from '../../../src/dto/passageway/IListPassagewaysBetween2BuildingsDTO'
import ListPassagewaysBetween2BuildingsController from '../../../src/controllers/passageway/list/listPassagewaysBetween2BuildingsController'
import IListPassagewaysBetween2BuildingsService from '../../../src/services/IServices/passageway/list/IListPassagewaysBetween2BuildingsService';


describe('List passageways between 2 buildings test', function () {
    // Create Passageway
    const createPassagewayDTO = {
        passagewayId: 1,
        building1Id: "A",
        floor1Id: 1,
        building2Id: "B",
        floor2Id: 2
    } as ICreatePassagewayDTO

    const passageway = Passageway.create(
        {
            passagewayId: createPassagewayDTO.passagewayId,
            building1Id: createPassagewayDTO.building1Id,
            floor1Id: createPassagewayDTO.floor1Id,
            building2Id: createPassagewayDTO.building2Id,
            floor2Id: createPassagewayDTO.floor2Id,
        }).getValue()


    // Create Floor
    const floorDto = {
        floorId: 1,
        floorNumber:  1,
        floorDescription: "a description",
        buildingCode: "A"
    } as ICreateFloorDTO

    const floor = Floor.create({
        floorNumber:  new FloorNumber({number :floorDto.floorNumber}),
        floorDescription: new FloorDescription({value: floorDto.floorDescription}),
        floormap: new FloorMap({
            map: [],
            passageways: [],
            elevators: [],
            rooms: [],
            passagewaysCoords: [],
            elevatorsCoords: [],
            roomsCoords: [],
        })
    }, floorDto.floorId)

    const floor2Dto = {
        floorId: 2,
        floorNumber:  1,
        floorDescription: "a description",
        buildingCode: "A"
    } as ICreateFloorDTO

    const floor2 = Floor.create({
        floorNumber:  new FloorNumber({number :floor2Dto.floorNumber}),
        floorDescription: new FloorDescription({value: floor2Dto.floorDescription}),
        floormap: new FloorMap({
            map: [],
            passageways: [],
            elevators: [],
            rooms: [],
            passagewaysCoords: [],
            elevatorsCoords: [],
            roomsCoords: [],
        })
    }, floorDto.floorId)

    


    // Create Building
    const buildingDto = {
        buildingName: "EdificioA",
        buildingDescription: "uma descricao",
        buildingCode: "A",
        buildingLength: 2,
        buildingWidth: 2,
        buildingFloors: []
    } as IBuildingDTO

    const building = Building.create({
        buildingName: new BuildingName({ value: buildingDto.buildingName }),
        buildingDescription: new BuildingDescription({ value: buildingDto.buildingDescription }),
        buildingSize: new BuildingSize({ length: buildingDto.buildingLength, width: buildingDto.buildingWidth }),
        floors: [floor.getValue()],
    }, buildingDto.buildingCode)

    const building2Dto = {
        buildingName: "EdificioB",
        buildingDescription: "uma descricao",
        buildingCode: "B",
        buildingLength: 2,
        buildingWidth: 2,
        buildingFloors: []
    } as IBuildingDTO

    const building2 = Building.create({
        buildingName: new BuildingName({ value: building2Dto.buildingName }),
        buildingDescription: new BuildingDescription({ value: building2Dto.buildingDescription }),
        buildingSize: new BuildingSize({ length: building2Dto.buildingLength, width: building2Dto.buildingWidth }),
        floors: [floor2.getValue()],
    }, building2Dto.buildingCode)

    const building3Dto = {
        buildingName: "EdificioF",
        buildingDescription: "uma descricao",
        buildingCode: "F",
        buildingLength: 2,
        buildingWidth: 2,
        buildingFloors: []
    } as IBuildingDTO

    const building3 = Building.create({
        buildingName: new BuildingName({ value: building3Dto.buildingName }),
        buildingDescription: new BuildingDescription({ value: building3Dto.buildingDescription }),
        buildingSize: new BuildingSize({ length: building3Dto.buildingLength, width: building3Dto.buildingWidth }),
        floors: [],
    }, building3Dto.buildingCode)

    //building.getValue().addFloor(floor.getValue());
    //building2.getValue().addFloor(floor2.getValue());
    floor.getValue().addPassageway(passageway);
    floor2.getValue().addPassageway(passageway)

    let elevatorRepoMock;
    let floorRepoMock;
    
    beforeEach(function () {
        Container.reset()

        //Schemas
        let elevatorSchemaInstance = require('../../../src/persistence/schemas/elevator/elevatorSchema').default
        Container.set('elevatorSchema', elevatorSchemaInstance)

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let passagewaySchemaInstance = require('../../../src/persistence/schemas/passageway/passagewaySchema').default
        Container.set('passagewaySchema', passagewaySchemaInstance)


        //Repos
        elevatorRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set('elevatorRepo', elevatorRepoMock)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        floorRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set('floorRepo', floorRepoMock)

        let passagewayRepoClass = require('../../../src/repos/passageway/passagewayRepo').default
        let passagewayRepoInstance = Container.get(passagewayRepoClass)
        Container.set('passagewayRepo', passagewayRepoInstance)

        //Services
        let listPassagewaysBetween2BuildingsServiceClass = require('../../../src/services/passageway/list/listPassagewaysBetween2BuildingsService').default
        let listPassagewaysBetween2BuildingsServiceInstance = Container.get(listPassagewaysBetween2BuildingsServiceClass)
        Container.set('listPassagewaysBetween2BuildingsService', listPassagewaysBetween2BuildingsServiceInstance)
    })

    it('1. Controller with stub service returns passageway', async function () {
        const passagewayResult1 = {
            passagewayId: 1,
            floorNumberBuilding1: 1,
            floorNumberBuilding2: 1
        } as IListPassagewaysBetween2BuildingsDTO

        const result = [passagewayResult1]

        let req: Partial<Request> = {}
        req.params = {
            building1Code: building.getValue().code.toString(),
            building2Code: building2.getValue().code.toString()
        }

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService')

        sinon.stub(listPassagewaysBetween2BuildingsService, 'listPassagewaysBetween2Buildings').returns(new Promise((resolve, reject) => { resolve(Result.ok<IListPassagewaysBetween2BuildingsDTO[]>(result)) }))

        const listPassagewaysBetween2BuildingsController = new ListPassagewaysBetween2BuildingsController (listPassagewaysBetween2BuildingsService as IListPassagewaysBetween2BuildingsService)

        await listPassagewaysBetween2BuildingsController.listPassagewaysBetween2Buildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('2. Controller with stub service returns no passageway', async function () {
        let req: Partial<Request> = {}
        req.params = {
            building1Code: building.getValue().code.toString(),
            building2Code: building2.getValue().code.toString()
        }

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService')

        sinon.stub(listPassagewaysBetween2BuildingsService, 'listPassagewaysBetween2Buildings').returns(new Promise((resolve, reject) => { resolve(Result.fail<IListPassagewaysBetween2BuildingsDTO[]>('No passageways found!')) }))

        const listPassagewaysBetween2BuildingsController = new ListPassagewaysBetween2BuildingsController (listPassagewaysBetween2BuildingsService as IListPassagewaysBetween2BuildingsService)

        await listPassagewaysBetween2BuildingsController.listPassagewaysBetween2Buildings(<Request>req, <Response>res, <NextFunction>next)
        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo lists passageway', async function () {
        const passagewayResult = {
            passagewayId: 1,
            floorNumberBuilding1: 1,
            floorNumberBuilding2: 1
        } as IListPassagewaysBetween2BuildingsDTO
        
        const expected = [passagewayResult]

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2.getValue()) }))
            
        const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService') as IListPassagewaysBetween2BuildingsService

        const actual = await listPassagewaysBetween2BuildingsService.listPassagewaysBetween2Buildings(building.getValue().code.toString(), building2.getValue().code.toString())

        sinon.assert.match(actual.getValue(), expected)
    })

    it('4. Service with stub repo finds passageways', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building3.getValue()) }))

            const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService') as IListPassagewaysBetween2BuildingsService

            const actual = await listPassagewaysBetween2BuildingsService.listPassagewaysBetween2Buildings(building.getValue().code.toString(), building3.getValue().code.toString())
        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service with stub repo returns passageway', async function () {
        const passagewayResult1 = {
            passagewayId: 1,
            floorNumberBuilding1: 1,
            floorNumberBuilding2: 1
        } as IListPassagewaysBetween2BuildingsDTO
    

        const result = [passagewayResult1]

        let req: Partial<Request> = {}
        req.params = {
            building1Code: building.getValue().code.toString(),
            building2Code: building2.getValue().code.toString()
        }

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building2.getValue()) }))

        const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService') as IListPassagewaysBetween2BuildingsService

        const listPassagewaysBetween2BuildingsController = new ListPassagewaysBetween2BuildingsController (listPassagewaysBetween2BuildingsService as IListPassagewaysBetween2BuildingsService)

        await listPassagewaysBetween2BuildingsController.listPassagewaysBetween2Buildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('6. Controller + Service with stub repo returns no passageway', async function () {
        let req: Partial<Request> = {}
        req.params = {
            building1Code: building.getValue().code.toString(),
            building2Code: building3.getValue().code.toString()
        }

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode')
            .onFirstCall()
            .returns(new Promise((resolve, reject) => { resolve(building.getValue()) }))
            .onSecondCall()
            .returns(new Promise((resolve, reject) => { resolve(building3.getValue()) }))

        const listPassagewaysBetween2BuildingsService = Container.get('listPassagewaysBetween2BuildingsService') as IListPassagewaysBetween2BuildingsService

        const listPassagewaysBetween2BuildingsController = new ListPassagewaysBetween2BuildingsController (listPassagewaysBetween2BuildingsService as IListPassagewaysBetween2BuildingsService)
    
        await listPassagewaysBetween2BuildingsController.listPassagewaysBetween2Buildings(<Request>req, <Response>res, <NextFunction>next)
    
        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })


})
