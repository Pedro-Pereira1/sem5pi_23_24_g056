import { Inject, Service } from "typedi";
import IListAllBuildingsController from "../../IControllers/building/list/IListAllBUildingsController";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import config from "../../../../config";
import IListAllBuildingsService from "../../../services/IServices/building/IListAllBuildingsService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListAllBuildingsController implements IListAllBuildingsController {

    constructor(
        @Inject(config.services.listAllBuildigns.name) private listAllBuildingsService: IListAllBuildingsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listAllBuildings(req: Request, res: Response, next: NextFunction) {
        if(!this.authService.validateToken(req)){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        let userRole = req.userRole;

        if(!this.authService.validatePermission(userRole, ["CampusManager","FleetManager","TaskManager","Utente"])){
            return res.status(401).send("Unauthorized");
        }

        //@ts-ignore
        //let userRole = req.userRole;
        //if(!this.authService.validatePermission(userRole, ["CampusManager","FleetManager","TaskManager"])){
        //    return res.status(401).send("Unauthorized");
        //}

        try {
            const buildings = await this.listAllBuildingsService.listAllBuildings()

            if(buildings.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(buildings.getValue())
        } catch(err) {
            throw err
        }
    }


}