import mongoose, { Document } from 'mongoose';
export interface IAbout extends Document {
    title: string;
    subtitle?: string;
    description: string;
    highlights: string[];
    personalInfo: {
        email?: string;
        location?: string;
        availableForWork: boolean;
        yearsOfExperience?: number;
    };
    socialLinks: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
    };
    funFacts: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const About: mongoose.Model<IAbout, {}, {}, {}, mongoose.Document<unknown, {}, IAbout, {}, {}> & IAbout & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=About.d.ts.map