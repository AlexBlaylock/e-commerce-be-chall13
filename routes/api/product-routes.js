const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to retrieve products' });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' },
      ],
    });
    if (!product) {
      res.status(404).json({ error: 'product was not found' });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to retrieve product' });
  }

});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
 //changed to try and catch function for my sake, easier for me to implement
    try {
      const newProduct = await Product.create(req.body);
  
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
      }
      //201 here because we're creating newProduct
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    // Update product data by ID
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // If there are product tags, handle updating product tags
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      // create filtered list of new tag_ids
      const newTagIds = req.body.tagIds.filter(
        (tag_id) =>
          !productTags.some((productTag) => productTag.tag_id === tag_id)
      );

      // remove tags not in new tag_ids
      await ProductTag.destroy({
        where: {
          product_id: req.params.id,
          tag_id: productTags
            .filter((productTag) => !newTagIds.includes(productTag.tag_id))
            .map((productTag) => productTag.tag_id),
        },
      });

      // create new product tags
      const newProductTags = newTagIds.map((tag_id) => ({
        product_id: req.params.id,
        tag_id,
      }));

      await ProductTag.bulkCreate(newProductTags);
    }
    
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // delete by id
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedProduct) {
      res.status(404).json({ error: 'product was not found' });
      return;
    }
    res.status(200).json({ message: 'product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'product was not deleted' });
  }
});

module.exports = router;