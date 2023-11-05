import * as sinon from 'sinon';
import Container from 'typedi';
import IListAllBuildingsService from '../../../src/services/IServices/building/IListAllBuildingsService';
import { Response, Request, NextFunction } from 'express';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { Result } from '../../../src/core/logic/Result';
import IBuildingRepo from '../../../src/services/IRepos/building/IBuildingRepo';
import ListAllBuildingsService from '../../../src/services/building/list/listAllBuildingsService';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import ListAllBuildingsController from '../../../src/controllers/building/list/listAllBuildingsController';
import { send } from 'process';
import IElevatorDTO from '../../../src/dto/elevator/IElevatorDTO';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { ElevatorIdentificationNumber } from '../../../src/domain/Elevator/ElevatorIdentificationNumber';
import { ElevatorBrand } from '../../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../../src/domain/Elevator/ElevatorModel';
import { ElevatorSerialNumber } from '../../../src/domain/Elevator/ElevatorSerialNumber';
import { ElevatorID } from '../../../src/domain/Elevator/ElevatorID';
import { ICreateFloorDTO } from '../../../src/dto/floor/ICreateFloorDTO';
import { Floor } from '../../../src/domain/Floor/Floor';
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import IListElevatorsInBuildingDTO from '../../../src/dto/elevator/IListElevatorsInBuildingDTO'
import IListElevatorsInBuildingService from '../../../src/services/IServices/elevator/list/IListElevatorsInBuildingService'
import ListElevatorsInBuildingController from '../../../src/controllers/elevator/list/listElevatorsInBuildingController'


