import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import CreateBuildingController from "../../../src/controllers/building/create/createBuildingController"
import ICreateBuildingService from '../../../src/services/IServices/building/ICreateBuildingService';
import { Result } from '../../../src/core/logic/Result';
import { IBuildingDTO } from '../../../src/dto/building/IBuildingDTO';


describe("Create buildong controller", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        let buildingSchemaInstance = require('../src/persistence/schemas/building/buildingSchema').default()
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('BuildingRepo', buildingRepoInstance)

        let createBuildingServiceClass = require('../src/services/building/create/createBuildingService')
        let createBuildingServiceInstance = Container.get(createBuildingServiceClass)
        Container.set('CreateBuildingService', createBuildingServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create building test, valid building', async function () {

    })

    it('Create building test, invalid building name', async function () {

    })

    it('Create building test, invalid building description', async function () {

    })

    it('Create building test, invalid building code', async function () {

    })

    it('Controller unit test with stub service, valid building', async function () {
        let body = {
            "buildingName": 'buildingA',
            "buildingDescription": 'This is a building',
        }
        let req: Partial<Request> = {}
        req.body = body

        let res: Partial<Response> = {
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        let buildingRepo = Container.get('BuildingRepo')

        let createBuildingService = Container.get('CreateBuildingService')
        //sinon.stub(createBuildingService, 'createBuilding').returns(Result.ok<IBuildingDTO>({
        //    "buildingName": 'buildingA',
        //    "buildingDescription": 'This is a building',
        //}))

        const createBuildingController = new CreateBuildingController(createBuildingService as ICreateBuildingService)

        //await createBuildingController.createBuilding(<Request>req, <Response>res)

    })

    it('Controller unit test with stub service, invalid building', async function () {

    })

    it('Service unit test with stud repo, valid building', async function () {

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