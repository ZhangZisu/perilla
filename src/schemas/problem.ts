import { Document, Model, model, Schema } from "mongoose";
import { ProblemCounter } from "./counter";
import { Solution } from "./solution";

export interface IProblemModel extends Document {
    id: number;
    title: string;
    content: string;
    data?: object;
    channel?: string;
    tags: string[];
    created: Date;
    owner: string;
    creator: string;
}

export const ProblemSchema: Schema = new Schema(
    {
        id: Number,
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 50,
        },
        content: {
            type: String,
            required: true,
            default: "No content",
            minlength: 1,
            maxlength: 40960,
        },
        data: Object,
        channel: String,
        tags: {
            type: [String],
            required: true,
            default: ["No tags"],
        },
        created: Date,
        owner: {
            type: String,
            required: true,
        },
        creator: {
            type: String,
            required: true,
        },
    },
);
ProblemSchema.index({ id: 1, owner: 1 }, { unique: true });
ProblemSchema.pre("save", async function(next) {
    const self = this as IProblemModel;
    if (!self.created) {
        self.created = new Date();
        const counter = await ProblemCounter.findByIdAndUpdate(self.owner, { $inc: { count: 1 } }, { upsert: true, new: true });
        self.id = counter.count;
    }
    next();
});

ProblemSchema.pre("remove", async function(next) {
    await Solution.remove({ problem: this.id });
    next();
});

export const Problem: Model<IProblemModel> = model<IProblemModel>("Problem", ProblemSchema);
