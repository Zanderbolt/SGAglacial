const express = require('express');
const router = express.Router();

const orden_servicioController = require('../controllers/orden_servicio.controller');

router.get('/', orden_servicioController.getOrdenesServicio);
router.get('/:id', orden_servicioController.getOrdenServicio);
router.post('/', orden_servicioController.createOrden_servicio);

module.exports = router;
