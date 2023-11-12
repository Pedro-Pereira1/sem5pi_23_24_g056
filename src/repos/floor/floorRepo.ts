import { Inject, Service } from "typedi";
import IFloorRepo from "../../services/IRepos/floor/IFloorRepo";
import { Floor } from "../../domain/Floor/Floor";
import IFloorPersistence from "../../dataschema/floor/IFloorPersistence";
import { Document, FilterQuery, Model } from 'mongoose';
import FloorNumber from "../../domain/Floor/FloorId";
import { FloorMaper } from "../../mappers/floor/FloorMaper";
import { Building } from "../../domain/Building/Building";
import { publicDecrypt } from "crypto";
import { Result } from "../../core/logic/Result";

@Service()
export default class FloorRepo implements IFloorRepo {

  constructor(
    @Inject('floorSchema') private floorSchema: Model<IFloorPersistence & Document>
  ) { }

  async exists(floor: Floor): Promise<boolean> {
    const query = { floorId: floor.id.toValue() };
    const floorRecord = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);
    if (floorRecord != null) {
      return true;
    }
    else
      return false;
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
        if (floor.props.floorNumber.number !== undefined) {
          floorDocument.floorNumber = floor.floorNumber.number
        }

        if (floor.description.description !== undefined) {
          floorDocument.floorDescription = floor.description.description;
        }

        if (floor.props.floormap.elevatorsId !== undefined) {
          floorDocument.floorMap.elevators = floor.props.floormap.elevatorsId;
        }

        if (floor.props.floormap.passagewaysId !== undefined) {
          floorDocument.floorMap.passageways = floor.props.floormap.passagewaysId;
        }

        if (floor.props.floormap.roomsId !== undefined) {
          floorDocument.floorMap.rooms = floor.props.floormap.roomsId;
        }

        if (floor.props.floormap.map !== undefined) {
          floorDocument.floorMap.map = floor.map.map
        }

        if (floor.map.passagewaysCoords !== undefined) {
          floorDocument.floorMap.passagewaysCoords = floor.map.passagewaysCoords
        }

        if (floor.map.elevatorsCoords !== undefined) {
          floorDocument.floorMap.elevatorsCoords = floor.map.elevatorsCoords
        }

        if (floor.map.roomsCoords !== undefined) {
          floorDocument.floorMap.roomCoords = floor.map.roomsCoords
        }

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

  public async findByElevator(id: number): Promise<Floor[]> {
    const query = { 'floorMap.elevators': id };
    const floorRecords = await this.floorSchema.find(query as FilterQuery<IFloorPersistence & Document>);

    if (floorRecords.length > 0) {
      const floors = await Promise.all(
        floorRecords.map(async (record) => FloorMaper.toDomain(record))
      );
      return floors;
    } else {
      return [];
    }
  }

  public async findByPassageway(passagewayId: number): Promise<Floor[]> {
    const query = { 'floorMap.passageways': passagewayId };
    const floorRecords = await this.floorSchema.find(query as FilterQuery<IFloorPersistence & Document>);

    if (floorRecords.length > 0) {
      const floors = await Promise.all(
        floorRecords.map(async (record) => FloorMaper.toDomain(record))
      );
      return floors;
    } else {
      return [];
    }
  }

  public async findByRoom(id: string): Promise<Floor> {
    const query = { 'floorMap.rooms': id };
    const floorRecord = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

    if (floorRecord != null) {
      return FloorMaper.toDomain(floorRecord);
    }
    else
      return null;
  }

  public async deleteFloor(id: number): Promise<boolean> {
    try {
      const query = { floorId: id };

      const floorDocument = await this.floorSchema.findOne(query as FilterQuery<IFloorPersistence & Document>);

      if (floorDocument === null) {
        return false
      }

      await floorDocument.deleteOne();

      return true

    } catch (e) {
      throw e
    }
  }

}


