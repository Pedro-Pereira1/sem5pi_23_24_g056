import { ValueObject } from '../../core/domain/ValueObject';

interface BuildingNameProps {
  value: string;
}

export class BuildingName extends ValueObject<BuildingNameProps> {

  constructor(props: BuildingNameProps) {
    super(props);
  }

  get name(): string {
    return this.props.value
  }
}