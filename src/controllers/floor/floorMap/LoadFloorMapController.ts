import { Inject, Service } from "typedi";
import ILoadFloorMapController from "../../IControllers/floor/floorMap/ILoadFloorMapController";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import ILoadFloorMapService from "../../../services/IServices/floor/floorMap/ILoadFloorMapService";
import ILoadFloorMapDTO from "../../../dto/floor/ILoadFloorMapDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class LoadFloorController implements ILoadFloorMapController {

    constructor(
        @Inject(config.services.loadFloorMap.name) private loadFloorMapService: ILoadFloorMapService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async loadFloorMap(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }

        const floorDto = await this.loadFloorMapService.loadFloorMap(req.body as ILoadFloorMapDTO)

        if (floorDto.isFailure) {
            return res.status(400).send(floorDto.errorValue())
        }

        return res.status(201).json(floorDto.getValue())
    }


}