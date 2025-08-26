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
exports.Skill = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SkillSchema = new mongoose_1.Schema({
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
exports.Skill = mongoose_1.default.model('Skill', SkillSchema);
//# sourceMappingURL=Skill.js.map