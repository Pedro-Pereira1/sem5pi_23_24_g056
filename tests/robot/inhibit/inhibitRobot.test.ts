import Container from "typedi"
import * as sinon from 'sinon';
import { ICreateRobotDTO } from "../../../src/dto/robot/ICreateRobotDTO"
import { ICreateRobotTypeDTO } from "../../../src/dto/robotType/ICreateRobotTypeDTO"
import { RobotType } from "../../../src/domain/RobotType/RobotType"
import { Robot } from "../../../src/domain/Robot/Robot"
import { Response, Request, NextFunction } from 'express';
import InhibitRobotController from '../../../src/controllers/robot/inhibit/inhibitRobotController'
import IInhibitRobotService from "../../../src/services/IServices/robot/inhibit/IIhibitRobotService";
import { IRobotDTO } from "../../../src/dto/robot/IRobotDTO";
import { Result } from "../../../src/core/logic/Result";
import IInhibitRobotDTO from "../../../src/dto/robot/IInhibitRobotDTO";

describe.only('Inhibit robot test', function () {

    beforeEach(function () {
        Container.reset()

        let robotTypSchemaInstance = require('../../../src/persistence/schemas/robotType/robotTypeSchema').default
        Container.set('robotTypeSchema', robotTypSchemaInstance)

        let robotSchemaInstance = require('../../../src/persistence/schemas/robot/robotSchema').default
        Container.set('robotSchema', robotSchemaInstance)

        let robotRepoClass = require('../../../src/repos/robot/robotRepo').default
        let robotRepoInstance = Container.get(robotRepoClass)
        Container.set('robotRepo', robotRepoInstance)

        let inhibitRobotServiceClass = require('../../../src/services/robot/inhibit/inhibitRobotService').default
        let inihibitRobotServiceInstance = Container.get(inhibitRobotServiceClass)
        Container.set('inhibitRobotSerivce', inihibitRobotServiceInstance)
    })

    it('1. Inhibit method properly works', async function () {
        const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Apple",
            "robotModel": "IRobot15",
            "availableTasks": ["Floor surveillance", "Object transport"]
        }
        const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue()
        const robotDTO: ICreateRobotDTO = {
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "fast"
        }

        const robot = Robot.create(robotDTO, robotType, robotDTO.code).getValue()

        robot.inhibit()

        sinon.assert.match(robot.operationStatus.status, false)
    })

    it('2. Controller unit test robot exist on database', async function () {
        const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Apple",
            "robotModel": "IRobot15",
            "availableTasks": ["Floor surveillance", "Object transport"]
        }
        const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue()
        const robotDTO: ICreateRobotDTO = {
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "fast"
        }
        const robotJson = {
            id: "code1"
        }
        const robotexpectedDto = {
            code: "code1",
            nickname: "marsupial",
            type: "k4",
            serialNumber: "maxC",
            description: "fast",
            operationStatus: false
        }

        let req: Partial<Request> = {}
        req.body = robotJson
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const service = Container.get('inhibitRobotSerivce')

        sinon.stub(service, 'inhibitRobot')
            .returns(new Promise((resolve, reject) => { resolve(Result.ok<IRobotDTO>(robotexpectedDto)) }))


        const controller = new InhibitRobotController(service as IInhibitRobotService)

        await controller.inhibitRobot(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, robotexpectedDto)
    })

    it('4. Service unit test robot dosen\'t exist on database', async function () {
        const robotJson = {
            id: "code1"
        }
        let req: Partial<Request> = {}
        req.body = robotJson
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const service = Container.get('inhibitRobotSerivce')

        sinon.stub(service, 'inhibitRobot')
            .returns(new Promise((resolve, reject) => { resolve(Result.fail<IRobotDTO>('There is no robot with that id')) }))


        const controller = new InhibitRobotController(service as IInhibitRobotService)

        await controller.inhibitRobot(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })

    it('5. Service unit test robot exist on database', async function () {
        const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Apple",
            "robotModel": "IRobot15",
            "availableTasks": ["Floor surveillance", "Object transport"]
        }
        const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue()
        const robotDTO: ICreateRobotDTO = {
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "fast"
        }

        const robot = Robot.create(robotDTO, robotType, robotDTO.code).getValue()

        const toTest = {
            id: "code1"
        } as IInhibitRobotDTO

        const robotRepo = Container.get('robotRepo')

        sinon.stub(robotRepo, 'findById')
            .returns(robot)

        sinon.stub(robotRepo, 'save')
            .returns(robot)

        const service = Container.get('inhibitRobotSerivce') as IInhibitRobotService

        const actual = await service.inhibitRobot(toTest)

        sinon.assert.match(actual.getValue().operationStatus, false)
    })

    it('6. Service unit test robot dosen\'t exist on database', async function () {
        const toTest = {
            id: "code1"
        } as IInhibitRobotDTO

        const robotRepo = Container.get('robotRepo')

        sinon.stub(robotRepo, 'findById')
            .returns(null)

        const spy = sinon.spy(robotRepo, 'save')

        const service = Container.get('inhibitRobotSerivce') as IInhibitRobotService

        const actual = await service.inhibitRobot(toTest)

        sinon.assert.match(actual.isFailure, true)
        sinon.assert.notCalled(spy)
    })

    it('7. Controller + service integration test robot exist on database', async function () {
        const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Apple",
            "robotModel": "IRobot15",
            "availableTasks": ["Floor surveillance", "Object transport"]
        }
        const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue()
        const robotDTO: ICreateRobotDTO = {
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "fast"
        }
        const robot = Robot.create(robotDTO, robotType, robotDTO.code).getValue()

        const robotJson = {
            id: "code1"
        }
        const robotexpectedDto = {
            code: "code1",
            nickname: "marsupial",
            type: "k4",
            serialNumber: "maxC",
            description: "fast",
            operationStatus: false
        }

        let req: Partial<Request> = {}
        req.body = robotJson
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const repo = Container.get('robotRepo')
        sinon.stub(repo, 'findById')
            .returns(robot)

        sinon.stub(repo, 'save')
            .returns(robot)

        const service = Container.get('inhibitRobotSerivce') as IInhibitRobotService

        const controller = new InhibitRobotController(service as IInhibitRobotService)

        await controller.inhibitRobot(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 201)
        sinon.assert.calledOnce(res.json)
        sinon.assert.calledWith(res.json, robotexpectedDto)
    })

    it('8. Controller + service integration test robot doesn\'t exist on database', async function () {
        const robotJson = {
            id: "code1"
        }

        let req: Partial<Request> = {}
        req.body = robotJson
        let res: Partial<Response> = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        }
        let next: Partial<NextFunction> = () => { }

        const repo = Container.get('robotRepo')
        sinon.stub(repo, 'findById')
            .returns(null)

        const service = Container.get('inhibitRobotSerivce') as IInhibitRobotService

        const controller = new InhibitRobotController(service as IInhibitRobotService)

        await controller.inhibitRobot(<Request>req, <Response>res, <NextFunction>next)

        sinon.assert.calledOnce(res.status)
        sinon.assert.calledWith(res.status, 400)
        sinon.assert.calledOnce(res.send)
    })
})