import { Inject, Service } from "typedi";
import ILoadFloorMapController from "../../IControllers/floor/floorMap/ILoadFloorMapController";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import ILoadFloorMapService from "../../../services/IServices/floor/floorMap/ILoadFloorMapService";

@Service()
export default class LoadFloorController implements ILoadFloorMapController {

    constructor(
        @Inject(config.services.loadFloorMap.name) private loadFloorMapService: ILoadFloorMapService
    )
    {}

    public async loadFloorMap(req: Request, res: Response, next: NextFunction) {

        const floorBuffer = req.file.buffer
        const floorId = req.body.floorId as number
        const buildingCode = req.body.buildingId as string

        const floorDto = await this.loadFloorMapService.loadFloorMap(buildingCode, floorId, floorBuffer)

        if (floorDto.isFailure) {
            return res.status(401).send(floorDto.errorValue())
        }

        return res.status(201).send(floorBuffer.toString())
    }


}