import { ValueObject } from "../../core/domain/ValueObject"

interface IDoubleCoordsProps {
    id: (number | string)
    x: number
    y: number
    x1: number
    y1: number
}

export default class DoubleCoords extends ValueObject<IDoubleCoordsProps> {

    private constructor(props: IDoubleCoordsProps) {
        super(props)
    }

    public static create(props: IDoubleCoordsProps): DoubleCoords {
        return new DoubleCoords({
            id: props.id,
            x: props.x,
            y: props.y,
            x1: props.x1,
            y1: props.y1
        })
    }

    get id(): (number | string) {
        return this.props.id
    }

    get x(): number {
        return this.props.x
    }

    get y(): number {
        return this.props.y
    }

    get x1(): number {
        return this.props.x1
    }

    get y1(): number {
        return this.props.y1
    }
}
