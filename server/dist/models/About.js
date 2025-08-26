"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.About = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AboutSchema = new mongoose_1.Schema({
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
AboutSchema.virtual('readingTime').get(function () {
    const wordsPerMinute = 200;
    const wordCount = this.description.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
});
exports.About = mongoose_1.default.model('About', AboutSchema);
//# sourceMappingURL=About.js.map