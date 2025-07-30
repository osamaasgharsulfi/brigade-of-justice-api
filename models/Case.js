const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    caseCategory: { type: String, required: true },
    summary: { type: String, required: true },

    status: {
        type: String,
        enum: ['pending', 'under_review', 'accepted', 'closed'],
        default: 'pending'
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ NEW FIELD

    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    supportingDocs: { type: [String], default: [] },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deletedAt: { type: Date },

    createdBy: { type: String },
    updatedBy: { type: String },
    deletedBy: { type: String }
});

module.exports = mongoose.model('Case', CaseSchema);
