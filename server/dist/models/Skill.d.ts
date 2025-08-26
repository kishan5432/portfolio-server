import mongoose, { Document } from 'mongoose';
export interface ISkill extends Document {
    name: string;
    level: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Skill: mongoose.Model<ISkill, {}, {}, {}, mongoose.Document<unknown, {}, ISkill, {}, {}> & ISkill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Skill.d.ts.map