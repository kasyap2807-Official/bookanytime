const express = require("express");
const multer = require("multer");
const Offer = require("../models/Offer");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ 1. Add Offer
router.post("/add", upload.array("images", 100), async (req, res) => {
  try {
    const { category, properties, startDate, endDate } = req.body;
    const propertyList = JSON.parse(properties); // Convert JSON string back to an array

    if (!category || propertyList.length === 0 || !req.files || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    const newOffer = new Offer({
      category,
      properties: propertyList,
      image: imageUrls,
      startDate,
      endDate,
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer added successfully", offer: newOffer });
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ✅ 2. Get All Offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ 3. Get Offers by Category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const offers = await Offer.find({ category });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ 4. Delete Offer
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer) return res.status(404).json({ message: "Offer not found" });

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ 5. Update Offer
router.put("/update/:id", upload.array("images"), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, properties, startDate, endDate, removeImages } = req.body;

    console.log("Updating Offer ID:", id);
    console.log("Received Data:", req.body);

    const offer = await Offer.findById(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    // Handle image removal
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages);
      offer.image = offer.image.filter((img) => !imagesToRemove.includes(img));
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      offer.image = [...offer.image, ...newImages]; // Keep existing images + new images
    }

    // Update other fields
    if (category) offer.category = category;
    
    // Update properties (multiple properties can be passed as an array)
    if (properties) {
      const propertyList = JSON.parse(properties); // Convert JSON string back to an array if needed
      offer.properties = propertyList; // Update properties field
    }

    if (startDate) offer.startDate = startDate;
    if (endDate) offer.endDate = endDate;

    await offer.save();
    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ 6. Get Offer by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
