import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import {ElevatorModel} from "../../src/domain/Elevator/ElevatorModel";

describe("Check elevator model", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator model', async function () {
        const elevatorModel: string = 'Apple';
        const result: Result<ElevatorModel> = ElevatorModel.create(elevatorModel);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().model,elevatorModel)
    })

    it('Create elevator test, elevator model over word limit (50+ words)', async function () {
        const elevatorModel: string = 'A'.repeat(51);
        const result: Result<ElevatorModel> = ElevatorModel.create(elevatorModel);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Elevator model must be shorter than 50 words')
    })

})