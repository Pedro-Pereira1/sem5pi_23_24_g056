import * as sinon from 'sinon';
import {Result} from "../../src/core/logic/Result";
import {ElevatorDescription} from "../../src/domain/Elevator/ElevatorDescription";

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

        expect(result.isSuccess).toBe(true)
        expect(result.getValue().description).toBe(elevatorDescription)
    })

    it('Create elevator test, elevator description over word limit (255+ words)', async function () {
        const elevatorDescription: string = 'A'.repeat(256);
        const result: Result<ElevatorDescription> = ElevatorDescription.create(elevatorDescription);

        expect(result.isFailure).toBe(true)
        expect(result.error).toBe('Elevator description must be shorter than 255 words')
    })

})