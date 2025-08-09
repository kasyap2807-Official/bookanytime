const express = require("express");
const multer = require("multer");
const router = express.Router();
const Property = require("../models/properties");

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware to parse form fields properly
const parseFormData = (req, res, next) => {

  console.log("Raw req.body:", req.body); 
  
  req.body.minPrice = Number(req.body.minPrice) || 0;
  req.body.maxPrice = Number(req.body.maxPrice) || 0;
  req.body.latitude = Number(req.body.latitude) || 0;
  req.body.longitude = Number(req.body.longitude) || 0;
  req.body.capacity = {
    adults: Number(req.body.adults) || 0,
    bedrooms: Number(req.body.bedrooms) || 0,
  };

  if (req.body.amenities) {
    req.body.amenities = req.body.amenities.split(",");
  }

  next();
};

// @route   POST /api/properties
// @desc    Add a new property with image upload
router.post("/", upload.array("images", 20), parseFormData, async (req, res) => {
  try {
    const { name, category, description,house_rules, minPrice, maxPrice, city, address, latitude, longitude, amenities, capacity, popularity,whatsappNumber , instagram} = req.body;

    // Generate image URLs from uploaded files
    const imageUrls = req.files.map((file) => `https://api.bookanytime.in:5000/uploads/${file.filename}`);

    const newProperty = new Property({
      name,
      category,
      description,
      house_rules,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      city,
      address,
      latitude,
      longitude,
      amenities,
      capacity,
      popularity,
      images: imageUrls,
      whatsappNumber,
      instagram
    });

    const savedProperty = await newProperty.save();
    res.status(201).json({ message: "Property added successfully!", property: savedProperty });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Failed to add property", error });
  }
});


// @desc   update the property
router.put("/:id", upload.array("images", 20), async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(propertyId)
    const { name, category, description,house_rules, minPrice, maxPrice, city, address, latitude, longitude, amenities, adults, bedrooms,popularity, whatsappNumber, instagram } = req.body;
    
    // Convert numeric fields
    const updatedData = {
      name,
      category,
      description,
      house_rules,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      city,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      amenities: amenities ? amenities.split(",") : [],
      adults: Number(adults),
      bedrooms: Number(bedrooms),
      popularity :Number(popularity),
      whatsappNumber,
      instagram
    };

    // Handle image uploads (if new images are provided)
    if (req.files && req.files.length > 0) {
     // const imageUrls = req.files.map(file => `https://api.bookanytime.in:5000/uploads/${file.originalname}`); // Replace with actual cloud storage logic
      const imageUrls = req.files.map((file) => `https://api.bookanytime.in:5000/uploads/${file.filename}`);
      updatedData.images = imageUrls;
    }

    // Update property in MongoDB
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updatedData, { new: true });

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json({ message: "Property updated successfully!", property: updatedProperty });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Server error. Failed to update property." });
  }
});





// @desc    to get the property details on dropdwon to delete the property
// @desc    and to get all the propeties on click of any category in home page 
router.get("/", async (req, res) => {
  try {
    const { name, category } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search by name
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" }; // Case-insensitive search by category
    }

    const properties = await Property.find(filter);

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }
    console.log("Backend Properties Data:", properties);
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// @desc    to delete the property
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Search Properties by Name or Category
router.get("/search", async (req, res) => {
  try {
    const { query, categories } = req.query;
    console.log("query:", query);
    console.log("categories:", categories);

    let filter = {};

    // If query is provided, search by property name (case-insensitive)
    if (query && query.trim() !== "") {
      filter.name = { $regex: query.trim(), $options: "i" };
    }

    // If categories are provided and not empty, apply category filter
    if (categories && categories.length > 0) {
      filter.category = { $in: categories };
    }

    const properties = await Property.find(filter);
    res.json(properties);
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// api for search by location
router.get("/search-locations", async (req, res) => {
  try {
    const { query, category } = req.query;

    let filters = {};

    // Case-insensitive search for location (city or address)
    if (query) {
      filters.$or = [
        { address: { $regex: query, $options: "i" } },  // Search within address
        { city: { $regex: query, $options: "i" } },     // Search within city
      ];
    }

    // Filter by category if provided
    if (category && category !== "") {
      const selectedCategories = category.split(",");
      filters.category = { $in: selectedCategories }; // Supports multiple categories
    }

    // Fetch properties matching the filters
    const properties = await Property.find(filters);
    res.json(properties);  // Send the properties found
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// to fetch single property to display in update page
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Server error" });
  }
});






module.exports = router;
