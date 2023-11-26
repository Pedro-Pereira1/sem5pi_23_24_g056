import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import assert from 'assert';
import { ICreateRobotTypeDTO } from '../../../src/dto/robotType/ICreateRobotTypeDTO';
import { RobotType } from '../../../src/domain/RobotType/RobotType';
import { IRobotTypeDTO } from '../../../src/dto/robotType/IRobotTypeDTO';
import { AvailableTask } from '../../../src/domain/RobotType/AvailableTask';
import { RobotBrand } from '../../../src/domain/RobotType/RobotBrand';
import { RobotModel } from '../../../src/domain/RobotType/RobotModel';
import createRobotTypeController from '../../../src/controllers/robotType/create/createRobotTypeController';
import ICreateRobotTypeService from '../../../src/services/IServices/robotType/create/ICreateRobotTypeService';
import { Result } from '../../../src/core/logic/Result';
import { ICreateRobotDTO } from '../../../src/dto/robot/ICreateRobotDTO';
import {Robot} from '../../../src/domain/Robot/Robot';
import { IRobotDTO } from '../../../src/dto/robot/IRobotDTO';
import ICreateRobotService from '../../../src/services/IServices/robot/create/ICreateRobotService';
import createRobotController from '../../../src/controllers/robot/create/createRobotController';

