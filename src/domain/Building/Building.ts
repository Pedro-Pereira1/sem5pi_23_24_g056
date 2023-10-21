import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';
import { Floor } from '../Floor/Floor';
import { IBuildingDTO } from '../../dto/building/IBuildingDTO';
import { Result } from '../../core/logic/Result';

interface BuildingProps {
  buildingName: BuildingName
  buildingDescription: BuildingDescription;
  //floors: Floor[];
}

export class Building extends AggregateRoot<BuildingProps> {

  private constructor(props: BuildingProps, id: UniqueEntityID) {
    super(props, id);
  }

  get name(): BuildingName {
    return this.props.buildingName
  }

  get desctription(): BuildingDescription {
    return this.props.buildingDescription
  }


  public static create(buildingDto: IBuildingDTO, id: UniqueEntityID): Result<Building> {
    const name = buildingDto.buildingName
    const description = buildingDto.buildingDescription

    if (!!name === false || !!description === false || name.length === 0 || description.length === 0) {
      return Result.fail<Building>('Missing paramethers')
    }

    const building = new Building({
      buildingName: new BuildingName(name),
      buildingDescription: new BuildingDescription({value: description})
    }, id)

    return Result.ok<Building>(building)
  }
}
