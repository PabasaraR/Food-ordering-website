const express = require("express");

const router = express.Router();

const User = require("../modals/UserModel");

router.post("/user/add", async (req, res) => {
  const { name, email, password, bORs } = req.body;
  const userExistsemail = await User.findOne({ email });
  if (userExistsemail) {
    return res.status(400).json({ error: "User already exists" });
  } else {
    const newUser = new User({ name, email, password, bORs });
    try {
      await newUser.save();
      return res.status(200).json({ success: "user save successful", newUser });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  }
});

router.post("/user/get", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({ success: "User login successful", user });
    } else {
      return res.status(401).json({ error: "Invalid  password" });
    }
  } else {
    return res.status(401).json({ error: "Invalid  " });
  }
});

router.put("/user/update/:userId", async (req, res) => {
  const { productId } = req.body;

  try {
    await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { cart: productId },
    });
    return res
      .status(200)
      .json({ success: "post update successful", productId });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/user/byProduct/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.status(200).json({ success: "post update successful", user });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/user/AorU/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.status(200).json({ success: "user find successful", user });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.put("/user/cartProductDelete/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { productId } = req.body;
    user.cart.pull(productId);
    await User.findByIdAndUpdate(req.params.userId, { cart: user.cart });

    return res.status(200).json({ success: "product deleted ok", user });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

module.exports = router;
