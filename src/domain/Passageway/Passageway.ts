import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { PassagewayCoordinates } from './PassagewayCoordinates';
import { PassagewayID } from './PassagewayID';

  interface PassagewayProps {
    passagewayCoordinates: PassagewayCoordinates;
    passagewayID: PassagewayID;
  }

  export class Passageway extends AggregateRoot<PassagewayProps> {

    
    private constructor (props: PassagewayProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
