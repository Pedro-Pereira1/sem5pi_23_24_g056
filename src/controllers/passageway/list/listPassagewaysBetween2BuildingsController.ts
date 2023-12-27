import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import IListPassagewaysBetween2BuildingsController from "../../IControllers/passageway/list/IListPassagewaysBetween2BuildingsController";
import IListPassagewaysBetween2BuildingsService from "../../../services/IServices/passageway/list/IListPassagewaysBetween2BuildingsService";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListPassagewaysBetween2BuildingsController implements IListPassagewaysBetween2BuildingsController {

    constructor(
        @Inject(config.services.listPassagewaysBetween2Buildings.name) private listPassagewaysBetween2BuildingsService: IListPassagewaysBetween2BuildingsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}
    

    public async listPassagewaysBetween2Buildings(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const building1Code = String(req.params.building1Code);
            const building2Code = String(req.params.building2Code);
            const passageways = await this.listPassagewaysBetween2BuildingsService.listPassagewaysBetween2Buildings(building1Code, building2Code)

            if(passageways.isFailure) {
                return res.status(400).send(passageways.errorValue())
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }

    public async findFloorsByPassageway(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager","FleetManager","TaskManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const passagewayId = Number(req.params.passagewayId);
            const passageways = await this.listPassagewaysBetween2BuildingsService.findFloorsByPassageway(passagewayId)

            if(passageways.isFailure) {
                return res.status(400).send(passageways.errorValue())
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }

    


}