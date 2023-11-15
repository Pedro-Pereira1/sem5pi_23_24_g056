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
import { IEditFloorDTO } from "../../../dto/floor/IEditFloorDTO";
import FloorNumber from "../../../domain/Floor/FloorNumber";

@Service()
export default class EditFloorService implements IEditFloorService {

    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
		@Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }


    public async editFloor(floorDTO: IEditFloorDTO): Promise<Result<IFloorDTO>> {
        try {
			
			const floor = await this.floorRepo.findById(floorDTO.floorId);

			if (floor === null) {
				return Result.fail<IFloorDTO>('Floor dont exists on system!!');
			} else {

				if(floorDTO.floorNumber !== undefined && floorDTO.floorNumber !== floor.props.floorNumber.props.number) {
				
					const building = await this.buildingRepo.findByFloorId(floorDTO.floorId)
            		for (let i = 0; i < building.floors.length; i++) {
						const floor = await this.floorRepo.findById(building.floorsNumber[i])
                		if (floor.floorNumber.props.number == floorDTO.floorNumber) {
                	    	return Result.fail<IFloorDTO>("Floor number already exists")
                		}
           			}
				}

                if (floorDTO.floorDescription !== undefined) {
					const floorDescription = new FloorDescription({ value: floorDTO.floorDescription });
					floor.props.floorDescription = floorDescription;
				}

				if (floorDTO.floorNumber !== undefined) {
					const floorNumber = new FloorNumber({ number: floorDTO.floorNumber });
					floor.props.floorNumber = floorNumber;
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
