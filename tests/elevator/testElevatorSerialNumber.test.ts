import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import {ElevatorSerialNumber} from "../../src/domain/Elevator/ElevatorSerialNumber";

describe("Check elevator serial number", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator serial number', async function () {
        const elevatorSerialNumber: string = 'Apple';
        const result: Result<ElevatorSerialNumber> = ElevatorSerialNumber.create(elevatorSerialNumber);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().serialNumber,elevatorSerialNumber)
    })

    it('Create elevator test, elevator serial number over word limit (50+ words)', async function () {
        const elevatorSerialNumber: string = 'A'.repeat(51);
        const result: Result<ElevatorSerialNumber> = ElevatorSerialNumber.create(elevatorSerialNumber);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator serial number must be shorter than 50 words')
    })

})