import { Inject, Service } from "typedi";
import IFloorRepo from "../../services/IRepos/floor/IFloorRepo";
import { Floor } from "../../domain/Floor/Floor";
import IFloorPersistence from "../../dataschema/floor/IFloorPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import FloorNumber from "../../domain/Floor/FloorId";
import { FloorMaper } from "../../mappers/floor/FloorMaper";

@Service()
export default class FloorRepo implements IFloorRepo {

  constructor(
    @Inject('floorSchema') private floorSchema: Model<IFloorPersistence & Document>
  ) { }

  async exists(floor: Floor): Promise<boolean> {
    const idX = floor.number instanceof FloorNumber ? (<FloorNumber>floor.number).toValue() : floor.number;

    const query = { domainId: idX };
    const floorDocument = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

    return !!floorDocument;
  }

  public async save(floor: Floor): Promise<Floor> {
    const query = { floorId: Number(floor.id.toValue()) };

    const floorDocument = await this.floorSchema.findOne(query);

    try {
      if (floorDocument === null) {
        const rawFloor: any = FloorMaper.toPersistence(floor);
        const floorCreated = await this.floorSchema.create(rawFloor);
        return FloorMaper.toDomain(floorCreated);
        
      } else {
        floorDocument.floorNumber = Number(floor.number.toValue());
        floorDocument.floorMap.elevators = floor.props.floormap.elevatorsId;
        floorDocument.floorMap.passageways = floor.props.floormap.passagewaysId;
        floorDocument.floorMap.rooms = floor.props.floormap.roomsId;
        floorDocument.floorMap.map = floor.props.floormap.props.map
        await floorDocument.save();
        return floor;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: number): Promise<Floor> {
    const query = { floorId: id };
    const floorRecord = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

    if (floorRecord != null) {
      return FloorMaper.toDomain(floorRecord);
    }
    else
      return null;
  }


}