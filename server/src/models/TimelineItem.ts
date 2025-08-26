import mongoose, { Document, Schema } from 'mongoose';

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

const TimelineItemSchema = new Schema<ITimelineItem>({
  title: {
    type: String,
    required: [true, 'Timeline item title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['work', 'education', 'achievement', 'other'],
      message: 'Type must be one of: work, education, achievement, other'
    },
    default: 'work'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  bullets: [{
    type: String,
    trim: true,
    maxlength: [300, 'Bullet point cannot exceed 300 characters']
  }],
  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'Icon cannot exceed 50 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company cannot exceed 100 characters']
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [30, 'Skill cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for current status
TimelineItemSchema.virtual('isCurrent').get(function (this: ITimelineItem) {
  return !this.endDate || this.endDate > new Date();
});

// Indexes
TimelineItemSchema.index({ startDate: -1 });
TimelineItemSchema.index({ endDate: -1 });
TimelineItemSchema.index({ type: 1 });
TimelineItemSchema.index({ company: 1 });

export const TimelineItem = mongoose.model<ITimelineItem>('TimelineItem', TimelineItemSchema);
