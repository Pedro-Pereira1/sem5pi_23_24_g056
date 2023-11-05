import {Result} from "../../src/core/logic/Result";
import assert from "assert";
import * as sinon from 'sinon';
import {RoomCategory} from "../../src/domain/Room/RoomCategory";

describe("Check room name", function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('Create room test, valid room category', async function () {
        const roomCategory: string = "Other";
        const result: Result<RoomCategory> = RoomCategory.create(roomCategory);

        assert.equal(result.isSuccess,true)
        assert.equal(result.getValue().category.toString(),roomCategory)
    })

    it('Create room test, room name over word limit (50+ words)', async function () {
        const roomCategory: string = "Test";
        const result: Result<RoomCategory> = RoomCategory.create(roomCategory);

        assert.equal(result.isFailure,true)
        assert.equal(result.error,'Category must be Office, Amphitheater, Laboratory or Other!')
    })

})