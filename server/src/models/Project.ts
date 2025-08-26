import mongoose, { Document, Schema } from 'mongoose';

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

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Project slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  links: {
    github: {
      type: String,
      match: [/^https?:\/\/.+/, 'GitHub link must be a valid URL']
    },
    live: {
      type: String,
      match: [/^https?:\/\/.+/, 'Live link must be a valid URL']
    }
  },
  images: [{
    type: String,
    match: [/^https?:\/\/.+/, 'Image must be a valid URL']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ProjectSchema.index({ featured: -1, order: 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
