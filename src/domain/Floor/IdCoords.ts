import { ValueObject } from "../../core/domain/ValueObject"

interface IdCoordsProps {
  id: (number | string)
  x: number
  y: number
}

export default class IdCoords extends ValueObject<IdCoordsProps> {

    constructor(props: IdCoordsProps) {
        super(props)
    }

    get id(): (number | string) {
        return this.props.id
    }

    get x(): number {
        return this.x
    }

    get y(): number {
        return this.y
    }
}
