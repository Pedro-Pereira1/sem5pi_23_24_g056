import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingDescription } from './BuildingDescription';
import { BuildingName } from './BuildingName';
import { Floor } from '../Floor/Floor';
import { IBuildingDTO } from '../../dto/building/IBuildingDTO';
import { Result } from '../../core/logic/Result';
import { BuildingSize } from './BuildingSize';
import BuildingCode from './BuildingCode';


interface BuildingProps {
  buildingName: BuildingName
  buildingDescription: BuildingDescription;
  buildingSize: BuildingSize
  floors: Floor[];
}

export class Building extends AggregateRoot<BuildingProps> {

  private constructor(props: BuildingProps, buildingCode: BuildingCode) {
    super(props, buildingCode);
  }

  get code(): UniqueEntityID{
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

  public static create(buildingDto: IBuildingDTO): Result<Building> {
    const name = buildingDto.buildingName
    const description = buildingDto.buildingDescription
    const code = buildingDto.buildingCode
    const length = buildingDto.buildingLength
    const width = buildingDto.buildingWidth

    if (checkName(name) || checkDescription(description) || checkCode(code) || checkSize(length, width)) {
      return Result.fail<Building>('Missing paramethers')
    }

    const building = new Building({
      buildingName: new BuildingName({value: name}),
      buildingDescription: new BuildingDescription({value: description}),
      buildingSize: new BuildingSize({length: length, width: width} ),
      floors: []
    }, new UniqueEntityID(buildingDto.buildingCode))

    return Result.ok<Building>(building)
  }
}


function checkName(name: string): boolean{
  if (!!name === false || name.length === 0 || name.length > 50 || name.search("/^[a-zA-Z0-9]+$/") === -1){
    return false
  }

  return true
}

function checkCode(code: string): boolean{
  if (!!code === false || code.length === 0 || code.length > 5 || code.search("/^[a-zA-Z0-9 ]+$/") === -1){
    return false
  }

  return true
}

function checkDescription(description: string): boolean{
  if (!!description === false || description.length === 0 || description.length > 255){
    return false
  }

  return true
}

function checkSize(length: number, width: number): boolean{
  if (!!length === false || !!width === false || width < 1 || length < 1) return false


  return true
}
