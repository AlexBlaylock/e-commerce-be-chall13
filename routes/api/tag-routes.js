const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
  // be sure to include its associated Product data
  const tags = await Tag.findAll({
    include: [{ model: Product, through: ProductTag, as: 'products' }],
  });
  res.status(200).json(tags);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'failed to retrieve tags' });
}
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
  // be sure to include its associated Product data
  const tag = await Tag.findByPk(req.params.id, {
    include: [{ model: Product, through: ProductTag, as: 'products' }],
  });
  if (!tag) {
    res.status(404).json({ error: 'taag was not found' });
    return;
  }
  res.status(200).json(tag);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'failed to retrieve tag' });
}
});

router.post('/', async (req, res) => {
  try {
  // create a new tag
  const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
  // update a tag's name by its `id` value
  const updatedTag = await Tag.update(
    { tag_name: req.body.tag_name },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (updatedTag[0] === 0) {
    res.status(404).json({ error: 'tag was not found' });
    return;
  }
  res.status(200).json({ message: 'tag updated' });
} catch (err) {
  console.error(err);
  res.status(400).json(err);
}
});

router.delete('/:id', async (req, res) => {
  try {
  // delete on tag by its `id` value
  const deletedTag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!deletedTag) {
    res.status(404).json({ error: 'tag was not found' });
    return;
  }
  res.status(200).json({ message: 'tag deleted' });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'failed to delete' });
}
});

module.exports = router;
