import * as sinon from 'sinon';
import Container from 'typedi';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { Result } from '../../../src/core/logic/Result';
import EditBuildingController from '../../../src/controllers/building/edit/EditBuildingController'
import IEditBuildingService from '../../../src/services/IServices/building/IEditBuildingService';
import { Response, Request, NextFunction } from 'express';
import { Building } from '../../../src/domain/Building/Building';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import EditBuildingService from '../../../src/services/building/edit/EditBuildingService'
import IBuildingRepo from '../../../src/services/IRepos/building/IBuildingRepo';

describe.only('Edit building test', function () {

    beforeEach(function () {
        Container.reset()

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        let editBuildingServiceClass = require('../../../src/services/building/edit/EditBuildingService').default
        let editBuildingServiceInstance = Container.get(editBuildingServiceClass)
        Container.set('editBuildingService', editBuildingServiceInstance)
    })

    it('1. Controller valid edit (building exist on database)', async function () {
        const serviceReturns = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingDTOJSONExpected = {
            "buildingName": "EdificioA",
            "buildingDescription": "uma descricao",
            "buildingCode": "cod1",
            "buildingLength": 2,
            "buildingWidth": 2,
            "buildingFloors": []
        } 

        const buildingDTOJSON = {
            "buildingName": "EdificioB",
            "buildingDescription": "uma descricao",
            "buildingCode": "cod1",
            "buildingLength": 2,
            "buildingWidth": 2,
            "buildingFloors": []
        } 

        const buildingDTO2 = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        let req: Partial<Request> = {}
        req.body = buildingDTOJSON

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const editBuildingService = Container.get('editBuildingService')

        sinon.stub(editBuildingService, 'editBuilding')
            .withArgs(buildingDTO2)
            .returns(new Promise((resolve, reject) => { resolve(Result.ok<IBuildingDTO>(serviceReturns)) }))


        const editBuildingController = new EditBuildingController(editBuildingService as IEditBuildingService)

        await editBuildingController.editBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(buildingDTOJSONExpected))
    })



    it('2. Controller valid edit (building doesn\'t exist on database)', async function () {
        const buildingDTO2 = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingDTOJSON = {
            "buildingName": "EdificioB",
            "buildingDescription": "uma descricao",
            "buildingCode": "cod1",
            "buildingLength": 2,
            "buildingWidth": 2,
            "buildingFloors": []
        } 

        let req: Partial<Request> = {}
        req.body = buildingDTOJSON 

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const editBuildingService = Container.get('editBuildingService')

        sinon.stub(editBuildingService, 'editBuilding')
            .withArgs(buildingDTO2)
            .returns(new Promise((resolve, reject) => { resolve(Result.fail<IBuildingDTO>('null')) }))

        const editBuildingController = new EditBuildingController(editBuildingService as IEditBuildingService)

        await editBuildingController.editBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service valid edit (building exist on database)', async function () {
        const original = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const after = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const building1 = Building.create({
            buildingName: new BuildingName({ value: original.buildingName }),
            buildingDescription: new BuildingDescription({ value: original.buildingDescription }),
            buildingSize: new BuildingSize({ length: original.buildingLength, width: original.buildingWidth }),
            floors: [],
        }, original.buildingCode)

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building1.getValue())}))
        sinon.stub(buildingRepo, 'save')

        const editBuildingService = new EditBuildingService(buildingRepo as IBuildingRepo)

        const actual = await editBuildingService.editBuilding(after)

        sinon.assert.match(actual.getValue(), after)
    })

    it('4. Service invalid edit (building doesn\'t exist on database)', async function () {
        const after = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(null)}))
        sinon.stub(buildingRepo, 'save')

        const editBuildingService = new EditBuildingService(buildingRepo as IBuildingRepo)

        const actual = await editBuildingService.editBuilding(after)

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service valid edit (building exist on database)', async function () { 
        const original = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const building1 = Building.create({
            buildingName: new BuildingName({ value: original.buildingName }),
            buildingDescription: new BuildingDescription({ value: original.buildingDescription }),
            buildingSize: new BuildingSize({ length: original.buildingLength, width: original.buildingWidth }),
            floors: [],
        }, original.buildingCode)

        const after = {
            "buildingName": "EdificioB",
            "buildingDescription": "uma descricao",
            "buildingCode": "cod1",
            "buildingLength": 2,
            "buildingWidth": 2,
            "buildingFloors": []
        } 

        let req: Partial<Request> = {}
        req.body = after 

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(building1.getValue())}))
        sinon.stub(buildingRepo, 'save')

        const editBuildingService = new EditBuildingService(buildingRepo as IBuildingRepo)

        const editBuildingController = new EditBuildingController(editBuildingService as IEditBuildingService)

        await editBuildingController.editBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(after))
    })

    it('6. Controller + Service invalid edit (building doesn\'t exist on database)', async function () { 
        const after = {
            "buildingName": "EdificioB",
            "buildingDescription": "uma descricao",
            "buildingCode": "cod1",
            "buildingLength": 2,
            "buildingWidth": 2,
            "buildingFloors": []
        } 

        let req: Partial<Request> = {}
        req.body = after

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => {}

        const buildingRepo = Container.get('buildingRepo')
        sinon.stub(buildingRepo, 'findByBuidingCode').returns(new Promise((resolve, reject) => {resolve(null)}))
        sinon.stub(buildingRepo, 'save')

        const editBuildingService = Container.get('editBuildingService')

        const editBuildiongController = new EditBuildingController(editBuildingService as IEditBuildingService)

        await editBuildiongController.editBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

})