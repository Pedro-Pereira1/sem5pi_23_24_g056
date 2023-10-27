import * as sinon from 'sinon';
import { ElevatorBrand } from '../../src/domain/Elevator/ElevatorBrand';
import { Result } from '../../src/core/logic/Result';

describe("Check elevator brand", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create elevator test, valid elevator brand', async function () {
        const elevatorBrand: string = 'Apple';
        const result: Result<ElevatorBrand> = ElevatorBrand.create(elevatorBrand);

        expect(result.isSuccess).toBe(true)
        expect(result.getValue().brand).toBe(elevatorBrand)
    })

    it('Create elevator test, elevator brand over word limit (50+ words)', async function () {
        const elevatorBrand: string = 'A'.repeat(51);
        const result: Result<ElevatorBrand> = ElevatorBrand.create(elevatorBrand);

        expect(result.isFailure).toBe(true)
        expect(result.error).toBe('Elevator brand must be shorter than 50 words')
    })

})