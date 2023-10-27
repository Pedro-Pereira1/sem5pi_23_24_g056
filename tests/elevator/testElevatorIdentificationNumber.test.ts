import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import {ElevatorIdentificationNumber} from "../../src/domain/Elevator/ElevatorIdentificationNumber";

describe("Check elevator identification number", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator identification number', async function () {
        const elevatorIdentificationNumber: number = 7;
        const result: Result<ElevatorIdentificationNumber> = ElevatorIdentificationNumber.create(elevatorIdentificationNumber);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().identificationNumber,elevatorIdentificationNumber)
    })

    it('Create elevator test, elevator identification number under 0', async function () {
        const elevatorIdentificationNumber: number = -1;
        const result: Result<ElevatorIdentificationNumber> = ElevatorIdentificationNumber.create(elevatorIdentificationNumber);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator Identification Number must be a positive number')
    })

})