const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); 
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Add new category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

        // Check if category already exists (case-insensitive)
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } });

        if (existingCategory) {
          return res.status(400).json({ message: "Category name already exists" });
        }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newCategory = new Category({ name, image: imageUrl });
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// To get all the categories
router.get("/", async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  });

  // Delete category by ID
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
