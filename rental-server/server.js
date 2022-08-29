const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcrypt");
const path = require("path");

const {
  validateUser,
  validateEmail,
  validatePost,
} = require("./middlewares/validationMiddleware");

//Token
const jwt = require("jsonwebtoken");

//Cloudinary
const multer = require("multer");
const { storage } = require("./cloudinary");
const upload = multer({ storage });
const { cloudinary } = require("./cloudinary");

require("dotenv").config();

//App Configuration
const app = express();
const port = process.env.PORT || 8000;
const dbUrl = process.env.CONNECTION_URL;

//Middleware
app.use(cors());
app.use(express.json());

//DB Configuration
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => console.log("DB Connected!!"));

//API Endpoint
app.post("/auth/validateRegister", validateUser, (req, res) => {});

app.post("/auth/register", async (req, res) => {
  const { email_id, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ email_id, username, password: hashedPassword });
  newUser
    .save()
    .then((user) => {
      const token = jwt.sign(
        { currentUser: user._id, username: user.username },
        "secretValue",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
      console.log("New user added");
    })
    .catch((err) => {
      res.status(500).send(err);
      console.log(err);
    });
});

app.post("/auth/login", (req, res) => {
  const { email_id, password } = req.body;
  User.findOne({ email_id })
    .then(async (user) => {
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          const token = jwt.sign(
            { currentUser: user._id, username: user.username },
            "secretValue",
            { expiresIn: "1h" }
          );
          res.json({ token });
          console.log("Logged In");
        } else {
          res.status(200).send("*Invalid Password");
        }
      } else {
        res.status(200).send("*Invalid Credentials");
      }
    })
    .catch((err) => res.status(500).send(err));
});

app.post("/generate-url", upload.array("image"), (req, res) => {
  res.json(req.files);
  console.log("Link Generated");
});

// TODO: Delete it
// app.post('/generate-url', (req, res) => {
//     // res.json(req.files);
//     console.log("Link Generated");
// })

app.post("/new-post", validatePost, (req, res) => {
  const newPost = new Post(req.body);
  newPost
    .save()
    .then(() => res.status(200).send("Post added!"))
    .catch((err) => res.status(500).send(err));
  console.log("Line 42", newPost);
});

app.get("/allpost", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/search", (req, res) => {
  const searchKey = req.query.searchKey;
  const sortBy = req.query.sortBy;
  // console.log(searchKey , sortBy);
  if (sortBy === "Address") {
    Post.find({ address: { $regex: searchKey, $options: "i" } })
      .sort({ date: -1 })
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(500).send(err));
  } else if (sortBy === "Rent") {
    Post.find({ rent: { $lt: searchKey } })
      .sort({ date: -1 })
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(500).send(err));
  } else if (sortBy === "Rooms") {
    Post.find({ description: { $regex: searchKey, $options: "i" } })
      .sort({ date: -1 })
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(500).send(err));
  }
});

app.get("/specific-post/:id", (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/mypost/:id", (req, res) => {
  const { id } = req.params;
  Post.find({ author_id: id })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/edit-post/:id", validatePost, (req, res) => {
  // console.log("Line 182:", req.body);
  const { id } = req.params;
  Post.findByIdAndUpdate(id, req.body)
    .then((data) => res.status(200).send("Post Edited"))
    .catch((err) => res.status(500).send(err));
});

app.delete("/delete-post/:id", (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/delete-img-cloudinary", async (req, res) => {
  for (let filename of req.body) {
    console.log(filename);
    await cloudinary.uploader
      .destroy(filename)
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(500).send(err));
  }
});

app.use(express.static(path.join(__dirname, "../rental/build")))

//Server production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join("rental/build")));
//   app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "rental", "build", "index.html" )));
// }

app.listen(port, () => console.log(`Server running at ${port}`));
