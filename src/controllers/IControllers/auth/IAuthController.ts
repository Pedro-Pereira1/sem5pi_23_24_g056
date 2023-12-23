export interface IAuthController {
    validateToken(token: string): Promise<boolean>
}