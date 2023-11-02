import { ValueObject } from "../../core/domain/ValueObject"

interface IdCoordsProps {
    id: (number | string)
    x: number
    y: number
    x1?: number
    y1?: number
}

export default class IdCoords extends ValueObject<IdCoordsProps> {

    private constructor(props: IdCoordsProps) {
        super(props)
    }

    public static create(props: IdCoordsProps): IdCoords {
        if (props.x1 === undefined || props.x1 === null || props.y1 === undefined || props.y1 === null) {
            return new IdCoords({
                id: props.id,
                x: props.x,
                y: props.y,
                x1: null,
                y1: null
            })
        }
        return new IdCoords({
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
        return this.x
    }

    get y(): number {
        return this.y
    }
}
