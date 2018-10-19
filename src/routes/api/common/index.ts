import { Router } from "express";
import { RESTWarp } from "../wrap";

export const commonRouter = Router();

commonRouter.use(RESTWarp((req, res, next) => {
    if (!req.isAuthenticated()) { throw new Error("Not logged in"); }
    next();
}));
