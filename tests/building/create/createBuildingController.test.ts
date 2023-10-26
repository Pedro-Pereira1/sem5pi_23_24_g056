import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import CreateBuildingController from "../../../src/controllers/building/create/createBuildingController"
import ICreateBuildingService from '../../../src/services/IServices/building/ICreateBuildingService';
import { Result } from '../../../src/core/logic/Result';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';
import { Building } from '../../../src/domain/Building/Building';
import assert from 'assert';
import { BuildingName } from '../../../src/domain/Building/BuildingName';
import { BuildingSize } from '../../../src/domain/Building/BuildingSize';
import { BuildingDescription } from '../../../src/domain/Building/BuildingDescription';
import CreateBuildingService from '../../../src/services/building/create/createBuildingService'
import IBuildingRepo from '../../../src/services/IRepos/building/IBuildingRepo';


describe("Create building", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('BuildingRepo', buildingRepoInstance)

        let createBuildingServiceClass = require('../../../src/services/building/create/createBuildingService').default
        let createBuildingServiceInstance = Container.get(createBuildingServiceClass)
        Container.set('CreateBuildingService', createBuildingServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create building test, valid building', async function () {
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


        assert.equal(building.isSuccess, true)
    })

    // Test buildingName
    it('Create building test, invalid building name (not alphanumeric)', async function () {
        const buildingDTO = {
            buildingName: "a!12",
            buildingDescription: "uma descricao",
            buildingCode: "a122",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building name (50+ carachters)', async function () {
        const buildingDTO = {
            buildingName: "asdxcvfqwsafgjmlpoikjhiujhgopilokasdfgrdchnmkjaasda",
            buildingDescription: "uma descricao",
            buildingCode: "a122",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building name (empty)', async function () {
        const buildingDTO = {
            buildingName: "",
            buildingDescription: "uma descricao",
            buildingCode: "a122",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })


    //Test buildingCode
    it('Create building test, invalid building code (not alphanumeric)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "a!#22",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building code (5+ carachters)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "123456",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building code (null)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building code (empty)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })


    //Test buildingDescription
    it('Create building test, invalid building description (255+ carachters)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            buildingCode: "a122",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building description (empty)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "",
            buildingCode: "a122",
            buildingLength: 2,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    //Test buildingSize
    it('Create building test, invalid building size (length = 0)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 0,
            buildingWidth: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })

    it('Create building test, invalid building size (width = 0)', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingWidth: 0,
            buildingLength: 2
        } as IBuildingDTO

        const building = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        assert.equal(building.isSuccess, false)
    })



    it('Controller unit test with stub service, valid building', async function () {
        let body = {
            "buildingCode": "bdgA1",
            "buildingName": "buildingTest",
            "buildingDescription": "this is a building",
            "buildingLength": 10,
            "buildingWidth": 10,
        }

        let expected = {
            "buildingCode": "bdgA1",
            "buildingName": "buildingTest",
            "buildingDescription": "this is a building",
            "buildingLength": 10,
            "buildingWidth": 10,
            "buildingFloor": "[]"
        }

        let req: Partial<Request> = {}
        req.body = body

        let res: Partial<Response> = {
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createBuildingService = Container.get('CreateBuildingService')
        sinon.stub(createBuildingService, 'createBuilding').returns(Result.ok<IBuildingDTO>({
            buildingCode: "bgdA1",
            buildingName: "buildingtest",
            buildingDescription: "this is a building",
            buildingLength: 10,
            buildingWidth: 10,
            buildingFloors: []
        } as IBuildingDTO))

        const createBuildingController = new CreateBuildingController(createBuildingService as ICreateBuildingService)

        await createBuildingController.createBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.json)
        sinon.match(expected)
    })

    it('Controller unit test with stub service, invalid building', async function () {
        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let createBuildingService = Container.get('CreateBuildingService')
        sinon.stub(createBuildingService, 'createBuilding').returns(Result.fail<Building>('Error'))

        const createBuildingController = new CreateBuildingController(createBuildingService as ICreateBuildingService)

        await createBuildingController.createBuilding(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.match(403)
    })

    it('Service unit test with mock repo, valid building', async function () {
        const buildingDTO = {
            buildingName: "EdificioA",
            buildingDescription: "uma descricao",
            buildingCode: "cod1",
            buildingLength: 2,
            buildingWidth: 2,
            buildingFloors: []
        } as IBuildingDTO

        const buildingResult = Building.create({
            buildingName: new BuildingName({ value: buildingDTO.buildingName }),
            buildingDescription: new BuildingDescription({ value: buildingDTO.buildingDescription }),
            buildingSize: new BuildingSize({ length: buildingDTO.buildingLength, width: buildingDTO.buildingWidth }),
            floors: [],
        }, buildingDTO.buildingCode)

        const building = buildingResult.getValue()

        const buildingRepoInstance = Container.get('BuildingRepo')
        const buildingRepoMock = sinon.mock(buildingRepoInstance, "save")
        buildingRepoMock.expects("save")
            .once()
            .withArgs(building)
            .returns(new Promise<Building>((resolve, reject) => { resolve(building) }))

        const createBuildingService = new CreateBuildingService(buildingRepoInstance as IBuildingRepo)

        const actual = await createBuildingService.createBuilding(buildingDTO)

        buildingRepoMock.verify()
        //assert.equal(buildingDTO, actual.getValue())
    })

    it('Service unit test with stud repo, invalid building', async function () {

    })

    it('Repo unit test, valid building', async function () {

    })

    it('Repo unit test, invalid building', async function () {

    })

    it('Controller + service integration test using BuildingRepo and Building stub', async function () {

    })

    it('Controller + service + repo integration test', async function () {

    })

})