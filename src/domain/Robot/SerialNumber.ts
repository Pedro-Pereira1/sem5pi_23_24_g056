import { initial } from 'lodash';
import { ValueObject } from '../../core/domain/ValueObject';
import { Result } from '../../core/logic/Result';

  
  interface SerialNumberProps {
    serialNumber: string;
  }

  export class SerialNumber extends ValueObject<SerialNumberProps> {

    private constructor (props : SerialNumberProps){
      super(props);
    }

    public static create (props : SerialNumberProps):  Result<SerialNumber> {
      if (props.serialNumber.length > 50) {
        return Result.fail<SerialNumber>('Serial Number must be less than 50 characters');
      }
      return Result.ok<SerialNumber>(new SerialNumber({ serialNumber: props.serialNumber }));
    }

    get serialNumber (): string {
      return this.props.serialNumber;
    }
    
  }
