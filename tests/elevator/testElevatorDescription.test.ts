import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import {ElevatorDescription} from "../../src/domain/Elevator/ElevatorDescription";
import assert from "assert";

describe("Check elevator description", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator description', async function () {
        const elevatorDescription: string = 'Apple';
        const result: Result<ElevatorDescription> = ElevatorDescription.create(elevatorDescription);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().description,elevatorDescription)
    })

    it('Create elevator test, elevator description over word limit (255+ words)', async function () {
        const elevatorDescription: string = 'A'.repeat(256);
        const result: Result<ElevatorDescription> = ElevatorDescription.create(elevatorDescription);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator description must be shorter than 255 words')
    })

})