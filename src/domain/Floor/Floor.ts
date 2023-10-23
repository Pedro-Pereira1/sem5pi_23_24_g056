import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { FloorDescription } from './FloorDescription';
import { FloorNumber } from './FloorNumber';
import { FloorMap } from './FloorMap';


  interface FloorProps {
    floorDescription: FloorDescription;
    floormaps: FloorMap[];
  }

  export class Floor extends AggregateRoot<FloorProps> {

    private constructor (props: FloorProps, floorNumber: FloorNumber) {
      super(props, floorNumber);
    }

  }
