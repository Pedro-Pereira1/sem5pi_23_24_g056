import { AggregateRoot } from '../core/domain/AggregateRoot';
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';

interface BuildingProps {
  buildingDescription: BuildingDescription;
  buildingName: BuildingName;


}

export class Building extends AggregateRoot<BuildingProps> {

}
