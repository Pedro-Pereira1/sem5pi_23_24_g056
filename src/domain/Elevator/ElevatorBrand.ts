import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface ElevatorBrandProps {
  brand: string;
}

export class ElevatorBrand extends ValueObject<ElevatorBrandProps> {

  private constructor(props: ElevatorBrandProps) {
    super(props);
  }

  get brand(): string {
    return this.props.brand
  }

  public static create (brand: string): Result<ElevatorBrand> {
    const guardResult = Guard.againstNullOrUndefined(brand, 'brand');
    if (!guardResult.succeeded) {
      return Result.fail<ElevatorBrand>(guardResult.message);
    } else {
      return Result.ok<ElevatorBrand>(new ElevatorBrand({ brand: brand }))
    }
  }
}