const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//added asyncs to routers
router.get('/', async (req, res) => {
  // find all categories
  
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }], // be sure to include its associated Products
    });
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to retrieve categories' });
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }], // be sure to include its associated Products
    });
    if (!category) {
      res.status(404).json({ error: 'unable to find category' });
      return;
    }
    res.status(200).json(category); // 200 for when category is found
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'unable to get category' });
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'category creation failed' });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedCategory[0] === 0) {
      res.status(404).json({ error: 'unable to find category' });
      return;
    }
    res.status(200).json({ message: 'category was updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'unable to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!deletedCategory) {
      res.status(404).json({ error: 'unable to find category' });
      return;
    }
    res.status(200).json({ message: 'category was deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'unable to delete category' });
  }
});

module.exports = router;