describe("Create robot", function () {
    const sandbox = sinon.createSandbox();
    let robotTypeRepoMock;
    let robotRepoMock;


    beforeEach(function () {
        Container.reset();

        robotTypeRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
        };
        Container.set('robotTypeRepo', robotTypeRepoMock);

        robotRepoMock = {
            exists: sinon.stub(),
            save: sinon.stub(),
            findById: sinon.stub(),
            findByNickname: sinon.stub(),
            findBySerialNumberAndType: sinon.stub(),
        };
        Container.set('robotRepo', robotRepoMock);

        let robotTypSchemaInstance = require('../../../src/persistence/schemas/robotType/robotTypeSchema').default
        Container.set('robotTypeSchema', robotTypSchemaInstance)

        let robotSchemaInstance = require('../../../src/persistence/schemas/robot/robotSchema').default
        Container.set('robotSchema', robotSchemaInstance)

        let createRobotTypeServiceClass = require('../../../src/services/robotType/create/createRobotTypeService').default
        let createRobotTypeServiceInstance = Container.get(createRobotTypeServiceClass)
        Container.set('createRobotTypeService', createRobotTypeServiceInstance)

        let createRobotServiceClass = require('../../../src/services/robot/create/createRobotService').default
        let createRobotServiceInstance = Container.get(createRobotServiceClass)
        Container.set('createRobotService', createRobotServiceInstance)
    });

    afterEach(function () {
        sandbox.restore();
        sinon.restore();
    });

    it('should create a new Robot instance with valid input', function () {
        // Arrange
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };


        // Act
        const result = Robot.create(robotDTO, robotType, robotDTO.code, true);

        // Assert
        assert.ok(result.isSuccess);
        assert.ok(result.getValue() instanceof Robot);
        assert.strictEqual(result.getValue().id.toString(), robotDTO.code);
        assert.strictEqual(result.getValue().props.nickname.nickname, robotDTO.nickname);
        assert.strictEqual(result.getValue().props.type.id.toString(), robotDTO.type);
        assert.strictEqual(result.getValue().props.serialNumber.serialNumber, robotDTO.serialNumber);
        assert.strictEqual(result.getValue().props.description.description, robotDTO.description);
        assert.strictEqual(result.getValue().props.operationStatus.status, true);
    });

    it('should fail to create a new Robot instance with invalid input (Nickname)', function () {
         // Arrange
         const robotTypeDTO: ICreateRobotTypeDTO = {
            "robotTypeID": "k4",
            "robotBrand": "Joi.string().max(0).required()",
            "robotModel": " Joi.string().max(100).required()",
            "availableTasks": ["Floor surveillance","Object transport"]
        };
        const robotType = RobotType.create(robotTypeDTO, robotTypeDTO.robotTypeID).getValue();

        const robotDTO: ICreateRobotDTO = {
            "code":"code1",
            "nickname": 'a'.repeat(31),
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };


        // Act
        const result = Robot.create(robotDTO, robotType, robotDTO.code, true);

        // Assert
        assert.ok(result.isFailure);
    });

    it('should fail to create a new Robot instance with invalid input (SerialNumber)', function () {
        // Arrange
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
           "serialNumber": 'a'.repeat(51),
           "description": "Joi.string().max(250)"
       };


       // Act
       const result = Robot.create(robotDTO, robotType, robotDTO.code, true);

       // Assert
       assert.ok(result.isFailure);
   });

   it('should fail to create a new Robot instance with invalid input (Description)', function () {
    // Arrange
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
       "serialNumber": "maxC",
       "description": 'a'.repeat(251)
    };


    // Act
    const result = Robot.create(robotDTO, robotType, robotDTO.code, true);

    // Assert
    assert.ok(result.isFailure);
    });

    it('createRobotController unit test using createRobotService stub', async function () {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {};
          req.body = body;
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        const robotDTO: IRobotDTO = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)",
            "operationStatus": true
         };
        

        let createRobotServiceInstance = Container.get("createRobotService");
        sinon.stub(createRobotServiceInstance, "createRobot").returns(Promise.resolve(Result.ok<IRobotDTO>(robotDTO)));

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)",
            "operationStatus": true
        }));

    });

    it("createRobotController +createRobotService integration test", async function() {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };
        
        robotRepoMock.findById.resolves(null);
        robotTypeRepoMock.findById.resolves(robotType);
        robotRepoMock.findByNickname.resolves(null);
        robotRepoMock.findBySerialNumberAndType.resolves(false);
        
        let createRobotServiceInstance = Container.get("createRobotService");
        const createRobotServiceSpy = sinon.spy(createRobotServiceInstance, "createRobot");

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            "code": "code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)",
            "operationStatus": true
        }));
        sinon.assert.calledOnce(createRobotServiceSpy);
    }); 

    it("createRobotController +createRobotService integration test (Robot already exists)", async function() {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };
        
        robotRepoMock.findById.resolves(robotDTO);
        robotTypeRepoMock.findById.resolves(robotType);
        robotRepoMock.findByNickname.resolves(null);
        robotRepoMock.findBySerialNumberAndType.resolves(false);
        
        let createRobotServiceInstance = Container.get("createRobotService");
        const createRobotServiceSpy = sinon.spy(createRobotServiceInstance, "createRobot");

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRobotServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Robot already exists"));
    });

    it("createRobotController +createRobotService integration test (Robot Type not found)", async function() {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };
        
        robotRepoMock.findById.resolves(null);
        robotTypeRepoMock.findById.resolves(null);
        robotRepoMock.findByNickname.resolves(null);
        robotRepoMock.findBySerialNumberAndType.resolves(false);
        
        let createRobotServiceInstance = Container.get("createRobotService");
        const createRobotServiceSpy = sinon.spy(createRobotServiceInstance, "createRobot");

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRobotServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Robot Type not found"));
    }); 

    it("createRobotController +createRobotService integration test (Robot with this nickname already exists)", async function() {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };
        
        robotRepoMock.findById.resolves(null);
        robotTypeRepoMock.findById.resolves(robotType);
        robotRepoMock.findByNickname.resolves(robotDTO);
        robotRepoMock.findBySerialNumberAndType.resolves(false);
        
        let createRobotServiceInstance = Container.get("createRobotService");
        const createRobotServiceSpy = sinon.spy(createRobotServiceInstance, "createRobot");

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRobotServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Robot with this nickname already exists"));
    }); 

    it("createRobotController +createRobotService integration test (Robot of this type and serial number already exists)", async function() {
        // Arrange
        let body = {
            "code":"code1",
            "nickname": "marsupial",
            "type": "k4",
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
         };
        let req: Partial<Request> = {
          body: body
        };
        let res: Partial<Response> = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis(),
          send: sinon.spy()
        };
        let next: Partial<NextFunction> = () => {};

        // Stub repo methods
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
            "serialNumber": "maxC",
            "description": "Joi.string().max(250)"
        };
        
        robotRepoMock.findById.resolves(null);
        robotTypeRepoMock.findById.resolves(robotType);
        robotRepoMock.findByNickname.resolves(null);
        robotRepoMock.findBySerialNumberAndType.resolves(true);
        
        let createRobotServiceInstance = Container.get("createRobotService");
        const createRobotServiceSpy = sinon.spy(createRobotServiceInstance, "createRobot");

        const ctrl = new createRobotController(createRobotServiceInstance as ICreateRobotService);

        // Act
        await ctrl.createRobot(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(createRobotServiceSpy);
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status,400);
        sinon.assert.calledOnce(res.send);
        sinon.assert.calledWith(res.send, sinon.match("Robot of this type and serial number already exists"));
    });
    
});
