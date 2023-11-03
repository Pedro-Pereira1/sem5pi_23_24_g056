import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Floor } from '../../../src/domain/Floor/Floor';
import { FloorDescription } from '../../../src/domain/Floor/FloorDescription';
import { FloorMap } from '../../../src/domain/Floor/FloorMap';
import assert from 'assert';
import { Elevator } from '../../../src/domain/Elevator/Elevator';
import { Room } from '../../../src/domain/Room/Room';
import { Passageway } from '../../../src/domain/Passageway/Passageway';
import { Result } from '../../../src/core/logic/Result';


describe.only("Create floor", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        let buildingSchemaInstance = require('../../../src/persistence/schemas/building/buildingSchema').default
        Container.set('buildingSchema', buildingSchemaInstance)

        let buildingRepoClass = require('../../../src/repos/building/buildingRepo').default
        let buildingRepoInstance = Container.get(buildingRepoClass)
        Container.set('buildingRepo', buildingRepoInstance)

        let createBuildingServiceClass = require('../../../src/services/building/create/createBuildingService').default
        let createBuildingServiceInstance = Container.get(createBuildingServiceClass)
        Container.set('createBuildingService', createBuildingServiceInstance)

        let floorSchemaInstance = require('../../../src/persistence/schemas/floor/floorSchema').default
        Container.set('floorSchema', floorSchemaInstance)

        let floorRepoClass = require('../../../src/repos/floor/floorRepo').default
        let floorRepoInstance = Container.get(floorRepoClass)
        Container.set('floorRepo', floorRepoInstance)

        let createFloorServiceClass = require('../../../src/services/floor/create/createFloorService').default
        let createFloorServiceInstance = Container.get(createFloorServiceClass)
        Container.set('createFloorService', createFloorServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should create a valid floor', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'Test floor' }),
          floorNumber: 1,
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
          }),
        };
        const floorId = 5;
        const result = Floor.create(floorProps, floorId);
        
        assert(result.isSuccess);
        assert(result.getValue().description.description === 'Test floor');
        assert(result.getValue().id.toValue() === 5);
        assert(result.getValue().map.props.map.length === 1);
        assert(result.getValue().map.props.passageways.length === 0);
        assert(result.getValue().map.props.rooms.length === 0);
        assert(result.getValue().map.props.elevators.length === 0);
        
      });
  
      it('should fail to create a floor with negative id', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'Test floor' }),
          floorNumber: 1,
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
          }),
        };
        const floorId = -1;
        const result = Floor.create(floorProps, floorId);
        
        assert(result.isFailure);
        assert(result.error === 'Invalid floor');
      });
  
      it('should fail to create a floor with description longer than 250 characters', function () {
        const floorProps = {
          floorDescription: new FloorDescription({ value: 'a'.repeat(251) }),
          floorNumber: 1,
          floormap: new FloorMap({
            map: [[]],
            passageways: [],
            rooms: [],
            elevators: [],
          }),
        };
        const floorId = 5;
        const result = Floor.create(floorProps, floorId);
        
        assert(result.isFailure);
        assert(result.error === 'Invalid floor');
      });
  
});