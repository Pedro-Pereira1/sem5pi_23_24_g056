import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { FloorDescription } from './FloorDescription';
import { FloorNumber } from './FloorNumber';
import { FloorMap } from './FloorMap';


  interface FloorProps {
    floorDescription: FloorDescription;
    floorNumber: FloorNumber;
    floormaps: FloorMap[];
  }

  export class Floor extends AggregateRoot<FloorProps> {

    
    private constructor (props: FloorProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
