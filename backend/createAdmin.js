require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = require('./schemas/userModel');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_DB);
        console.log('Connected to MongoDB');

        // Admin user details
        const adminData = {
            name: "System Admin",
            email: "admin@homeeasy.com",
            password: "Admin@123",
            type: "Admin"
        };

        // Check if admin already exists
        const existingAdmin = await userSchema.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const adminUser = new userSchema({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            type: "Admin"
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin(); 