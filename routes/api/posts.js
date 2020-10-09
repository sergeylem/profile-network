const express = require('express');
const router = express.Router();
const { check, validationResult } = require(express - validator / check);
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Prifile = require('../../models/Profile');
const User = require('../../models/User');

//@route    POST api/post
//@desc     Create a post
//@access   Private
router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select(-password);

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.body.id
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}
);

//@route    GET api/post
//@desc     get all posts
//@access   Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await new Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route    GET api/post
//@desc     get post by id
//@access   Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await new Post.findById(req.params.id);

    if(!post) {
      res.status(404).json({msg: 'Post not found'});
    }

    res.json(post);
  } catch (err) {
    console.log(err.message);
    if(err.kind === 'ObjectId') {
      res.status(404).json({msg: 'Post not found'});
    }
    res.status(500).send('Server error');
  }
});

//@route    DELETE api/post/:id
//@desc     delete post by id
//@access   Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await new Post.findById(req.params.id);
    
    if(!post) {
      res.status(404).json({msg: 'Post not found'});
    }

    if(post.user.toString() !== req.user.id) {
      res.status(401).json({msg: 'User not authorized'});
    }
    await post.remove();
    res.json({msg: 'Post removed'});
  } catch (err) {
    console.log(err.message);
    if(err.kind === 'ObjectId') {
      res.status(404).json({msg: 'Post not found'});
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;