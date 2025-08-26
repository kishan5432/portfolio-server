import mongoose, { Document, Schema } from 'mongoose';

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

const AboutSchema = new Schema<IAbout>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [150, 'Subtitle cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  highlights: [{
    type: String,
    trim: true,
    maxlength: [200, 'Highlight cannot exceed 200 characters']
  }],
  personalInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    availableForWork: {
      type: Boolean,
      default: true
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience cannot exceed 50']
    }
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  funFacts: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Fun fact title cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Fun fact description cannot exceed 200 characters']
    },
    icon: {
      type: String,
      trim: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
AboutSchema.index({ isActive: 1 });
AboutSchema.index({ createdAt: -1 });

// Virtual for reading time (approximate)
AboutSchema.virtual('readingTime').get(function (this: IAbout) {
  const wordsPerMinute = 200;
  const wordCount = this.description.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
});

export const About = mongoose.model<IAbout>('About', AboutSchema);
