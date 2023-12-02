import { ValueObject } from "../../core/domain/ValueObject"

interface IRoomCoordsProps {
    id: string
    x: number
    y: number
    x1: number
    y1: number
}

export default class DoubleCoords extends ValueObject<IRoomCoordsProps> {

    private constructor(props: IRoomCoordsProps) {
        super(props)
    }

    public static create(props: IRoomCoordsProps): DoubleCoords {
        return new DoubleCoords({
            id: props.id,
            x: props.x,
            y: props.y,
            x1: props.x1,
            y1: props.y1
        })
    }

    get id(): string {
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
