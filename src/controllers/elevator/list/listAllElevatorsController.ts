import {Inject, Service} from "typedi";
import config from "../../../../config";
import {NextFunction, Request, Response} from "express";
import IListAllElevatorsController from "../../IControllers/elevator/list/IListAllElevatorsController";
import IListAllElevatorsService from "../../../services/IServices/elevator/list/IListAllElevatorsService";
import { IAuthService } from "../../../services/IServices/auth/IAuthService";

@Service()
export default class ListAllElevatorsController implements IListAllElevatorsController{

    constructor(
        @Inject(config.services.listAllElevators.name) private listAllElevatorsService: IListAllElevatorsService,
        @Inject(config.services.auth.name) private authService: IAuthService
    )
    {}

    public async listAllElevators(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const passageways = await this.listAllElevatorsService.listAllElevators()

            if(passageways.isFailure) {
                return res.status(400).send()
            }

            return res.status(200).json(passageways.getValue())
        } catch(err) {
            throw err
        }
    }

    public async listFloorsByElevatorId(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        let userRole = req.userRole;
        if(!this.authService.validatePermission(userRole, ["CampusManager"])){
            return res.status(401).send("Unauthorized");
        }
        try {
            const elevatorId = String(req.params.elevatorIdentificationNumber);

            const floorIds = await this.listAllElevatorsService.listFloorsByElevatorId(elevatorId)

            if(floorIds.isFailure) {
                return res.status(400).send(floorIds.errorValue())
            }

            return res.status(200).json(floorIds.getValue())
        } catch(err) {
            throw err
        }
    }




}