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
exports.Certificate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CertificateSchema = new mongoose_1.Schema({
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
            validator: function (date) {
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
exports.Certificate = mongoose_1.default.model('Certificate', CertificateSchema);
//# sourceMappingURL=Certificate.js.map