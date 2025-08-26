import mongoose, { Document, Schema } from 'mongoose';

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

const CertificateSchema = new Schema<ICertificate>({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true,
    maxlength: [100, 'Organization cannot exceed 100 characters']
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    validate: {
      validator: function (date: Date) {
        return date <= new Date();
      },
      message: 'Issue date cannot be in the future'
    }
  },
  credentialId: {
    type: String,
    trim: true,
    maxlength: [100, 'Credential ID cannot exceed 100 characters']
  },
  url: {
    type: String,
    match: [/^https?:\/\/.+/, 'URL must be a valid URL']
  },
  image: {
    type: String,
    match: [/^https?:\/\/.+/, 'Image must be a valid URL']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
CertificateSchema.index({ issueDate: -1 });
CertificateSchema.index({ organization: 1 });
CertificateSchema.index({ tags: 1 });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
