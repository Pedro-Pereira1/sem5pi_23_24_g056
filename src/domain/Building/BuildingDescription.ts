import { ValueObject } from '../../core/domain/ValueObject';

  
  interface BuildingDescriptionProps {
    value: string;
  }

  export class BuildingDescription extends ValueObject<BuildingDescriptionProps> {

    private constructor (props : BuildingDescriptionProps){
      super(props);
    }
    
  }
