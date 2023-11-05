import { Inject, Service } from "typedi";
import ILoadFloorMapController from "../../IControllers/floor/floorMap/ILoadFloorMapController";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import ILoadFloorMapService from "../../../services/IServices/floor/floorMap/ILoadFloorMapService";
import ILoadFloorMapDTO from "../../../dto/floor/ILoadFloorMapDTO";

@Service()
export default class LoadFloorController implements ILoadFloorMapController {

    constructor(
        @Inject(config.services.loadFloorMap.name) private loadFloorMapService: ILoadFloorMapService
    )
    {}

    public async loadFloorMap(req: Request, res: Response, next: NextFunction) {

        const floorDto = await this.loadFloorMapService.loadFloorMap(req.body as ILoadFloorMapDTO)

        if (floorDto.isFailure) {
            return res.status(400).send(floorDto.errorValue())
        }

        return res.status(201).send(floorDto.getValue())
    }


}