import { ValueObject } from "../../core/domain/ValueObject"

interface ISingleCoordsProps {
    id: number
    x: number
    y: number
    orientation: number
}

export default class DoubleCoords extends ValueObject<ISingleCoordsProps> {

    private constructor(props: ISingleCoordsProps) {
        super(props)
    }

    public static create(props: ISingleCoordsProps): DoubleCoords {
        return new DoubleCoords({
            id: props.id,
            x: props.x,
            y: props.y,
            orientation: props.orientation
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

    get orientation(): number {
        return this.props.orientation
    }

}
