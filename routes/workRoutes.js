const { Router } = require('express')
const workController = require('../controllers/workController')
const { authKontrol } = require('../middleware/authMiddleware')

const router = Router()

router.get('/work-add', authKontrol, workController.work_add_get)

module.exports = router