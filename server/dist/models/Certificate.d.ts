import mongoose, { Document } from 'mongoose';
export interface ICertificate extends Document {
    title: string;
    organization: string;
    issueDate: Date;
    credentialId?: string;
    url?: string;
    image?: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, {}> & ICertificate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Certificate.d.ts.map