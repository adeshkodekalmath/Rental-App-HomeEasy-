const express = require("express");
const authMiddlware = require("../middlewares/authMiddlware");
const bcrypt = require("bcryptjs");
const userSchema = require("../schemas/userModel");
const { getAllUsersController, handleStatusController, getAllPropertiesController, getAllBookingsController } = require("../controllers/adminController");

const router = express.Router()

// Create admin user route
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await userSchema.findOne({ email, type: "Admin" });
    if (existingAdmin) {
      return res.status(400).send({ message: "Admin already exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new userSchema({
      name,
      email,
      password: hashedPassword,
      type: "Admin"
    });

    await adminUser.save();
    
    return res.status(201).send({ 
      message: "Admin created successfully", 
      success: true 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ 
      message: "Error creating admin", 
      success: false 
    });
  }
});

router.get('/getallusers', authMiddlware, getAllUsersController)

router.post('/handlestatus', authMiddlware, handleStatusController)

router.get('/getallproperties', authMiddlware, getAllPropertiesController)

router.get('/getallbookings', authMiddlware, getAllBookingsController)

module.exports = router