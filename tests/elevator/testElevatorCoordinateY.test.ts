import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import {ElevatorCoordinateY} from "../../src/domain/Elevator/ElevatorCoordinateY";

describe("Check elevator coordinate Y", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator coordinate Y', async function () {
        const elevatorCoordinateY: number = 6;
        const buildingLines: number = 8;
        const result: Result<ElevatorCoordinateY> = ElevatorCoordinateY.create(elevatorCoordinateY, buildingLines);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().y,elevatorCoordinateY)
    })

    it('Create elevator test, elevator coordinate Y under 0', async function () {
        const elevatorCoordinateY: number = -1;
        const buildingLines: number = 8;
        const result: Result<ElevatorCoordinateY> = ElevatorCoordinateY.create(elevatorCoordinateY,buildingLines);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator Position Y must be a positive number')
    })

    it('Create elevator test, elevator coordinate Y over max number of lines', async function () {
        const elevatorCoordinateY: number = 8;
        const buildingLines: number = 8;
        const result: Result<ElevatorCoordinateY> = ElevatorCoordinateY.create(elevatorCoordinateY,buildingLines);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator Position Y must be lower than ' + buildingLines)
    })

})