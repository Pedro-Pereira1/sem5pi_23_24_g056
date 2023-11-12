import { Service, Inject } from "typedi";
import { Result } from "../../../core/logic/Result";
import IDeletePassagewayService from "../../IServices/passageway/delete/IDeletePassagewayService";
import IPassagewayRepo from "../../IRepos/passageway/IPassagewayRepo";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";

@Service()
export default class DeletePassagewayService implements IDeletePassagewayService {

    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo
    ) {}

    public async deleteFloor(id: number): Promise<Result<string>> {
        try {

            let floors = await this.floorRepo.findByPassageway(id)

            if (floors.length == 0) {
                return Result.fail<string>("No floors found with that passageway")
            }

            const passageway = await this.passagewayRepo.findById(id)

            if (passageway == null) {
                return Result.fail<string>("No passageway found with that id")
            }

            for (let floor of floors) {
                floor.removePassageway(passageway)
                await this.floorRepo.save(floor)
            }

            this.passagewayRepo.deletePassageway(passageway)

            return Result.ok<string>("Passageway deleted")

        } catch (err) {
            throw err
        }
    }

}
