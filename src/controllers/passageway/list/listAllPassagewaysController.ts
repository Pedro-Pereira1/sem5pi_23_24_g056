import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListAllPassagewaysController from "../../IControllers/passageway/list/IListAllPassagewaysController";
import IListAllPassagewaysService from "../../../services/IServices/passageway/list/IListAllPassagewaysService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListAllPassagewaysController implements IListAllPassagewaysController{

    constructor(
        @Inject(config.services.listAllPassageways.name) private listAllPassagewaysService: IListAllPassagewaysService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listAllPassageways(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const passageways = await this.listAllPassagewaysService.listAllPassageways()

            if(passageways.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }


}