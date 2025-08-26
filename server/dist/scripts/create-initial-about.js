"use strict";
const mongoose = require('mongoose');
require('dotenv').config();
// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};
// About schema (inline for this script)
const aboutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    description: { type: String, required: true },
    highlights: [String],
    personalInfo: {
        email: String,
        location: String,
        availableForWork: { type: Boolean, default: true },
        yearsOfExperience: Number
    },
    socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
        website: String
    },
    funFacts: [{
            title: { type: String, required: true },
            description: { type: String, required: true },
            icon: String
        }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const About = mongoose.model('About', aboutSchema);
// Initial about data
const initialAboutData = {
    title: "Hi, I'm Kishan Kumar",
    subtitle: "Full-Stack Developer & Tech Enthusiast",
    description: `I'm a passionate full-stack developer with a strong foundation in modern web technologies. Currently pursuing my B.Tech in Electronics & Communication Engineering at IES College of Technology under RGPV, I've dedicated myself to mastering the MERN stack and building impactful digital solutions.

My journey in tech has been marked by continuous learning and hands-on experience. From participating in hackathons like Smart India Hackathon 2023 where I reached the Grand Finale, to completing NPTEL certifications in IoT and Database Management Systems, I'm always pushing myself to grow and adapt to new challenges.

I believe in the power of technology to solve real-world problems. Whether it's building a comprehensive news aggregation platform like TheNewsHive, creating AI-powered SaaS applications like Chitra AI, or developing enterprise solutions like UniPortal ERP system, I strive to create software that makes a meaningful impact.

Beyond coding, I'm passionate about exploring emerging technologies, contributing to open-source projects, and sharing knowledge with the developer community. I'm always excited to collaborate on innovative projects and take on new challenges that push the boundaries of what's possible.`,
    highlights: [
        "Smart India Hackathon 2023 Grand Finalist",
        "MERN Stack Specialist with 3+ years experience",
        "Built and deployed 10+ full-stack applications",
        "Experience with payment integration (Razorpay) and cloud platforms",
        "Strong foundation in IoT and embedded systems",
        "Active participant in hackathons and technical competitions"
    ],
    personalInfo: {
        email: "kishan@example.com",
        location: "Bhopal, India",
        availableForWork: true,
        yearsOfExperience: 3
    },
    socialLinks: {
        linkedin: "https://linkedin.com/in/kishan-kumar",
        github: "https://github.com/kishan-kumar",
        website: "https://kishan-portfolio.com"
    },
    funFacts: [
        {
            title: "Hackathon Enthusiast",
            description: "I've participated in multiple hackathons including Smart India Hackathon 2023 where I reached the Grand Finale in Jaipur.",
            icon: "sparkles"
        },
        {
            title: "Continuous Learner",
            description: "I regularly take online courses and certifications. Recently completed NPTEL courses in IoT and DBMS with good scores.",
            icon: "book-open"
        },
        {
            title: "Problem Solver",
            description: "I love tackling complex problems and finding elegant solutions. From news aggregation to AI-powered tools, I enjoy diverse challenges.",
            icon: "code-bracket"
        },
        {
            title: "Tech Explorer",
            description: "Always excited about emerging technologies. Currently exploring AI/ML integration in web applications and IoT solutions.",
            icon: "globe-alt"
        }
    ],
    isActive: true
};
async function createInitialAbout() {
    try {
        await connectDB();
        // Check if about data already exists
        const existingAbout = await About.findOne();
        if (existingAbout) {
            console.log('ℹ️ About data already exists. Skipping creation.');
            return;
        }
        // Create the initial about entry
        const about = new About(initialAboutData);
        await about.save();
        console.log('✅ Initial about data created successfully!');
        console.log(`📝 Title: ${about.title}`);
        console.log(`📧 Email: ${about.personalInfo.email}`);
        console.log(`📍 Location: ${about.personalInfo.location}`);
        console.log(`🎯 Highlights: ${about.highlights.length} items`);
        console.log(`🎉 Fun Facts: ${about.funFacts.length} items`);
    }
    catch (error) {
        console.error('❌ Error creating initial about data:', error);
    }
    finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}
// Run the script
createInitialAbout();
//# sourceMappingURL=create-initial-about.js.map