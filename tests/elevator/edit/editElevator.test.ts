import * as sinon from 'sinon';
import Container from 'typedi';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import  IElevatorDTO  from '../../../src/dto/elevator/IElevatorDTO';
import { Result } from '../../../src/core/logic/Result';
import { Response, Request, NextFunction } from 'express';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import EditElevatorService from '../../../src/services/elevator/edit/editElevatorService'
import IBuildingRepo from '../../../src/services/IRepos/building/IBuildingRepo';
import IEditElevatorService from '../../../src/services/IServices/elevator/edit/IEditElevatorService'
import EditElevatorController from "../../../src/controllers/elevator/edit/editElevatorController"
import { Floor } from '../../../src/domain/Floor/Floor';
import {ICreateFloorDTO} from '../../../src/dto/floor/ICreateFloorDTO'
import FloorNumber from '../../../src/domain/Floor/FloorNumber';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { ElevatorIdentificationNumber } from '../../../src/domain/Elevator/ElevatorIdentificationNumber';
import { ElevatorBrand } from '../../../src/domain/Elevator/ElevatorBrand';
import { ElevatorDescription } from '../../../src/domain/Elevator/ElevatorDescription';
import { ElevatorModel } from '../../../src/domain/Elevator/ElevatorModel';
import { ElevatorSerialNumber } from '../../../src/domain/Elevator/ElevatorSerialNumber';
import { ElevatorID } from '../../../src/domain/Elevator/ElevatorID';
import IEditElevatorDTO from '../../../src/dto/elevator/IEditElevatorDTO'

