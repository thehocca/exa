const express = require('express');
const router = express.Router();
const Fake = require('../../middleware/fake');
const Controller = require('../../controller/system');

/**
 * @swagger
 * /healthcheck:
 *  get:
 *    tags:
 *       - System
 *    summary: Get system time
 *    description: To check Service
 *    responses:
 *      '200':
 *        description: A successful response
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealtCheck'
 *      '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.all('/healthcheck',Fake,Controller.healthcheck);



module.exports = router;
