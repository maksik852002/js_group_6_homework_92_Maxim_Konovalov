const express = require("express");
const bcrypt = require("bcrypt");
const axios = require('axios');
const nanoid = require('nanoid');
const path = require("path");
const multer = require("multer");

const User = require("../models/User");
const Track = require("../models/Track");
const config = require("../config");

const router = express.Router();
const auth = require('../middleware/authMiddleware');
const permit = require('../middleware/permit');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(404).send({ message: "Not Found" });
  }
});

router.post("/", [upload.single("image")], async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName,
  });
  if(req.file) {
    user.image = req.file.filename
  }
  try {
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/sessions", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({ error: "Username or password is incorrect" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(400).send({ error: "Username or password is incorrect" });
  }

  user.generateToken();
  await user.save();

  res.send(user);
});

router.post('/facebook', async (req, res) => {
  try {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
    const url = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    const response = await axios.get(url);
    if (response.data.data.error) {
      return res.status(401).send({message: 'Facebook token incorrect'});
    }

    if (req.body.id !== response.data.data.user_id) {
      return res.status(401).send({message: 'User ID incorrect'});
    }

    let user = await User.findOne({facebookId: req.body.id})

    if (!user) {
      user = new User({
        username: req.body.id,
        password: nanoid(10),
        facebookId: req.body.id,
        displayName: req.body.name,
        image: req.body.picture.data.url.toString()
      });
    }

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (error) {
    return res.sendStatus(401);
  }
});

router.put("/:id", [auth, permit('admin', 'user')], async (req, res) => {
  try {
    
    const user = await User.findById(req.params.id);
    const track = await Track.findById(req.body.track).populate("album");
    let index = user.tracks.findIndex(el => el.id.toString() === req.body.track);
      if (index !== -1) {
      user.tracks.splice(index, 1)
      } else {
      user.tracks.push({id: track._id, name: track.name, published: track.published, album: track.album, duration: track.duration, sn: track.sn})
      }
    user.save()
    res.send(user);
  } catch (e) {
    res.status(404).send({ message: "Not Found" });
  }
});

router.delete("/sessions", async (req, res) => {
  const success = {message: 'Success'};
  try {
    const token = req.get('Authorization').split(' ')[1];
    if (!token) return res.send(success);
    const user = await User.findOne({token});
    if (!user) return res.send(success);

    user.generateToken();
    await user.save();
    return res.send(success)
  } catch (error) {
    return res.send(success)
  }
});

module.exports = router;
