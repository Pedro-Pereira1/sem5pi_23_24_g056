import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import {ElevatorCoordinateX} from "../../src/domain/Elevator/ElevatorCoordinateX";

describe("Check elevator coordinate X", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator coordinate X', async function () {
        const elevatorCoordinateX: number = 5;
        const buildingColumns: number = 8;
        const result: Result<ElevatorCoordinateX> = ElevatorCoordinateX.create(elevatorCoordinateX, buildingColumns);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().x,elevatorCoordinateX)
    })

    it('Create elevator test, elevator coordinate X under 0', async function () {
        const elevatorCoordinateX: number = -1;
        const buildingColumns: number = 8;
        const result: Result<ElevatorCoordinateX> = ElevatorCoordinateX.create(elevatorCoordinateX,buildingColumns);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator Position X must be a positive number')
    })

    it('Create elevator test, elevator coordinate X over max number of columns', async function () {
        const elevatorCoordinateX: number = 8;
        const buildingColumns: number = 8;
        const result: Result<ElevatorCoordinateX> = ElevatorCoordinateX.create(elevatorCoordinateX,buildingColumns);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator Position X must be lower than ' + buildingColumns)
    })

})