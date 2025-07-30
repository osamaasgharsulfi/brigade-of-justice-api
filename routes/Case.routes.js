const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createCase, getPendingCases, updateCaseStatus, getMyCases, getAssignedCasesByAttorney } = require('../controllers/CaseController');
const authMiddleware = require('../middleware/authMiddleware');

// POST with file upload
router.post('/', authMiddleware, upload.array('supportingDocs', 5), createCase);
router.get('/pending', authMiddleware, getPendingCases);
router.put('/:id/status', authMiddleware, updateCaseStatus);
router.get('/my', authMiddleware, getMyCases);
router.get('/attorney/assigned', authMiddleware, getAssignedCasesByAttorney);
module.exports = router;
