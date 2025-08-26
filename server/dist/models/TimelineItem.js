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
exports.TimelineItem = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TimelineItemSchema = new mongoose_1.Schema({
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
TimelineItemSchema.virtual('isCurrent').get(function () {
    return !this.endDate || this.endDate > new Date();
});
// Indexes
TimelineItemSchema.index({ startDate: -1 });
TimelineItemSchema.index({ endDate: -1 });
TimelineItemSchema.index({ type: 1 });
TimelineItemSchema.index({ company: 1 });
exports.TimelineItem = mongoose_1.default.model('TimelineItem', TimelineItemSchema);
//# sourceMappingURL=TimelineItem.js.map