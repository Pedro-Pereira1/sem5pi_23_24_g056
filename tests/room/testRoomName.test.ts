import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import * as sinon from 'sinon';
import {RoomName} from "../../src/domain/Room/RoomName";

describe("Check room name", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create room test, valid room name', async function () {
        const roomName: string = 'room';
        const result: Result<RoomName> = RoomName.create(roomName);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().toString(),roomName)
    })

    it('Create room test, room name over word limit (50+ words)', async function () {
        const roomName: string = 'A'.repeat(51);
        const result: Result<RoomName> = RoomName.create(roomName);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Name must be less than 50 characters!')
    })

    it('Create room test, room name empty', async function () {
        const roomName: string = '';
        const result: Result<RoomName> = RoomName.create(roomName);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Name must be provided!')
    })

})