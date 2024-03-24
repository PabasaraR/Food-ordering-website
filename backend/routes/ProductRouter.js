const express = require("express");

const router = express.Router();

const Product = require("../modals/ProductModel");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frountend/src/Images"); // Specify where to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // Specify filename
  },
});
const upload = multer({ storage: storage });

router.post("/products/add", upload.single("image"), async (req, res) => {
  console.log("File uploaded:", req.file);
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: req.file.filename,
  });
  try {
    await newProduct.save();
    return res.status(200).json({ success: "Order saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/products/get", async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

//router.get("/product/getCategory", async (req, res) => {
//const { category } = req.body;

// const product = await Product.findOne({ category: category });
// if (product) {
//   return res.status(200).json({ product });
// } else {
//   return res.status(401).json({ error: "Invalid  " });
//  }
//});

router.get("/uppProducts", async (req, res) => {
  try {
    const uppProducts = await Product.find()
      .sort({ currentReachRatio: -1 })
      .limit(5);

    return res.status(200).json({ uppProducts });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

//router.get("/product/get/:id", async (req, res) => {
//try {
// const product = await Product.findById(req.params.id);
// return res.status(200).json({ success: true, product });
//} catch (err) {
// res.status(400).json({ error: err });
//}
//});

router.post("/product/get", async (req, res) => {
  try {
    const { ids } = req.body; // Assuming IDs are sent in the request body as an array

    const products = await Product.find({ _id: { $in: ids } });

    return res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/product/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: "post deleted successful" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.put("/product/update/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { $set: req.body });
    return res.status(200).json({ success: "post update successful" });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/oneproduct/get/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);

    return res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
