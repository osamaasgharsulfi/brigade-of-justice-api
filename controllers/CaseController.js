const Case = require('../models/Case');

exports.createCase = async (req, res) => {
    try {
        const {
            fullName,
            title,
            description,
            caseCategory,
            summary
        } = req.body;

        const files = req.files || [];
        const filePaths = files.map(f => f.path);

        const newCase = new Case({
            fullName,
            title,
            description,
            caseCategory,
            summary,
            supportingDocs: filePaths,
            userId: req.user.id,
            createdBy: req.user.id
        });

        await newCase.save();
        res.status(201).json({ message: 'Case created successfully', caseId: newCase._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPendingCases = async (req, res) => {
    try {
        const pendingCases = await Case.find({ status: 'pending' });
        res.status(200).json(pendingCases);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve pending cases' });
    }
};

exports.updateCaseStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'under_review', 'accepted', 'closed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const updateData = {
            status,
            updatedAt: new Date(),
            updatedBy: req.user.id,
        };

        // Only track acceptedBy when status is "accepted"
        if (status === 'accepted') {
            updateData.acceptedBy = req.user.id;
        }

        const updatedCase = await Case.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCase) {
            return res.status(404).json({ error: 'Case not found' });
        }

        res.status(200).json({
            message: 'Case status updated successfully',
            caseId: updatedCase._id,
            newStatus: updatedCase.status,
            acceptedBy: updatedCase.acceptedBy
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update case status' });
    }
};


exports.getMyCases = async (req, res) => {
    try {
        const userCases = await Case.find({ userId: req.user.id });
        res.status(200).json(userCases);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch your cases' });
    }
};


exports.getAssignedCasesByAttorney = async (req, res) => {
    try {
        const attorneyId = req.user.id;

        const cases = await Case.find({ acceptedBy: attorneyId });

        res.status(200).json(cases);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve assigned cases' });
    }
};
