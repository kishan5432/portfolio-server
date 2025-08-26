import mongoose, { Document } from 'mongoose';
export interface ITimelineItem extends Document {
    title: string;
    type: 'work' | 'education' | 'achievement' | 'other';
    startDate: Date;
    endDate?: Date;
    description: string;
    bullets: string[];
    icon?: string;
    location?: string;
    company?: string;
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const TimelineItem: mongoose.Model<ITimelineItem, {}, {}, {}, mongoose.Document<unknown, {}, ITimelineItem, {}, {}> & ITimelineItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TimelineItem.d.ts.map