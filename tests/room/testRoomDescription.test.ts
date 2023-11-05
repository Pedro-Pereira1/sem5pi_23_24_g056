import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import * as sinon from 'sinon';
import {RoomDescription} from "../../src/domain/Room/RoomDescription";

describe("Check room description", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create room test, valid room description', async function () {
        const roomDescription: string = 'Apple';
        const result: Result<RoomDescription> = RoomDescription.create(roomDescription);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().description,roomDescription)
    })

    it('Create room test, room description over word limit (250+ words)', async function () {
        const roomDescription: string = 'A'.repeat(251);
        const result: Result<RoomDescription> = RoomDescription.create(roomDescription);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Description must be less than 250 characters!')
    })

    it('Create room test, room description empty', async function () {
        const roomDescription: string = '';
        const result: Result<RoomDescription> = RoomDescription.create(roomDescription);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Description must be provided!')
    })

})