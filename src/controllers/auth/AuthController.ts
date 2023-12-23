import { Inject, Service } from "typedi";
import { IAuthController } from "../IControllers/auth/IAuthController";
import config from "../../../config";
import { IAuthService } from "../../services/IServices/auth/IAuthService";

@Service()
export class AuthController implements IAuthController {

    constructor(
        @Inject(config.services.authService.name) private authService: IAuthService
    ) {}

    public validateToken(token: string): boolean {
        return this.authService.validateToken(token);       
    }
    
}