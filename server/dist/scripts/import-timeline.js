"use strict";
const mongoose = require('mongoose');
require('dotenv').config();
// Timeline item schema (matching your existing schema)
const timelineItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['work', 'education', 'achievement', 'other']
    },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    company: { type: String },
    location: { type: String },
    bullets: [{ type: String }],
    skills: [{ type: String }],
    icon: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const TimelineItem = mongoose.model('TimelineItem', timelineItemSchema);
// Timeline data from your JSON
const timelineData = [
    {
        "title": "B.Tech in Electronics & Communication Engineering",
        "type": "education",
        "description": "Pursuing a 4-year Bachelor of Technology degree at IES College of Technology under RGPV.",
        "startDate": "2022-08-01",
        "endDate": "2026-08-01",
        "company": "IES College of Technology (RGPV)",
        "location": "Bhopal, India",
        "bullets": [
            "Studying electronics, computer science, and software development subjects",
            "Actively participating in hackathons, technical events, and workshops",
            "Building strong skills in MERN stack, IoT, and full-stack development"
        ],
        "skills": ["Electronics", "MERN Stack", "IoT", "Full-Stack Development"],
        "icon": "graduation-cap"
    },
    {
        "title": "CSIR-AMPRI Workshop — Renewable Energy Solutions",
        "type": "achievement",
        "description": "2-day workshop on renewable energy solutions organized by CSIR-AMPRI & IES College of Technology.",
        "startDate": "2023-01-12",
        "endDate": "2023-01-13",
        "company": "CSIR-AMPRI & IES College of Technology",
        "location": "Bhopal, India",
        "bullets": [
            "Explored renewable energy sources and systems",
            "Learned sustainable energy technologies",
            "Participated in group-based practical training"
        ],
        "skills": ["Renewable Energy", "Sustainability", "Skill Development"],
        "icon": "certificate"
    },
    {
        "title": "IoT Workshop — CONNECTX: Weaving Things Via Internet",
        "type": "achievement",
        "description": "Hands-on IoT training workshop organized by Vision (MANIT) with Indeyes Infotech Pvt. Ltd.",
        "startDate": "2023-09-09",
        "endDate": "2023-09-10",
        "company": "MANIT & Indeyes Infotech Pvt. Ltd.",
        "location": "Bhopal, India",
        "bullets": [
            "Gained exposure to IoT concepts and hardware",
            "Built small IoT applications through guided sessions",
            "Worked on real-time IoT integrations"
        ],
        "skills": ["IoT", "Embedded Systems", "Networking"],
        "icon": "microchip"
    },
    {
        "title": "Technovation 2023 (Participation)",
        "type": "achievement",
        "description": "Inter-college technical event organized by IES University in association with AICTE IDEA Lab.",
        "startDate": "2023-11-03",
        "endDate": "2023-11-04",
        "company": "IES University",
        "location": "Bhopal, India",
        "bullets": [
            "Presented a project in competition",
            "Networked with peers from multiple colleges"
        ],
        "skills": ["Innovation", "Project Presentation"],
        "icon": "trophy"
    },
    {
        "title": "Smart India Hackathon 2023 — Finalist",
        "type": "achievement",
        "description": "Participated in the Smart India Hackathon 2023 (Senior Software Edition) Grand Finale.",
        "startDate": "2023-12-19",
        "endDate": "2023-12-20",
        "company": "MoE, AICTE, SIH India",
        "location": "Jaipur, India",
        "bullets": [
            "Developed innovative technical solutions",
            "Worked in a team to solve real-world challenges",
            "Gained national-level hackathon exposure"
        ],
        "skills": ["Problem Solving", "Teamwork", "Hackathon"],
        "icon": "lightbulb"
    },
    {
        "title": "Certification — Introduction to IoT (NPTEL Elite)",
        "type": "education",
        "description": "Completed a 12-week NPTEL Elite certification on IoT from IIT Kharagpur.",
        "startDate": "2024-01-01",
        "endDate": "2024-04-30",
        "company": "NPTEL (IIT Kharagpur)",
        "location": "Online",
        "bullets": [
            "Scored 78% overall",
            "Learned IoT fundamentals, sensors, networking, and applications"
        ],
        "skills": ["IoT", "Networking", "Embedded Systems"],
        "icon": "certificate"
    },
    {
        "title": "Techfest IIT Bombay Zonal Round (Participation)",
        "type": "achievement",
        "description": "Participated in Techfest Zonal Round organized by IIT Bombay at RICR Bhopal.",
        "startDate": "2024-10-06",
        "company": "IIT Bombay & RICR",
        "location": "Bhopal, India",
        "bullets": [
            "Competed in zonal-level technical challenges",
            "Collaborated with peers to present innovative ideas"
        ],
        "skills": ["Competition", "Innovation", "Teamwork"],
        "icon": "trophy"
    },
    {
        "title": "Project — TheNewsHive (News Aggregator)",
        "type": "work",
        "description": "News aggregation platform covering 206 countries in 89 languages and 18 categories.",
        "startDate": "2024-10-01",
        "endDate": "2024-11-30",
        "company": "Self Project",
        "location": "Bhopal, India",
        "bullets": [
            "Built with Express.js, Node.js, and Axios",
            "Implemented search and filter by country, language, and category",
            "Integrated multiple APIs for real-time news delivery"
        ],
        "skills": ["Node.js", "Express.js", "APIs"],
        "icon": "newspaper"
    },
    {
        "title": "Certification — Database Management System (NPTEL)",
        "type": "education",
        "description": "Completed an 8-week NPTEL certification on Database Management Systems from IIT Kharagpur.",
        "startDate": "2025-01-01",
        "endDate": "2025-03-31",
        "company": "NPTEL (IIT Kharagpur)",
        "location": "Online",
        "bullets": [
            "Scored 52% overall",
            "Learned database concepts, SQL queries, and indexing"
        ],
        "skills": ["Database", "SQL", "DBMS"],
        "icon": "database"
    },
    {
        "title": "Project — Chitra AI (Text-to-Image SaaS)",
        "type": "work",
        "description": "SaaS web app for AI-powered text-to-image generation with integrated payments.",
        "startDate": "2025-02-01",
        "endDate": "2025-03-31",
        "company": "Self Project",
        "location": "Bhopal, India",
        "bullets": [
            "MERN stack with REST APIs",
            "Razorpay payment integration",
            "Dashboard for credit-based usage tracking"
        ],
        "skills": ["MERN", "Payments", "AI"],
        "icon": "image"
    },
    {
        "title": "Project — UniPortal (ERP System)",
        "type": "work",
        "description": "Comprehensive ERP system for college management built with the MERN stack.",
        "startDate": "2025-05-01",
        "company": "Self Project",
        "location": "Bhopal, India",
        "bullets": [
            "Built with MERN stack",
            "Role-based access and secure authentication",
            "Modules for attendance, fee management, and scheduling"
        ],
        "skills": ["MERN", "Authentication", "ERP"],
        "icon": "laptop-code"
    },
    {
        "title": "Software Engineer Intern",
        "type": "work",
        "description": "Internship at YugaYatra Retail Pvt. Ltd., working on web apps, e-commerce, and freelancing projects.",
        "startDate": "2025-08-01",
        "endDate": "2025-10-31",
        "company": "YugaYatra Retail Pvt. Ltd.",
        "location": "Remote",
        "bullets": [
            "Developed websites and apps for clients",
            "Managed e-commerce seller portals (Amazon, Flipkart)",
            "Collaborated with cross-functional teams using Google Workspace"
        ],
        "skills": ["MERN", "E-commerce", "Web Development", "Firebase"],
        "icon": "briefcase"
    }
];
async function importTimelineData() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Clear existing timeline items (optional - remove this if you want to keep existing items)
        const existingCount = await TimelineItem.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing timeline items`);
            const clearExisting = process.argv.includes('--clear');
            if (clearExisting) {
                await TimelineItem.deleteMany({});
                console.log('🗑️  Cleared existing timeline items');
            }
            else {
                console.log('ℹ️  Skipping import to preserve existing items. Use --clear flag to replace all items.');
                process.exit(0);
            }
        }
        // Process and insert timeline items
        const processedData = timelineData.map(item => ({
            ...item,
            startDate: new Date(item.startDate),
            endDate: item.endDate ? new Date(item.endDate) : undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        // Insert all items
        const result = await TimelineItem.insertMany(processedData);
        console.log(`✅ Successfully imported ${result.length} timeline items:`);
        // Display summary by type
        const summary = {};
        result.forEach(item => {
            summary[item.type] = (summary[item.type] || 0) + 1;
        });
        Object.entries(summary).forEach(([type, count]) => {
            console.log(`   📊 ${type}: ${count} items`);
        });
        console.log('\n🎉 Timeline import completed successfully!');
        console.log('🌐 You can now view your timeline at: http://localhost:3001/timeline');
    }
    catch (error) {
        console.error('❌ Error importing timeline data:', error);
        process.exit(1);
    }
    finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}
// Run the import
importTimelineData();
//# sourceMappingURL=import-timeline.js.map