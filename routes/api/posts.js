const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const { collection } = require('../../models/Post');

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

    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
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

    if (!post) {
      res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

//@route    PUT api/posts/like/:id
//@desc     Like a post
//@access   Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save;
    res.json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

//@route    PUT api/posts/unlike/:id
//@desc     Unlike a post
//@access   Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (post.likes.filter(like => like.user.toString === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not been liked yet' });
    }

    //Get remove Index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save;
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

//@route    POST api/post/comment/:id
//@desc     Comment on a post
//@access   Private
router.post('/comment/:id', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select(-password);
    const post = await Post.findById(req.params.id);

    const newComment = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.body.id
    });

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route    DELETE api/post/comment/:id/:comment_id
//@desc     delete comment
//@access   Private

router.delete('api/post/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id)

    //make shure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //check user
    if (comment.user.toString !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    //Get remove Index
    const removeIndex = post.comments
      .map(comment => comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save;
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

})

module.exports = router;

