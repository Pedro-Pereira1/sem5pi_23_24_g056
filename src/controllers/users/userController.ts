import { Response, Request } from 'express';

import { Container} from 'typedi';

import config from '../../../config';

import IUserRepo from '../../services/IRepos/users/IUserRepo';

import { UserMap } from "../../mappers/users/UserMap";
import { IUserDTO } from '../../dto/users/IUserDTO';


exports.getMe = async function(req, res: Response) {
  
    // NB: a arquitetura ONION não está a ser seguida aqui

    const userRepo = Container.get(config.repos.user.name) as IUserRepo

    if( !req.token || req.token == undefined )
        return res.json( new Error("Token inexistente ou inválido")).status(401);

    const user = await userRepo.findById( req.token.id );
    if (!user)
        return res.json( new Error("Utilizador não registado")).status(401);

    const userDTO = UserMap.toDTO( user ) as IUserDTO;
    return res.json( userDTO ).status(200);
}
