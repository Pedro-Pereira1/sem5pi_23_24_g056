import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { IFloorDTO } from '../../src/dto/floor/IFloorDTO';
import { Floor } from '../../src/domain/Floor/Floor';
import FloorID from '../../src/domain/Floor/FloorId';
import { FloorDescription } from '../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../src/domain/Floor/FloorMap';
import assert from 'assert';

describe("Create floor", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        let floorSchemaInstance = require('../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let floorRepoClass = require('../../src/repos/floor/floorRepo').default
        let floorRepoInstance = Container.get(floorRepoClass)
        Container.set('floorRepo', floorRepoInstance)

        let createFloorServiceClass = require('../../src/services/floor/create/createFloorService').default
        let createFloorServiceInstance = Container.get(createFloorServiceClass)
        Container.set('createFloorService', createFloorServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Floor create test valid floor', async function () {
        const floorDto = {
            floorId: 5,
            floorNumber: 1,
            floorDescription: 'Salas TPs',
            floorMap: {
                map: [[]],
                passageways: [],
                rooms: [],
                elevators: []
            }
        } as IFloorDTO

        const actualOrError = Floor.create(
            {
                floorDescription: new FloorDescription({ value: floorDto.floorDescription }),
                floorNumber: floorDto.floorNumber,
                floormap: new FloorMap(
                    {
                        map: floorDto.floorMap.map,
                        passageways: [],
                        rooms: [],
                        elevators: []
                    })
            }, floorDto.floorId
        )

        assert.equal(actualOrError.isSuccess, true)
    })

    it('Floor create test invalid floor description', async function () {

    })

    it('Floor create test invalid floor number', async function () {

    })



})