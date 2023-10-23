import { ValueObject } from '../../core/domain/ValueObject';

interface BuildingDescriptionProps {
  value: string;
}

export class BuildingDescription extends ValueObject<BuildingDescriptionProps> {

  constructor(props: BuildingDescriptionProps) {
    super(props);
  }

  get description(): string {
    return this.props.value
  }
}
