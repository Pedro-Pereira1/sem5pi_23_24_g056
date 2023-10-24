import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';

describe("Create buildong controller", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        let floorSchemaInstance = require('../../src/persistence/schemas/floor/floorSchema').default()
        Container.set('floorSchema', floorSchemaInstance)

        let floorRepoClass = require('../../src/repos/floor/floorRepo').default
        let floorRepoInstance = Container.get(floorRepoClass)
        Container.set('FLoorRepo', floorRepoInstance)

        let createFloorServiceClass = require('../../src/services/floor/create/createFloorService')
        let createFloorServiceInstance = Container.get(createFloorServiceClass)
        Container.set('CreateBuildingService', createFloorServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
    });





})