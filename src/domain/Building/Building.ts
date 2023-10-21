import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';
import { Floor } from '../Floor/Floor';

interface BuildingProps {
  buildingName: BuildingName
  buildingDescription: BuildingDescription;
  floors: Floor[];
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

}
