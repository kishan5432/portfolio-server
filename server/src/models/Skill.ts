import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters'],
    unique: true
  },
  level: {
    type: Number,
    required: [true, 'Skill level is required'],
    min: [0, 'Skill level cannot be less than 0'],
    max: [100, 'Skill level cannot be more than 100']
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters'],
    enum: {
      values: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Tools', 'Languages', 'Frameworks', 'Other'],
      message: 'Category must be one of: Frontend, Backend, Database, DevOps, Mobile, Design, Tools, Languages, Frameworks, Other'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
SkillSchema.index({ category: 1, level: -1 });
SkillSchema.index({ name: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
