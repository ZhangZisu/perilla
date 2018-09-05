import { ensureDirSync, unlinkSync } from "fs-extra";
import { Document, Model, model, Schema } from "mongoose";
import { join } from "path";
import { config } from "../config";
import { FileAccess } from "./fileAccess";
ensureDirSync("files/managed");

export interface IBFileModel extends Document {
    hash: string;
    owner: string;
    description: string;
    type: string;
    created: Date;
    getPath(): string;
}

export let BFileSchema = new Schema(
    {
        created: Date,
        description: { type: String, required: true, default: "No description" },
        hash: { type: String, required: true },
        owner: { type: String, required: true },
        type: { type: String, required: true, default: "txt" },
    },
);

BFileSchema.methods.getPath = function() {
    return join("files/managed", this._id.toString());
};

BFileSchema.pre("save", async function(next) {
    if (!(this as IBFileModel).created) {
        (this as IBFileModel).created = new Date();
        const adminAccess = new FileAccess();
        adminAccess.roleID = config.defaultAdminRoleID;
        adminAccess.fileID = this._id;
        adminAccess.MContent = true;
        adminAccess.DRemove = true;
        adminAccess._protected = true;
        await adminAccess.save();

        const judgerAccess = new FileAccess();
        judgerAccess.roleID = config.defaultJudgerRoleID;
        judgerAccess.fileID = this._id;
        judgerAccess._protected = true;
        await judgerAccess.save();
    }
    next();
});

BFileSchema.pre("remove", async function(next) {
    await FileAccess.remove({ fileID: this._id }).exec();
    unlinkSync((this as IBFileModel).getPath());
    next();
});

export const BFile: Model<IBFileModel> = model<IBFileModel>("File", BFileSchema);
