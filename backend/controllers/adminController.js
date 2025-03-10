const propertySchema = require("../schemas/propertyModel");
const userSchema = require("../schemas/userModel");
const bookingSchema = require("../schemas/bookingModel");

/////////getting all users///////////////
const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find({ type: { $ne: "Admin" } });
    if (!allUsers) {
      return res.status(401).send({
        success: false,
        message: "No users present",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All users",
        data: allUsers,
      });
    }
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
  }
};

/////////handling status for owner/////////
const handleStatusController = async (req, res) => {
  const { userid, status } = req.body;
  try {
    const user = await userSchema.findByIdAndUpdate(
      userid,
      { granted: status },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: `User has been ${status}`,
    });
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
  }
};

/////////getting all properties in app//////////////
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await propertySchema.find({});
    if (!allProperties) {
      return res.status(401).send({
        success: false,
        message: "No properties presents",
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "All properties",
        data: allProperties,
      });
    }
  } catch (error) {
    console.log("Error in get All Users Controller ", error);
  }
};

////////get all bookings////////////
const getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await bookingSchema.find()
      .populate({
        path: 'propertyId',
        select: 'propertyAddress propertyType propertyAdType'
      })
      .populate({
        path: 'ownerID',
        select: 'name phone'
      })
      .lean();

    // Transform the data to match the frontend expectations
    const transformedBookings = allBookings.map(booking => ({
      _id: booking._id,
      propertyId: booking.propertyId?._id || 'N/A',
      propertyAddress: booking.propertyId?.propertyAddress || 'N/A',
      ownerName: booking.ownerID?.name || 'N/A',
      ownerPhone: booking.ownerID?.phone || 'N/A',
      bookingStatus: booking.bookingStatus || 'N/A'
    }));

    return res.status(200).send({
      success: true,
      data: transformedBookings,
    });
  } catch (error) {
    console.log("Error in get All Bookings Controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching bookings",
    });
  }
};

////////delete property////////////
const deletePropertyController = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // First, delete all bookings related to this property
    await bookingSchema.deleteMany({ propertyId });
    
    // Then delete the property
    const property = await propertySchema.findByIdAndDelete(propertyId);
    if (!property) {
      return res.status(404).send({
        success: false,
        message: "Property not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Property and related bookings deleted successfully",
    });
  } catch (error) {
    console.log("Error in delete Property Controller ", error);
    return res.status(500).send({
      success: false,
      message: "Error deleting property and related bookings",
    });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
  deletePropertyController
};
