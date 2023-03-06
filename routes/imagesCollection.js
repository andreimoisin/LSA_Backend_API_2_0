const router = require('express').Router();
const Image = require('../model/Image');
const verify = require('./verifyToken');

// POST /images/AddImage - Create a new image
router.post('/AddImage', async (req, res) => {
    try {
      const { link, index, category, name } = req.body;
      const image = new Image({ link, index, category, name });
      await image.save();
      res.status(201).json(image);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.get('/:category', function(req, res) {
    const category = req.params.category;
    Image.find({ category: category }, function(err, images) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      return res.status(200).json(images);
    });
  });

  router.delete('/delete/:link', (req, res) => {
    const link = req.params.link;
  
    Image.findOneAndDelete({ link: link }, (err, deletedImage) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
  
      if (!deletedImage) {
        return res.status(404).send("Link not found!");
      }
  
      return res.status(200).send(`Image with link ${link} was deleted.`);
    });
  });
  
  
  
  module.exports = router;