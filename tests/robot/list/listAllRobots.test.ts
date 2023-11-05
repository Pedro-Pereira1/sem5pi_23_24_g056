import * as sinon from 'sinon';
import Container from 'typedi';
import { Response, Request, NextFunction } from 'express';
import { Result } from '../../../src/core/logic/Result';
import ListElevatorsInBuildingController from '../../../src/controllers/elevator/list/listElevatorsInBuildingController'
import { ICreateRobotTypeDTO } from '../../../src/dto/robotType/ICreateRobotTypeDTO';
import { ICreateRobotDTO } from '../../../src/dto/robot/ICreateRobotDTO';
import { RobotType } from '../../../src/domain/RobotType/RobotType';
import { Robot } from '../../../src/domain/Robot/Robot';
import { IRobotDTO } from '../../../src/dto/robot/IRobotDTO';
import IListAllRobotsService from '../../../src/services/IServices/robot/list/IListAllRobotsService'
import ListAllRobotsController from '../../../src/controllers/robot/list/listAllRobotsController'


describe('List all robots test', function () {
    const robotTypeDTO: ICreateRobotTypeDTO = {
        "robotTypeID": "k4",
        "robotBrand": "Joi.string().max(0).required()",
        "robotModel": " Joi.string().max(100).required()",
        "availableTasks": ["Floor surveillance","Object transport"]
    };
    const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue();

    const robotDTO: ICreateRobotDTO = {
        "code":"code1",
        "nickname": "marsupial",
        "type": "k4",
        "serialNumber": 'a',
        "description": "Joi.string().max(250)"
    };

    const robot = Robot.create(robotDTO, robotType, robotDTO.code);

    const robot2DTO: ICreateRobotDTO = {
        "code":"code2",
        "nickname": "bird",
        "type": "k4",
        "serialNumber": 'b',
        "description": "Joi.string().max(250)"
    };

    const robot2 = Robot.create(robot2DTO, robotType, robotDTO.code);

    beforeEach(function () {
        Container.reset()

        //Schemas
        let robotSchemaInstance = require('../../../src/persistence/schemas/robot/robotSchema').default
        Container.set('robotSchema', robotSchemaInstance)

        let robotTypeSchemaInstance = require('../../../src/persistence/schemas/robotType/robotTypeSchema').default
        Container.set('robotTypeSchema', robotTypeSchemaInstance)

        //Repos

        let robotRepoClass = require('../../../src/repos/robot/robotRepo').default
        let robotRepoInstance = Container.get(robotRepoClass)
        Container.set('robotRepo', robotRepoInstance)

        //Services
        let listAllRobotsServiceClass = require('../../../src/services/robot/list/listAllRobotsService').default
        let listAllRobotsServiceInstance = Container.get(listAllRobotsServiceClass)
        Container.set('listAllRobotsService', listAllRobotsServiceInstance)
    })

    it('1. Controller with stub service returns robots', async function () {
        const robot1Result = {
            code: robot.getValue().id.toString(),
            nickname: robot.getValue().props.nickname.nickname,
            type: robot.getValue().props.type.id.toString(),
            serialNumber: robot.getValue().props.serialNumber.serialNumber,
            description: robot.getValue().props.description.description,
            operationStatus: robot.getValue().props.operationStatus.status
        } as IRobotDTO

        const robot2Result = {
            code: robot2.getValue().id.toString(),
            nickname: robot2.getValue().props.nickname.nickname,
            type: robot2.getValue().props.type.id.toString(),
            serialNumber: robot2.getValue().props.serialNumber.serialNumber,
            description: robot2.getValue().props.description.description,
            operationStatus: robot2.getValue().props.operationStatus.status
        } as IRobotDTO

        const result = [robot1Result, robot2Result]

        let req: Partial<Request> = {}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listAllRobotsService = Container.get('listAllRobotsService')

        sinon.stub(listAllRobotsService, 'listAllRobots').returns(new Promise((resolve, reject) => { resolve(Result.ok<IRobotDTO[]>(result)) }))

        const listAllRobotsController = new ListAllRobotsController(listAllRobotsService as IListAllRobotsService)

        await listAllRobotsController.listAllRobots(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('2. Controller with stub service returns no robots', async function () {
        let req: Partial<Request> = {}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const listAllRobotsService = Container.get('listAllRobotsService')

        sinon.stub(listAllRobotsService, 'listAllRobots').returns(new Promise((resolve, reject) => { resolve(Result.fail<IRobotDTO[]>('No Robots found!')) }))

        const listAllRobotsController = new ListAllRobotsController(listAllRobotsService as IListAllRobotsService)

        await listAllRobotsController.listAllRobots(<Request>req, <Response>res, <NextFunction>next)
        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('3. Service with stub repo lists robots', async function () {
        const robot1Result = {
            code: robot.getValue().id.toString(),
            nickname: robot.getValue().props.nickname.nickname,
            type: robot.getValue().props.type.id.toString(),
            serialNumber: robot.getValue().props.serialNumber.serialNumber,
            description: robot.getValue().props.description.description,
            operationStatus: robot.getValue().props.operationStatus.status
        } as IRobotDTO

        const robot2Result = {
            code: robot2.getValue().id.toString(),
            nickname: robot2.getValue().props.nickname.nickname,
            type: robot2.getValue().props.type.id.toString(),
            serialNumber: robot2.getValue().props.serialNumber.serialNumber,
            description: robot2.getValue().props.description.description,
            operationStatus: robot2.getValue().props.operationStatus.status
        } as IRobotDTO

        const expected = [robot1Result, robot2Result]

        const returnRepo = [robot.getValue(), robot2.getValue()]

        const robotRepo = Container.get('robotRepo')
        sinon.stub(robotRepo, 'findAll').returns(new Promise((resolve, reject) => {resolve(returnRepo)}))

        const listAllRobotsService = Container.get('listAllRobotsService') as IListAllRobotsService

        const actual = await listAllRobotsService.listAllRobots()

        sinon.assert.match(actual.getValue(), expected)
    })

    it('4. Service with stub repo finds no robots', async function () {
        const robotRepo = Container.get('robotRepo')
        sinon.stub(robotRepo, 'findAll').returns(new Promise((resolve, reject) => {resolve([])}))

        const listAllRobotsService = Container.get('listAllRobotsService') as IListAllRobotsService

        const actual = await listAllRobotsService.listAllRobots()

        sinon.assert.match(actual.isFailure, true)
    })

    it('5. Controller + Service with stub repo returns robots', async function () {
        const robot1Result = {
            code: robot.getValue().id.toString(),
            nickname: robot.getValue().props.nickname.nickname,
            type: robot.getValue().props.type.id.toString(),
            serialNumber: robot.getValue().props.serialNumber.serialNumber,
            description: robot.getValue().props.description.description,
            operationStatus: robot.getValue().props.operationStatus.status
        } as IRobotDTO

        const robot2Result = {
            code: robot2.getValue().id.toString(),
            nickname: robot2.getValue().props.nickname.nickname,
            type: robot2.getValue().props.type.id.toString(),
            serialNumber: robot2.getValue().props.serialNumber.serialNumber,
            description: robot2.getValue().props.description.description,
            operationStatus: robot2.getValue().props.operationStatus.status
        } as IRobotDTO

        const result = [robot1Result, robot2Result]


        let req: Partial<Request> = {}

        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }

        let next: Partial<NextFunction> = () => { }

        const returnRepo = [robot.getValue(), robot2.getValue()]

        const robotRepo = Container.get('robotRepo')
        sinon.stub(robotRepo, 'findAll').returns(new Promise((resolve, reject) => {resolve(returnRepo)}))

        const listAllRobotsService = Container.get('listAllRobotsService') as IListAllRobotsService

        const listAllRobotsController = new ListAllRobotsController(listAllRobotsService as IListAllRobotsService)

        await listAllRobotsController.listAllRobots(<Request>req, <Response>res, <NextFunction>next)


        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 200)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, sinon.match(result))
    })

    it('6. Controller + Service with stub repo no robots', async function () {
        let req: Partial<Request> = {}
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const robotRepo = Container.get('robotRepo')
        sinon.stub(robotRepo, 'findAll').returns(new Promise((resolve, reject) => {resolve([])}))

        const listAllRobotsService = Container.get('listAllRobotsService') as IListAllRobotsService

        const listAllRobotsController = new ListAllRobotsController(listAllRobotsService as IListAllRobotsService)

        await listAllRobotsController.listAllRobots(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })


})
