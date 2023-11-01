import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface RoomCategoryProps {
    value: string;
}

export class RoomCategory extends ValueObject<RoomCategoryProps> {
  constructor(props: RoomCategoryProps) {
    super(props);
  }

  get category(): string {
    return this.props.value
  }

  public static create (category: string): Result<RoomCategory> {
    const guardResult = Guard.againstNullOrUndefined(category, 'roomCategory');
    if (!guardResult.succeeded) {
      return Result.fail<RoomCategory>(guardResult.message);
    } 
    
    if (category !== "Office" && category !== "Amphitheater" && category !== "Laboratory" && category !== "Other") {
      return Result.fail<RoomCategory>('Category must be Office, Amphitheater, Laboratory or Other!');
    }

      return Result.ok<RoomCategory>(new RoomCategory({value : category}))
  }
}