const express = require("express");
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg' 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid){
        error = null;
    }

    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext =  MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

// Handle POST to /api/posts
router.post("", multer({storage: storage}).single('image'),  (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id,
    });
  });
});

// Handle GET to /api/posts
// app.use('/api/posts', (req, res) => {
//   const posts = [
//     {
//       id: "123",
//       title: "First server-side post",
//       content: "This is coming from the server",
//     },
//     {
//       id: "124",
//       title: "Second server-side post",
//       content: "This is coming from the server",
//     },
//   ];
// });

router.get("", async (req, res, next) => {
  try {
    const documents = await Post.find();
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  } catch (err) {
    res.status(500).json({
      message: "Fetching posts failed!",
      error: err.message,
    });
  }
});

router.delete("/:id", (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post deleted!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
