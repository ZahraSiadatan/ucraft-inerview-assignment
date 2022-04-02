import mongoose, { Document, Schema } from "mongoose";

export interface ICache extends Document {
    key: string;
    value: string;
    ttl: Date;
};

const CacheSchema: Schema = new Schema(
    {
        key: { type: String, default: "" },
        value: { type: String, default: "" },
        ttl: { type: Date, default: 0 }
    },
    {
        timestamps: true
    }
);

CacheSchema.index({ key: 1 }, { unique: true });
CacheSchema.index({ ttl: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ICache>("Cache  ", CacheSchema);