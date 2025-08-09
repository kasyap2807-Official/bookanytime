const express = require("express");
const router = express.Router();
const TrackData = require("../models/TrackData"); // Your Mongoose model

router.post("/contacts", async (req, res) => {
  try {
    const { userId, userName, userEmail, userPhoneNumber, propertyId, propertyName, propertyAddress, contactDate } = req.body;
    
    console.log("Data from frontend:", req.body);

    if (!userId || !propertyId || !contactDate) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Convert contactDate to YYYY-MM-DD format to ignore time
    const contactDateOnly = new Date(contactDate).toISOString().split("T")[0];

    // Check if the same user has already contacted this property on this date
    const existingContact = await TrackData.findOne({
      userId,
      propertyId,
      contactDate: { 
        $gte: new Date(contactDateOnly), 
        $lt: new Date(new Date(contactDateOnly).setDate(new Date(contactDateOnly).getDate() + 1)) 
      }
    });

    if (existingContact) {
      return res.status(200).json({ message: "Contact already saved for today." });
    }

    // Save new contact
    const newContact = new TrackData({
      userId,
      userName,
      userEmail,
      userPhoneNumber,
      propertyId,
      propertyName,
      propertyAddress,
      contactDate: new Date(contactDate), // Store original date
    });

    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully", newContact });

  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET route to fetch tracked contact data with pagination
router.get("/contacts", async (req, res) => {
    try {
        console.log("hitting get api")
      const contacts = await TrackData.find().sort({ contactDate: -1 });
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: "No contacts found" });
      }
  
      res.json({ contacts }); // Ensure this format: { contacts: [...] }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
module.exports = router;
