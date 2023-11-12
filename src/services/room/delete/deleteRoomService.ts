import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import IRoomRepo from "../../IRepos/room/IRoomRepo";
import IDeleteRoomService from "../../IServices/room/IDeleteRoomService";

@Service()
export default class DeleteRoomService implements IDeleteRoomService {

    constructor(
        @Inject(config.repos.room.name) private roomRepo: IRoomRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async deleteRoom(roomId: string): Promise<Result<string>> {
        try{
            const room = await this.roomRepo.findById(roomId)
            if(room === null) return Result.fail<string>('This Room does not exist!')

            const floor = await this.floorRepo.findByRoom(roomId) 
            if (floor !== null) {
                const roomIndex = floor.props.floormap.props.rooms.findIndex((aRoom) => aRoom.id.toValue() === roomId)
                if (roomIndex !== -1) {
                    floor.props.floormap.props.rooms.splice(roomIndex, 1)
                }
            }
            await this.floorRepo.save(floor);

            if(await this.roomRepo.delete(roomId) === false) return Result.fail<string>('Error deleting Room!')
            return Result.ok<string>("Room deleted!")

        } catch(e) {
            throw e
        }
    }
}