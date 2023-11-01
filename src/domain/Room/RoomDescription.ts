import { ValueObject } from '../../core/domain/ValueObject';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';

interface RoomDescriptionProps {
    value: string;
}

export class RoomDescription extends ValueObject<RoomDescriptionProps> {
  constructor(props: RoomDescriptionProps) {
    super(props);
  }

  get description(): string {
    return this.props.value
  }

  public static create (description: string): Result<RoomDescription> {
    const guardResult = Guard.againstNullOrUndefined(description, 'roomDescription');
    if (!guardResult.succeeded) {
      return Result.fail<RoomDescription>(guardResult.message);
    } 
    
    if (description.length === 0 || !!description === false) return Result.fail<RoomDescription>('Description must be provided!')

    if (description.length > 250) return Result.fail<RoomDescription>('Description must be less than 250 characters!')
    
    return Result.ok<RoomDescription>(new RoomDescription({value: description}))
  }
}