import mongoose, { Document } from 'mongoose';
export interface IContactMessage extends Document {
    name: string;
    email: string;
    subject?: string;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ContactMessage: mongoose.Model<IContactMessage, {}, {}, {}, mongoose.Document<unknown, {}, IContactMessage, {}, {}> & IContactMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ContactMessage.d.ts.map