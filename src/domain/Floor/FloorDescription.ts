import { ValueObject } from '../../core/domain/ValueObject';

  
  interface FloorDescriptionProps {
    value: string;
  }

  export class FloorDescription extends ValueObject<FloorDescriptionProps> {

    private constructor (props : FloorDescriptionProps){
      super(props);
    }
    
  }
