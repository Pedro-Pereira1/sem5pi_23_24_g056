import 'reflect-metadata';
import { Response, Request, NextFunction } from 'express';
import assert from 'assert';
import * as sinon from 'sinon';

var validTokenTest = require('../../src/api/middlewares/validateToken');

describe.only('Valid Token Test', () => {

    it('1. should return true if token is valid', () => {
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyMTExNTFAaXNlcC5pcHAucHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDYW1wdXNNYW5hZ2VyIiwiZXhwIjoxNzAzNzAzMzI5fQ.Mgpp88Xi7CjX1v-AOMZOCZLHl3GviHv6JU5Az4zafgY"  
        let req: Partial<Request> = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        let res: Partial<Response> = {}
        let next: Partial<NextFunction> = () => { }

        var result = validTokenTest(req, res, next);
        
        //@ts-ignore
        assert.equal(req.userId, "1211151@isep.ipp.pt");
        //@ts-ignore
        assert.equal(req.userRole, "CampusManager");
    })

    it('2. should return false if token is invalid', () => {
        var token = "invalidToken"  
        let req: Partial<Request> = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        let res: Partial<Response> = {
            send: sinon.spy(),
            status: sinon.spy(),
        }
        let next: Partial<NextFunction> = () => { }

        var result = validTokenTest(req, res, next);
        
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 500);
    })

    it('3. should return false if token is not present', () => {
        let req: Partial<Request> = {
            headers: {}
        }
        let res: Partial<Response> = {
            send: sinon.spy(),
            status: sinon.spy(),
        }
        let next: Partial<NextFunction> = () => { }

        var result = validTokenTest(req, res, next);
        
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 401);
    })

    it('4. should return false if token was made with another key', () => {
        var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyMTEwODlAaXNlcC5pcHAucHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJUYXNrTWFuYWdlciIsImV4cCI6MTcwMzcwODM0NH0.t5IbnvfzKg_rOV4p-kc3ponKwmVPTSYF4bqa2V1uitc"  
        let req: Partial<Request> = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        let res: Partial<Response> = {
            send: sinon.spy(),
            status: sinon.spy(),
        }
        let next: Partial<NextFunction> = () => { }

        var result = validTokenTest(req, res, next);
        
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 500);
    })
})