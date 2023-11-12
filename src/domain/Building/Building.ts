import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';
import { Floor } from '../Floor/Floor';
import { Result } from '../../core/logic/Result';
import { BuildingSize } from './BuildingSize';
import BuildingCode from './BuildingCode';


interface BuildingProps {
  buildingName?: BuildingName
  buildingDescription?: BuildingDescription;
  buildingSize?: BuildingSize
  floors?: Floor[];
}

export class Building extends AggregateRoot<BuildingProps> {
  private constructor(buildingCode: BuildingCode, props?: BuildingProps) {
    super(props, buildingCode);
  }

  get code(): UniqueEntityID {
    return this.id;
  }

  get name(): BuildingName {
    return this.props.buildingName
  }

  get desctription(): BuildingDescription {
    return this.props.buildingDescription
  }

  get size(): BuildingSize {
    return this.props.buildingSize
  }

  get floors(): Floor[] {
    return this.props.floors
  }

  changeName(name: string) {
    this.props.buildingName = new BuildingName({ value: name })
  }

  changeDescription(description: string) {
    this.props.buildingDescription = new BuildingDescription({ value: description })
  }

  changeSize(length: number, width: number) {
    this.props.buildingSize = new BuildingSize({ length: length, width: width })
  }

  get floorsNumber(): number[] {
    let floors: number[] = []
    this.props.floors.forEach(f => {
      floors.push(Number(f.id.toValue()))
    });
    return floors
  }

  addFloor(floor: Floor) {
    this.props.floors.push(floor)
  }

  removeFloor(floorId: number) {
    this.props.floors = this.props.floors.filter(f => f.id.toValue() !== floorId)
  }

  public static create(buildingProps: BuildingProps, buildingCode: string): Result<Building> {
    const name = buildingProps.buildingName
    const description = buildingProps.buildingDescription
    const length = buildingProps.buildingSize.length
    const width = buildingProps.buildingSize.width
    const floors = buildingProps.floors

    if (!checkName(name.name) || !checkDescription(description.description) || !checkCode(buildingCode) || !checkSize(length, width)) {
      return Result.fail<Building>('Missing paramethers')
    }
    const building = new Building(new BuildingCode(buildingCode),
      {
        buildingName: name,
        buildingDescription: description,
        buildingSize: new BuildingSize({ length: length, width: width }),
        floors: floors
      })

    return Result.ok<Building>(building)
  }
}

function checkName(name: string): boolean {
  let strRegex = new RegExp(/^[a-z0-9]+$/i);
  if (name.length > 50 || !strRegex.test(name)) {
    return false
  }

  return true
}

function checkCode(code: string): boolean {
  let strRegex = new RegExp(/^[a-z0-9 ]+$/i);
  if (!!code === false || code.length === 0 || code.length > 5 || !strRegex.test(code)) {
    return false
  }

  return true
}

function checkDescription(description: string): boolean {
  if (description.length > 255) {
    return false
  }

  return true
}

function checkSize(length: number, width: number): boolean {
  if (width < 1 || length < 1) return false

  return true
}
