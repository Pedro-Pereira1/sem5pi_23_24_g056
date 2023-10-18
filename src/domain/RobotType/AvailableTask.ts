import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';

  
  interface AvailableTaskProps {
    Type: string;
  }

  export class AvailableTask extends ValueObject<AvailableTaskProps> {

    private constructor (props : AvailableTaskProps){
      super(props);
    }
    
  }
