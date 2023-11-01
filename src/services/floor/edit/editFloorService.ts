import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import ICreateFloorService from "../../IServices/floor/create/ICreateFloorService";
import config from "../../../../config";
import IFloorRepo from "../../IRepos/floor/IFloorRepo";
import { Floor } from "../../../domain/Floor/Floor";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import { FloorDescription } from "../../../domain/Floor/FloorDescription";
import { FloorMap } from "../../../domain/Floor/FloorMap";
import IBuildingRepo from "../../IRepos/building/IBuildingRepo";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { BuildingMap } from "../../../mappers/building/BuildingMap";
import { ICreateFloorDTO } from "../../../dto/floor/ICreateFloorDTO";
import BuildingCode from "../../../domain/Building/BuildingCode";
import IEditFloorService from "../../IServices/floor/edit/IEditFloorService";

@Service()
export default class EditFloorService implements IEditFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
    ) { }


    public async editFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
        try {
			
			const floor = await this.floorRepo.findById(floorDTO.floorId);

			if (floor === null) {
				return Result.fail<IFloorDTO>('Floor dont exists on system!!');
			} else {

                if (floorDTO.floorDescription) {
					const floorDescription = new FloorDescription({ value: floorDTO.floorDescription });
					floor.props.floorDescription = floorDescription;
				}

				if (floorDTO.floorNumber) {
					const floorNumber = floorDTO.floorNumber;
					floor.props.floorNumber.props.number = floorNumber;
				}
				
				
				await this.floorRepo.save(floor);

				
				const floorDTOResult = FloorMaper.toDto(floor) as IFloorDTO;
				
				return Result.ok<IFloorDTO>(floorDTOResult);
			}
		} catch (e) {
			throw e;
		}
    }

    
}
