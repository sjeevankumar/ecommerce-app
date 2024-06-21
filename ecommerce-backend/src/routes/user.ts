import express from 'express'
import {
  newUser,
  getAllUsers,
  getUser,
  deleteUser,
} from '../controllers/user.js'

const router = express.Router()

router.post('/new', newUser)
router.get('/all', getAllUsers)
router.route('/:id').get(getUser).delete(deleteUser)

export default router
