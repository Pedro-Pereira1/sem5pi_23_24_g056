import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListFloorsPassagewaysController from "../../IControllers/floor/list/IListFloorsPassagewaysController";
import IListFloorsPassagewaysService from "../../../services/IServices/floor/list/IListFloorsPassagewaysService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListFloorsPassagewaysController implements IListFloorsPassagewaysController{

    constructor(
        @Inject(config.services.listFloorsPassageways.name) private listFloorsPassagewaysService: IListFloorsPassagewaysService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listFloorsPassageways(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const buildingCode = req.params.buildingCode.toString();
            const floorsOrError = await this.listFloorsPassagewaysService.listFloorsPassageways(buildingCode)

            if(floorsOrError.isFailure) {
                return res.status(400).send(floorsOrError.errorValue())
            }

            return res.status(200).json(floorsOrError.getValue())
        } catch(e) {
            throw e
        }
    }


}