describe('List elevators in building test', function () {
    const elevatorDto1 = {
        elevatorId: 1,
        elevatorIdentificationNumber: 1,
        elevatorBrand: "brand1",
        elevatorDescription: "a description",
        elevatorModel: "a model",
        elevatorSerialNumber: "111"
    } as IElevatorDTO

    const elevator1 = Elevator.create(
        {
            elevatorIdentificationNumber: ElevatorIdentificationNumber.create(elevatorDto1.elevatorIdentificationNumber).getValue(),
            elevatorBrand: ElevatorBrand.create(elevatorDto1.elevatorBrand).getValue(),
            elevatorDescription: ElevatorDescription.create(elevatorDto1.elevatorDescription).getValue(),
            elevatorModel: ElevatorModel.create(elevatorDto1.elevatorModel).getValue(),
            elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto1.elevatorSerialNumber).getValue()
        }, ElevatorID.create(elevatorDto1.elevatorId).getValue())

    const elevatorDto2 = {
        elevatorId: 2,
        elevatorIdentificationNumber: 2,
        elevatorBrand: "brand2",
        elevatorDescription: "a description",
        elevatorModel: "a model 2",
        elevatorSerialNumber: "222"
    } as IElevatorDTO

    const elevator2 = Elevator.create(
        {
            elevatorIdentificationNumber: ElevatorIdentificationNumber.create(elevatorDto2.elevatorIdentificationNumber).getValue(),
            elevatorBrand: ElevatorBrand.create(elevatorDto2.elevatorBrand).getValue(),
            elevatorDescription: ElevatorDescription.create(elevatorDto2.elevatorDescription).getValue(),
            elevatorModel: ElevatorModel.create(elevatorDto2.elevatorModel).getValue(),
            elevatorSerialNumber: ElevatorSerialNumber.create(elevatorDto2.elevatorSerialNumber).getValue()
        }, ElevatorID.create(elevatorDto2.elevatorId).getValue())


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
            elevators: [elevator1.getValue(), elevator2.getValue()],
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


        //Services
        let listElevatorsInBuildingServiceClass = require('../../../src/services/elevator/list/listElevatorsInBuildingService').default
        let listElevatorsInBuildingServiceInstance = Container.get(listElevatorsInBuildingServiceClass)
        Container.set('listElevatorsInBuildingService', listElevatorsInBuildingServiceInstance)
    })

    it('1. Controller with stub service returns 2 elevators', async function () {
        const elevatorResult1 = {
            elevatorId: elevator1.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator1.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator1.getValue().elevatorBrand.brand,
            elevatorDescription: elevator1.getValue().elevatorDescription.description,
            elevatorModel: elevator1.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator1.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO

        const elevatorResult2 = {
            elevatorId: elevator2.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator2.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator2.getValue().elevatorBrand.brand,
            elevatorDescription: elevator2.getValue().elevatorDescription.description,
            elevatorModel: elevator2.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator2.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO

        const result = [elevatorResult1, elevatorResult2]

        let req: Partial<Request> = {}
        req.params = {buildingCode: building.getValue().code.toString()}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService')

        sinon.stub(listElevatorsInBuildingService, 'listElevatorsInBuilding').returns(new Promise((resolve, reject) => { resolve(Result.ok<IListElevatorsInBuildingDTO[]>(result)) }))

        const listElevatorsInBuildingController = new ListElevatorsInBuildingController(listElevatorsInBuildingService as IListElevatorsInBuildingService)

        await listElevatorsInBuildingController.listElevatorsInBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('2. Controller with stub service returns no elevators', async function () {
        let req: Partial<Request> = {}
        req.params = {buildingCode: building.getValue().code.toString()}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService')

        sinon.stub(listElevatorsInBuildingService, 'listElevatorsInBuilding').returns(new Promise((resolve, reject) => { resolve(Result.fail<IListElevatorsInBuildingDTO[]>('No elevators found!')) }))

        const listElevatorsInBuildingController = new ListElevatorsInBuildingController(listElevatorsInBuildingService as IListElevatorsInBuildingService)

        await listElevatorsInBuildingController.listElevatorsInBuilding(<Request>req, <Response>res, <NextFunction>next)
        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo lists 2 elevators', async function () {
        const elevatorResult1 = {
            elevatorId: elevator1.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator1.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator1.getValue().elevatorBrand.brand,
            elevatorDescription: elevator1.getValue().elevatorDescription.description,
            elevatorModel: elevator1.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator1.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO

        const elevatorResult2 = {
            elevatorId: elevator2.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator2.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator2.getValue().elevatorBrand.brand,
            elevatorDescription: elevator2.getValue().elevatorDescription.description,
            elevatorModel: elevator2.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator2.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO
        
        const expected = [elevatorResult1, elevatorResult2]

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService') as IListElevatorsInBuildingService

        const actual = await listElevatorsInBuildingService.listElevatorsInBuilding(building.getValue().code.toString())

        sinon.assert.match(actual.getValue(), expected)
    })

    it('4. Service with stub repo finds no elevators', async function () {
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building2.getValue())}))

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService') as IListElevatorsInBuildingService

        const actual = await listElevatorsInBuildingService.listElevatorsInBuilding(building2.getValue().code.toString())

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service with stub repo returns 2 elevators', async function () {
        const elevatorResult1 = {
            elevatorId: elevator1.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator1.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator1.getValue().elevatorBrand.brand,
            elevatorDescription: elevator1.getValue().elevatorDescription.description,
            elevatorModel: elevator1.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator1.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO

        const elevatorResult2 = {
            elevatorId: elevator2.getValue().id.toValue(),
            elevatorIdentificationNumber: elevator2.getValue().elevatorIdentificationNumber.identificationNumber,
            elevatorBrand: elevator2.getValue().elevatorBrand.brand,
            elevatorDescription: elevator2.getValue().elevatorDescription.description,
            elevatorModel: elevator2.getValue().elevatorModel.model,
            elevatorSerialNumber: elevator2.getValue().elevatorSerialNumber.serialNumber,
            floorsNumber: [1]
        } as IListElevatorsInBuildingDTO

        const result = [elevatorResult1, elevatorResult2]

        let req: Partial<Request> = {}
        req.params = {buildingCode: building.getValue().code.toString()}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService') as IListElevatorsInBuildingService

        const listElevatorsInBuildingController = new ListElevatorsInBuildingController(listElevatorsInBuildingService as IListElevatorsInBuildingService)

        await listElevatorsInBuildingController.listElevatorsInBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('6. Controller + Service with stub repo no elevators', async function () {
        let req: Partial<Request> = {}
        req.params = {buildingCode: building2.getValue().code.toString()}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building2.getValue())}))

        const listElevatorsInBuildingService = Container.get('listElevatorsInBuildingService') as IListElevatorsInBuildingService

        const listElevatorsInBuildingController = new ListElevatorsInBuildingController(listElevatorsInBuildingService as IListElevatorsInBuildingService)

        await listElevatorsInBuildingController.listElevatorsInBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })


})
