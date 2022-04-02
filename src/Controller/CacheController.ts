import Cache, { ICache } from "../Models/Cache";
import config  from "config";

function generateCode() {
    return (Math.random() + 1).toString(36).substring(7);
}

async function checkCacheLimit() {
    let cacheSize: number = await Cache.countDocuments();

    if (cacheSize < config.get<number>("LIMIT_SIZE")){
        return;
    }

    let latest = await Cache.find({}).sort({ _id: 1}).limit(1);
    if (latest.length > 0){
        await Cache.deleteOne({_id: latest[0]._id});
    };

    return;
}

export const getSingleKey = async (key: string): Promise<ICache> => {
    let cache = await Cache.findOne({ key });
    let exp: Date = new Date();

    if (!cache) {
        console.log("Cache Miss!");

        let randomKey = generateCode();

        await checkCacheLimit();
        return await Cache.create({
            key,
            value: randomKey,
            ttl: new Date(exp.setSeconds(exp.getSeconds() + config.get<number>("TTL")))
        });
    }

    console.log("Cache Hit!");
    cache.ttl = new Date(exp.setSeconds(exp.getSeconds() + config.get<number>("TTL")));

    return await cache.save();
};

export const upsertNewKey = async (key, data): Promise<ICache> => {
    let exp: Date = new Date();

    await checkCacheLimit();
    return await Cache.findOneAndUpdate(
        { key },
        { $set: 
            {
            key,
            value: data,
            ttl: new Date(exp.setSeconds(exp.getSeconds() + config.get<number>("TTL")))
            }
        },
        {
            upsert: true,
            new: true
        });
};

export const getAllKeys = async (pageNum: number, count: number): Promise<object> => {
    let exp: Date = new Date();
    await Cache.updateMany(
        {},
        {
            $set: {
                ttl: new Date(exp.setSeconds(exp.getSeconds() + config.get<number>("TTL")))
            }
        });

    return {
        cacheData: await Cache.find().skip((pageNum - 1) * count).limit(count),
        "X-Count": await Cache.countDocuments()
    }
};

export const removeAllKeys = async (): Promise<object> => {
    await Cache.deleteMany();

    return {
        message:'All records has been removed!'
    }
};

export const removeSingleKey = async (key): Promise<object> => {
    await Cache.findOneAndDelete({ key });

    return {
        message: `key ${key} has been removed!` 
    }
};