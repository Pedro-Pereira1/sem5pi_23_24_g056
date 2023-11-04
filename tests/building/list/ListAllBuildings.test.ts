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


describe('List All buildings test', function () {

    beforeEach(function () {
        Container.reset()

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        let listAllBuildingsServiceClass = require('../../../src/services/building/list/listAllBuildingsService').default
        let listAllBuildingsinstance = Container.get(listAllBuildingsServiceClass)
        Container.set('listAllBuildingsService', listAllBuildingsinstance)
    })

    it('1. Controller with stub service 2 buildings', async function () {
        const buildingDTO1 = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingDTO2 = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod2",
            buildingLength: 3,
            buildingWidth: 3,
            buildingFloors: []
        } as IBuildingDTO

        const result = [buildingDTO1, buildingDTO2]

        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listAllBuildingsService = Container.get('listAllBuildingsService')
        sinon.stub(listAllBuildingsService, 'listAllBuildings').returns(new Promise((resolve, reject) => { resolve(Result.ok<IBuildingDTO[]>(result)) }))

        const listAllBuildingsController = new ListAllBuildingsController(listAllBuildingsService as IListAllBuildingsService)

        await listAllBuildingsController.listAllBuildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('2. Controller with stub service no buildings', async function () {
        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listAllBuildingsService = Container.get('listAllBuildingsService')
        sinon.stub(listAllBuildingsService, 'listAllBuildings').returns(new Promise((resolve, reject) => { resolve(Result.fail<IBuildingDTO[]>('null')) }))

        const listAllBuildingsController = new ListAllBuildingsController(listAllBuildingsService as IListAllBuildingsService)

        await listAllBuildingsController.listAllBuildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 404)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo 2 buildings', async function () {
        const buildingDTO1 = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingDTO2 = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod2",
            buildingLength: 3,
            buildingWidth: 3,
            buildingFloors: []
        } as IBuildingDTO

        const expected = [buildingDTO1, buildingDTO2]

        const building1 = Building.create({
            buildingName: new BuildingName({ value: buildingDTO1.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO1.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO1.buildingLength, width: buildingDTO1.buildingWidth }),
            floors: [],
        }, buildingDTO1.buildingCode)

        const building2 = Building.create({
            buildingName: new BuildingName({ value: buildingDTO2.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO2.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO2.buildingLength, width: buildingDTO2.buildingWidth }),
            floors: [],
        }, buildingDTO2.buildingCode)

        const repoReturns = [building1.getValue(), building2.getValue()]

        const listAllBuildingsRepo = Container.get('buildingRepo')
        sinon.stub(listAllBuildingsRepo, 'findAll').returns(new Promise((resolve, reject) => { resolve(repoReturns) }))

        const listAllBuildingsService = new ListAllBuildingsService(listAllBuildingsRepo as IBuildingRepo)

        const actual = await listAllBuildingsService.listAllBuildings()

        sinon.assert.match(actual.getValue(), expected)
    })

    it('4. Service with stub repo no buildings', async function () {
        const listAllBuildingsRepo = Container.get('buildingRepo')
        sinon.stub(listAllBuildingsRepo, 'findAll').returns(new Promise((resolve, reject) => { resolve([]) }))

        const listAllBuildingsService = new ListAllBuildingsService(listAllBuildingsRepo as IBuildingRepo)

        const actual = await listAllBuildingsService.listAllBuildings()

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service with stub repo 2 buildings', async function () {
        const buildingDTO1 = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingDTO2 = {
            buildingName: "EdificioB",
            buildingDescription: "uma descricao",
            buildingCode: "cod2",
            buildingLength: 3,
            buildingWidth: 3,
            buildingFloors: []
        } as IBuildingDTO

        const resultExpected = [buildingDTO1, buildingDTO2]

        const building1 = Building.create({
            buildingName: new BuildingName({ value: buildingDTO1.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO1.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO1.buildingLength, width: buildingDTO1.buildingWidth }),
            floors: [],
        }, buildingDTO1.buildingCode)

        const building2 = Building.create({
            buildingName: new BuildingName({ value: buildingDTO2.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO2.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO2.buildingLength, width: buildingDTO2.buildingWidth }),
            floors: [],
        }, buildingDTO2.buildingCode)

        const repoReturns = [building1.getValue(), building2.getValue()]

        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const listAllBuildingsRepo = Container.get('buildingRepo')
        sinon.stub(listAllBuildingsRepo, 'findAll').returns(new Promise((resolve, reject) => { resolve(repoReturns) }))

        const listAllBuildingsService = new ListAllBuildingsService(listAllBuildingsRepo as IBuildingRepo)

        const listAllBuildingsController = new ListAllBuildingsController(listAllBuildingsService as IListAllBuildingsService)

        await listAllBuildingsController.listAllBuildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(resultExpected))
    })

    it('6. Controller + Service with stub repo no buildings', async function () {
        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const listAllBuildingsRepo = Container.get('buildingRepo')
        sinon.stub(listAllBuildingsRepo, 'findAll').returns(new Promise((resolve, reject) => { resolve([]) }))

        const listAllBuildingsService = new ListAllBuildingsService(listAllBuildingsRepo as IBuildingRepo)

        const listAllBuildingsController = new ListAllBuildingsController(listAllBuildingsService as IListAllBuildingsService)

        await listAllBuildingsController.listAllBuildings(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 404)
        sinon.assert.calledOnce(res.send)
    })


})
