import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorBrandProps {
  brand: string;
}

export class ElevatorBrand extends ValueObject<ElevatorBrandProps> {

  constructor(props: ElevatorBrandProps) {
    super(props);
  }

  get brand(): string {
    return this.props.brand
  }

  public static create (elevatorBrand: string): Result<ElevatorBrand> {
    const guardResult = Guard.againstNullOrUndefined(elevatorBrand, 'brand');
    let strRegex = new RegExp(/^[a-z0-9 ]+$/i);

    if (!guardResult.succeeded) {
      return Result.fail<ElevatorBrand>(guardResult.message);
    }

    if(!strRegex.test(elevatorBrand)){
      return Result.fail<ElevatorBrand>('Brand must be alphanumeric');
    }

    if(elevatorBrand.length>50){
      return Result.fail<ElevatorBrand>('Elevator brand must be shorter than 50 words');
    }

      return Result.ok<ElevatorBrand>(new ElevatorBrand({ brand: elevatorBrand }))
  }
}