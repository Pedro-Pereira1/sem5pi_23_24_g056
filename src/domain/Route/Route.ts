import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Path } from './Path';


  interface RootProps {
  }

  export class Root extends AggregateRoot<RootProps> {

    
    private constructor (props: RootProps, id?: UniqueEntityID) {
      super(props, id);
    }

  }
