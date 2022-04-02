import { Router } from "express";
import { Request, Response } from "express";
import { checkRequest } from "../../lib/ControlCenter";
import * as CacheController  from "../../Controller/CacheController";
import { ICache } from "../../Models/Cache";

const views = {
    upsertNewKey: async (request: Request, response: Response) => {
        checkRequest(request, response, {}, false, async () => {
            const res: ICache = await CacheController.upsertNewKey(request.params.key, request.body.data);

            return response.json(res);
        });
    },

    getSingleKey: async (request: Request, response: Response) => {
        checkRequest(request, response, {}, false, async () => {
            const res: ICache = await CacheController.getSingleKey(request.params.key);

            return response.json(res);
        });
    },

    getAllKeys: async (request: Request, response: Response) => {
        checkRequest(request, response, {}, false, async () => {
            const res: object = await CacheController.getAllKeys(Number(request.query.pageNum) || 1, Number(request.query.count) || 10);

            response.setHeader('X-Count', res["X-Count"]);
            return response.json(res["cacheData"]);
        });
    },

    removeSingleKey: async (request: Request, response: Response) => {
        checkRequest(request, response, {}, false, async () => {
            const res: object = await CacheController.removeSingleKey(request.params.key);

            return response.json(res);
        });
    },

    removeAllKeys: async (request: Request, response: Response) => {
        checkRequest(request, response, {}, false, async () => {
            const res: object = await CacheController.removeAllKeys();

            return response.json(res);
        });
    },
};

const agentRouter = Router();

agentRouter.put("/:key", views.upsertNewKey);
agentRouter.get("/:key", views.getSingleKey);
agentRouter.get("", views.getAllKeys);
agentRouter.delete("/:key", views.removeSingleKey);
agentRouter.delete("", views.removeAllKeys);

export default agentRouter;
