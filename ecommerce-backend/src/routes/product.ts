import express from 'express'
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getSingleProduct,
  getlatestProducts,
  newProduct,
  searchAllProducts,
  updateProduct,
} from '../controllers/product.js'
import { singleUpload } from '../middlewares/multer.js'
import { adminOnly } from '../middlewares/auth.js'

const router = express.Router()

router.post('/new', adminOnly, singleUpload, newProduct)
router.get('/all', searchAllProducts)
router.get('/latest', getlatestProducts)
router.get('/categories', getAllCategories)
router.get('/admin-products', adminOnly, getAdminProducts)
router
  .route('/:id')
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct)

export default router
