import { ValueObject } from '../../core/domain/ValueObject';

interface BuildingSizeProps {
  length: number;
  width: number;
}

export class BuildingSize extends ValueObject<BuildingSizeProps> {

  constructor(props: BuildingSizeProps) {
    super(props);
  }

  get width(): number {
    return this.props.width
  }

  get length(): number {
    return this.props.length
  }
}