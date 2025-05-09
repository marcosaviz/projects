const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAll);
router.post('/', employeeController.create);
router.delete('/:id', employeeController.delete);

module.exports = router;
