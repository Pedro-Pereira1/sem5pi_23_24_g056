import { Repo } from "../../../core/infra/Repo";
import { Passageway } from "../../../domain/Passageway/Passageway";

export default interface IPassagewayRepo extends Repo<Passageway> {
    save(passageway: Passageway): Promise<Passageway>
    findById(number: number): Promise<Passageway>
    deletePassageway(passageway: Passageway): Promise<boolean>
}