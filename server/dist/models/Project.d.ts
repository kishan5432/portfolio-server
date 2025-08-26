import mongoose, { Document } from 'mongoose';
export interface IProject extends Document {
    title: string;
    slug: string;
    description: string;
    tags: string[];
    links: {
        github?: string;
        live?: string;
    };
    images: string[];
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, {}> & IProject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Project.d.ts.map