describe('Edit elevator test', function () {
    const original = {
        elevatorId: 1,
        elevatorIdentificationNumber: 1,
        elevatorBrand: "brand1",
        elevatorDescription: "a description",
        elevatorModel: "a model",
        elevatorSerialNumber: "111"
    } as IElevatorDTO

    const elevator = Elevator.create(
        {
            elevatorIdentificationNumber: ElevatorIdentificationNumber.create(original.elevatorIdentificationNumber).getValue(),
            elevatorBrand: ElevatorBrand.create(original.elevatorBrand).getValue(),
            elevatorDescription: ElevatorDescription.create(original.elevatorDescription).getValue(),
            elevatorModel: ElevatorModel.create(original.elevatorModel).getValue(),
            elevatorSerialNumber: ElevatorSerialNumber.create(original.elevatorSerialNumber).getValue()
        }, ElevatorID.create(original.elevatorId).getValue())


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
            elevators: [elevator.getValue()],
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
        let editElevatorServiceClass = require('../../../src/services/elevator/edit/editElevatorService').default
        let editElevatorServiceInstance = Container.get(editElevatorServiceClass)
        Container.set('editElevatorService', editElevatorServiceInstance)

        


    })
    

    it('1. Controller valid edit (elevator exist on database)', async function () {
        const serviceReturns = {
            elevatorId: 1,
            elevatorIdentificationNumber: 1,
            elevatorBrand: "brand1",
            elevatorDescription: "description changed",
            elevatorModel: "a model",
            elevatorSerialNumber: "111"
        } as IElevatorDTO

        const elevatorDTOJSONExpected = {
            "elevatorId": 1,
            "elevatorIdentificationNumber": 1,
            "elevatorBrand": "brand1",
            "elevatorDescription": "description changed",
            "elevatorModel": "a model",
            "elevatorSerialNumber": "111"
        } 

        const elevatorDTOJSON = {
            "elevatorId": 1,
            "elevatorIdentificationNumber": 1,
            "elevatorBrand": "brand1",
            "elevatorDescription": "a description",
            "elevatorModel": "a model",
            "elevatorSerialNumber": "111"
        } 

        const elevatorDTO2 = {
            elevatorId: 1,
            elevatorIdentificationNumber: 1,
            elevatorBrand: "brand1",
            elevatorDescription: "a description",
            elevatorModel: "a model",
            elevatorSerialNumber: "111"
        } as IElevatorDTO

        let req: Partial<Request> = {}
        req.body = elevatorDTOJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const editElevatorService = Container.get('editElevatorService')

        sinon.stub(editElevatorService, 'editElevator')
            .withArgs(elevatorDTO2)
            .returns(new Promise((resolve, reject) => { resolve(Result.ok<IElevatorDTO>(serviceReturns)) }))


        const editElevatorController = new EditElevatorController(editElevatorService as IEditElevatorService)

        await editElevatorController.editElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(elevatorDTOJSONExpected))
    })



    it('2. Controller valid edit (elevator doesn\'t exist on database)', async function () {
        const elevatorDTO2 = {
            elevatorId: 1,
            elevatorIdentificationNumber: 1,
            elevatorBrand: "brand1",
            elevatorDescription: "a description",
            elevatorModel: "a model",
            elevatorSerialNumber: "111"
        } as IElevatorDTO

        const elevatorDTOJSON = {
            "elevatorId": 1,
            "elevatorIdentificationNumber": 1,
            "elevatorBrand": "brand1",
            "elevatorDescription": "a description",
            "elevatorModel": "a model",
            "elevatorSerialNumber": "111"
        } 

        let req: Partial<Request> = {}
        req.body = elevatorDTOJSON 

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const editElevatorService = Container.get('editElevatorService')

        sinon.stub(editElevatorService, 'editElevator')
            .withArgs(elevatorDTO2)
            .returns(new Promise((resolve, reject) => { resolve(Result.fail<IElevatorDTO>('Elevator does not exist!')) }))


        const editElevatorController = new EditElevatorController(editElevatorService as IEditElevatorService)

        await editElevatorController.editElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service valid edit (elevator exist on database)', async function () {
        floorRepoMock.findById.resolves(floor.getValue())
        
        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const changes = {
            elevatorIdentificationNumber: 1,
            elevatorDescription: "changed description",
            buildingCode: "A"
        } as IEditElevatorDTO

        const expected = {
            elevatorId: 1,
            elevatorIdentificationNumber: 1,
            elevatorBrand: "brand1",
            elevatorDescription: "changed description",
            elevatorModel: "a model",
            elevatorSerialNumber: "111"
        } as IElevatorDTO

        const editElevatorService = Container.get('editElevatorService') as IEditElevatorService

        const actual = await editElevatorService.editElevator(changes)

        sinon.assert.match(actual.getValue(), expected)
    })

    it('4. Service invalid edit (elevator doesn\'t exist on database)', async function () {
        const changes = {
            elevatorIdentificationNumber: 2,
            elevatorDescription: "changed description",
            buildingCode: "A"
        } as IEditElevatorDTO

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const editElevatorService = Container.get('editElevatorService') as IEditElevatorService

        const actual = await editElevatorService.editElevator(changes)

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service valid edit (elevator exist on database)', async function () { 
        const changes = {
            "elevatorIdentificationNumber": 1,
            "elevatorDescription": "changed description",
            "buildingCode": "A"
        }

        const expected = {
            elevatorId: 1,
            elevatorIdentificationNumber: 1,
            elevatorBrand: "brand1",
            elevatorDescription: "changed description",
            elevatorModel: "a model",
            elevatorSerialNumber: "111"
        } as IElevatorDTO

        let req: Partial<Request> = {}
        req.body = changes 

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const editElevatorService = Container.get('editElevatorService') as IEditElevatorService

        const editElevatorController = new EditElevatorController(editElevatorService as IEditElevatorService)

        await editElevatorController.editElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(expected))
    })

    it('6. Controller + Service invalid edit (elevator doesn\'t exist on database)', async function () { 
        const changes = {
            "elevatorIdentificationNumber": 2,
            "elevatorDescription": "changed description",
            "buildingCode": "A"
        } 

        let req: Partial<Request> = {}
        req.body = changes

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => {}

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building.getValue())}))

        const editElevatorService = Container.get('editElevatorService')

        const editElevatorController = new EditElevatorController(editElevatorService as IEditElevatorService)

        await editElevatorController.editElevator(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

})