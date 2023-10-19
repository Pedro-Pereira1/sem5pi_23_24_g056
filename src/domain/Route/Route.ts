import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Path } from './Path';


  interface RouteProps {
  }

  export class Route extends AggregateRoot<RouteProps> {

    
    private constructor (props: RouteProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
