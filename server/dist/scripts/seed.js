#!/usr/bin/env tsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const logger_1 = require("../utils/logger");
const models_1 = require("../models");
const env_1 = __importDefault(require("../config/env"));
const sampleProjects = [
    {
        title: 'Portfolio Website',
        slug: 'portfolio-website',
        description: 'A modern, responsive portfolio website built with React, TypeScript, and Node.js. Features a beautiful UI with smooth animations, dark/light themes, and a powerful admin dashboard for content management.',
        tags: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        links: {
            github: 'https://github.com/username/portfolio',
            live: 'https://portfolio.example.com'
        },
        images: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'
        ],
        featured: true,
        order: 1
    },
    {
        title: 'E-commerce Platform',
        slug: 'ecommerce-platform',
        description: 'A full-stack e-commerce solution with user authentication, payment processing, inventory management, and order tracking. Built with modern technologies for scalability and performance.',
        tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'Vercel'],
        links: {
            github: 'https://github.com/username/ecommerce',
            live: 'https://ecommerce.example.com'
        },
        images: [
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'
        ],
        featured: true,
        order: 2
    },
    {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.',
        tags: ['Vue.js', 'Socket.io', 'Express.js', 'Redis', 'Docker'],
        links: {
            github: 'https://github.com/username/task-manager',
            live: 'https://tasks.example.com'
        },
        images: [
            'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800'
        ],
        featured: false,
        order: 3
    }
];
const sampleCertificates = [
    {
        title: 'AWS Certified Solutions Architect',
        organization: 'Amazon Web Services',
        issueDate: new Date('2023-06-15'),
        credentialId: 'AWS-SA-2023-12345',
        url: 'https://aws.amazon.com/certification/',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        tags: ['AWS', 'Cloud', 'Architecture']
    },
    {
        title: 'Professional Scrum Master I',
        organization: 'Scrum.org',
        issueDate: new Date('2023-03-20'),
        credentialId: 'PSM-I-2023-67890',
        url: 'https://scrum.org/assessments/professional-scrum-master-i',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
        tags: ['Scrum', 'Agile', 'Management']
    },
    {
        title: 'Google Cloud Professional Developer',
        organization: 'Google Cloud',
        issueDate: new Date('2022-11-10'),
        credentialId: 'GCP-DEV-2022-11111',
        url: 'https://cloud.google.com/certification',
        image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400',
        tags: ['GCP', 'Cloud', 'Development']
    }
];
const sampleTimelineItems = [
    {
        title: 'Senior Full Stack Developer',
        startDate: new Date('2022-01-15'),
        endDate: null,
        description: 'Leading development of scalable web applications and mentoring junior developers.',
        bullets: [
            'Led a team of 5 developers in building a microservices architecture',
            'Implemented CI/CD pipelines reducing deployment time by 70%',
            'Architected and developed a real-time analytics dashboard',
            'Mentored 3 junior developers and conducted technical interviews'
        ],
        icon: 'briefcase',
        location: 'Tech Company Inc., San Francisco, CA'
    },
    {
        title: 'Full Stack Developer',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2022-01-14'),
        description: 'Developed and maintained multiple client-facing applications using modern web technologies.',
        bullets: [
            'Built responsive web applications using React and Node.js',
            'Optimized database queries improving performance by 50%',
            'Collaborated with design team to implement pixel-perfect UIs',
            'Participated in code reviews and maintained high code quality standards'
        ],
        icon: 'code',
        location: 'StartupXYZ, Remote'
    },
    {
        title: 'Computer Science Degree',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2020-05-31'),
        description: 'Bachelor of Science in Computer Science with focus on software engineering and algorithms.',
        bullets: [
            'Graduated Magna Cum Laude with 3.8 GPA',
            'Relevant coursework: Data Structures, Algorithms, Database Systems, Software Engineering',
            'Senior project: Machine learning-based recommendation system',
            'Teaching Assistant for Introduction to Programming course'
        ],
        icon: 'academic-cap',
        location: 'University of Technology'
    }
];
const sampleSkills = [
    // Frontend
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Frontend' },
    { name: 'Vue.js', level: 75, category: 'Frontend' },
    { name: 'Next.js', level: 80, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 85, category: 'Frontend' },
    // Backend
    { name: 'Node.js', level: 90, category: 'Backend' },
    { name: 'Express.js', level: 85, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Backend' },
    { name: 'FastAPI', level: 70, category: 'Backend' },
    { name: 'GraphQL', level: 65, category: 'Backend' },
    // Database
    { name: 'MongoDB', level: 85, category: 'Database' },
    { name: 'PostgreSQL', level: 80, category: 'Database' },
    { name: 'Redis', level: 75, category: 'Database' },
    { name: 'Prisma', level: 70, category: 'Database' },
    // DevOps
    { name: 'Docker', level: 80, category: 'DevOps' },
    { name: 'AWS', level: 75, category: 'DevOps' },
    { name: 'CI/CD', level: 70, category: 'DevOps' },
    { name: 'Kubernetes', level: 60, category: 'DevOps' },
    // Tools
    { name: 'Git', level: 90, category: 'Tools' },
    { name: 'VS Code', level: 85, category: 'Tools' },
    { name: 'Figma', level: 70, category: 'Design' },
    { name: 'Postman', level: 80, category: 'Tools' }
];
const sampleContactMessages = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hi! I\'m interested in discussing a potential project collaboration. Would love to chat about your React expertise.',
        read: false
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        message: 'We\'re looking for a senior developer to join our team. Your portfolio is impressive! Can we schedule a call?',
        read: true
    },
    {
        name: 'Mike Chen',
        email: 'mike.chen@startup.io',
        message: 'Saw your work on the e-commerce platform. We\'re building something similar and could use your expertise.',
        read: false
    }
];
async function createAdminUser() {
    try {
        // Check if admin user already exists
        const existingAdmin = await models_1.User.findOne({ email: env_1.default.ADMIN_EMAIL });
        if (existingAdmin) {
            logger_1.logger.info('Admin user already exists');
            return existingAdmin;
        }
        if (!env_1.default.ADMIN_EMAIL || !env_1.default.ADMIN_PASSWORD) {
            logger_1.logger.warn('ADMIN_EMAIL or ADMIN_PASSWORD not provided in environment variables');
            return null;
        }
        const adminUser = new models_1.User({
            email: env_1.default.ADMIN_EMAIL,
            passwordHash: env_1.default.ADMIN_PASSWORD, // Will be hashed by the pre-save hook
            role: 'admin'
        });
        await adminUser.save();
        logger_1.logger.info(`✅ Admin user created: ${env_1.default.ADMIN_EMAIL}`);
        return adminUser;
    }
    catch (error) {
        logger_1.logger.error('Error creating admin user:', error);
        throw error;
    }
}
async function seedProjects() {
    try {
        const existingCount = await models_1.Project.countDocuments();
        if (existingCount > 0) {
            logger_1.logger.info(`Projects already exist (${existingCount} found), skipping...`);
            return;
        }
        await models_1.Project.insertMany(sampleProjects);
        logger_1.logger.info(`✅ Created ${sampleProjects.length} projects`);
    }
    catch (error) {
        logger_1.logger.error('Error seeding projects:', error);
        throw error;
    }
}
async function seedCertificates() {
    try {
        const existingCount = await models_1.Certificate.countDocuments();
        if (existingCount > 0) {
            logger_1.logger.info(`Certificates already exist (${existingCount} found), skipping...`);
            return;
        }
        await models_1.Certificate.insertMany(sampleCertificates);
        logger_1.logger.info(`✅ Created ${sampleCertificates.length} certificates`);
    }
    catch (error) {
        logger_1.logger.error('Error seeding certificates:', error);
        throw error;
    }
}
async function seedTimelineItems() {
    try {
        const existingCount = await models_1.TimelineItem.countDocuments();
        if (existingCount > 0) {
            logger_1.logger.info(`Timeline items already exist (${existingCount} found), skipping...`);
            return;
        }
        await models_1.TimelineItem.insertMany(sampleTimelineItems);
        logger_1.logger.info(`✅ Created ${sampleTimelineItems.length} timeline items`);
    }
    catch (error) {
        logger_1.logger.error('Error seeding timeline items:', error);
        throw error;
    }
}
async function seedSkills() {
    try {
        const existingCount = await models_1.Skill.countDocuments();
        if (existingCount > 0) {
            logger_1.logger.info(`Skills already exist (${existingCount} found), skipping...`);
            return;
        }
        await models_1.Skill.insertMany(sampleSkills);
        logger_1.logger.info(`✅ Created ${sampleSkills.length} skills`);
    }
    catch (error) {
        logger_1.logger.error('Error seeding skills:', error);
        throw error;
    }
}
async function seedContactMessages() {
    try {
        const existingCount = await models_1.ContactMessage.countDocuments();
        if (existingCount > 0) {
            logger_1.logger.info(`Contact messages already exist (${existingCount} found), skipping...`);
            return;
        }
        await models_1.ContactMessage.insertMany(sampleContactMessages);
        logger_1.logger.info(`✅ Created ${sampleContactMessages.length} contact messages`);
    }
    catch (error) {
        logger_1.logger.error('Error seeding contact messages:', error);
        throw error;
    }
}
async function main() {
    try {
        logger_1.logger.info('🌱 Starting database seeding...');
        // Connect to database
        await (0, db_1.connectDatabase)();
        // Seed all collections
        await createAdminUser();
        await seedProjects();
        await seedCertificates();
        await seedTimelineItems();
        await seedSkills();
        await seedContactMessages();
        logger_1.logger.info('🎉 Database seeding completed successfully!');
    }
    catch (error) {
        logger_1.logger.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
    finally {
        await (0, db_1.disconnectDatabase)();
    }
}
// Run the seeder
if (require.main === module) {
    main();
}
exports.default = main;
//# sourceMappingURL=seed.js.map