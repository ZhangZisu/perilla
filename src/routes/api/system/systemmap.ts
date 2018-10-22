import { Router } from "express";
import { extendQuery } from "../../../interfaces/query";
import { SystemMap } from "../../../schemas/systemMap";
import { PaginationGuard, RESTWarp } from "../wrap";

export const SystemMapRouter = Router();

SystemMapRouter.get("/count", RESTWarp(async (req, res) => {
    let query = SystemMap.find();
    query = extendQuery(query, req.query.condition);
    return res.RESTSend(await query.countDocuments());
}));

SystemMapRouter.get("/list", PaginationGuard, RESTWarp(async (req, res) => {
    let query = SystemMap.find();
    query = extendQuery(query, req.query.condition);
    const result = await query.skip(req.pagination.skip).limit(req.pagination.limit);
    return res.RESTSend(result);
}));

SystemMapRouter.post("/", RESTWarp(async (req, res) => {
    req.checkQuery("user").isString();
    if (!await SystemMap.findOne({ user: req.query.user })) {
        const map = new SystemMap();
        map.user = req.query.user;
        await map.save();
    }
    return res.RESTEnd();
}));

SystemMapRouter.delete("/", RESTWarp(async (req, res) => {
    req.checkQuery("user").isString();
    const map = await SystemMap.findOne({ user: req.query.user });
    if (!map) { throw new Error("Not found"); }
    await map.remove();
    return res.RESTEnd();
}));