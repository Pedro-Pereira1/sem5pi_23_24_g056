import { ValueObject } from "../../core/domain/ValueObject";

interface IFloorNumberProps {
  number: number
}

export default class FloorNumber extends ValueObject<IFloorNumberProps> {

  constructor(floorNumberProps: IFloorNumberProps) {
    super(floorNumberProps)
  }

  get number(): number {
    return this.props.number
  }


}