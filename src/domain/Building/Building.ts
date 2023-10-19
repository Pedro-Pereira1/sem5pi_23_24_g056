import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';
import { Floor } from '../Floor/Floor';

  interface BuildingProps {
    buildingDescription: BuildingDescription;
    buildingName: BuildingName;
    floors: Floor[];
  }

  export class Building extends AggregateRoot<BuildingProps> {

    
    private constructor (props: BuildingProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
