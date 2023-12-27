import { NextFunction, Request, Response } from "express";
import ICreateFloorController from "../../IControllers/floor/create/ICreateFloorController";
import { Inject, Service } from "typedi";
import config from "../../../../config";
import ICreateFloorService from "../../../services/IServices/floor/create/ICreateFloorService";
import { FloorMaper } from "../../../mappers/floor/FloorMaper";
import { IFloorDTO } from "../../../dto/floor/IFloorDTO";
import { Result } from "../../../core/logic/Result";
import { IBuildingDTO } from "../../../dto/building/IBuildingDTO";
import { ICreateFloorDTO } from "../../../dto/floor/ICreateFloorDTO";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class CreateFloorController implements ICreateFloorController {

    constructor(
        @Inject(config.services.createFloor.name) private service: ICreateFloorService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const FloorOrError = await this.service.createFloor(req.body as ICreateFloorDTO) as Result<IFloorDTO>

            if (FloorOrError.isFailure) {
                return res.status(400).send(FloorOrError.errorValue())
            }

            const FloorDTO = FloorOrError.getValue();
            return res.status(201).json(FloorDTO);

        }catch (e){
            return next(e);
        }
    }
}
