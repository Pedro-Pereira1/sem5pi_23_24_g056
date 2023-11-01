import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import ICreateRoomService from "../../IServices/room/ICreateRoomService";
import IRoomDTO from "../../../dto/room/IRoomDTO";
import ICreateRoomDTO from "../../../dto/room/ICreateRoomDTO";
import { Room } from "../../../domain/Room/Room";
import IRoomRepo from "../../IRepos/room/IRoomRepo";
import { RoomCategory } from "../../../domain/Room/RoomCategory";
import { RoomDescription } from "../../../domain/Room/RoomDescription";
import { RoomName } from "../../../domain/Room/RoomName";
import RoomMap from "../../../mappers/room/RoomMap";

@Service()
export default class CreateRoomService implements ICreateRoomService {

    constructor(
        @Inject(config.repos.room.name) private roomRepo: IRoomRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) { }

    public async createRoom(roomDto: ICreateRoomDTO): Promise<Result<IRoomDTO>> {
        try{
            if(await this.roomRepo.findById(roomDto.roomName) !== null) throw new Error("A Room with this Name already exists!")

            const floor = await this.floorRepo.findById(roomDto.floorId)
            if (floor === null) throw new Error("Floor does not exist!")

            const roomOrError = await Room.create(
                {
                   roomDescription: RoomDescription.create(roomDto.roomDescription).getValue(),
                   roomCategory: RoomCategory.create(roomDto.roomCategory).getValue()
                }, RoomName.create(roomDto.roomName).getValue())
                
            if (roomOrError.isFailure) {
                return Result.fail<IRoomDTO>(roomOrError.errorValue())
            }
            
            const roomResult = roomOrError.getValue();
            await this.roomRepo.save(roomResult);
                        
            floor.addRoom(roomResult)

            await this.floorRepo.save(floor);

            const roomDtoResult = RoomMap.toDto(roomResult) as IRoomDTO

            return Result.ok<IRoomDTO>(roomDtoResult)

        } catch(e) {
            throw e
        }
    }
}