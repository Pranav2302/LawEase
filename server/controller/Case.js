const Milestone = require("../models/Milestone")
const Case = require("../models/Case")
const User = require("../models/User")
const { uploadToCloudinary } = require("../utils/uploadToCloudinary")

//for client

exports.createCase = async(req, res) => {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    try {
        const userId = req.user.id;

        let {
            description,
            status,
            serviceProvider,
            caseAudio,
        } = req.body;

        // Check if caseDocument exists in req.files
        if (!req.files || !req.files.caseDocument) {
            return res.status(400).json({
                success: false,
                message: "Case document is required"
            });
        }

        if(!description || !serviceProvider || !caseAudio) {
            return res.status(400).json({
                success: false,
                message: "All fields (description, serviceProvider, caseAudio) are required"
            });
        }

        if(!status || status == "undefined") {
            status = "Open";
        }

        // Upload casedocument to cloudinary using the utility function
        const caseDocument = await uploadToCloudinary(
            req.files.caseDocument,
            process.env.FOLDER_NAME
        );
        console.log("Cloudinary result:", caseDocument);

        // Create a new case
        const newCase = await Case.create({
            description,
            status,
            serviceProvider,
            caseAudio,
            caseDocument: caseDocument.secure_url,
        });

        // Put a case in a user case collection
        await User.findByIdAndUpdate(userId,
            {
                $push: {
                    cases: newCase._id
                }
            },
            {new: true}
        );

        // Put case in a pendingCases of a Provider
        await User.findByIdAndUpdate(
            {
                _id: serviceProvider
            },
            {
                $push: {
                    pendingCaseRequest: newCase._id
                }
            },
            {new: true}
        );

        return res.status(200).json({
            success: true,
            data: newCase,
            message: "Case created successfully"
        });

    }
    catch(error) {
        console.log("Error in createCase:", error);
        return res.status(400).json({ success: false, message: "Error while creating case", error: error.message });
    }
};

exports.getAllCases = async (req, res) => {
    try {
        const providerId = req.user.id;

        // Get pending cases (cases where provider is in pendingCaseRequest)
        const pendingCases = await Case.find({
            serviceProvider: providerId,
            status: "Open"  // or "Pending" based on your status naming
        }).populate("client", "firstName lastName email");

        // Get accepted cases
        const acceptedCases = await Case.find({
            serviceProvider: providerId,
            status: "In-progress"
        }).populate("client", "firstName lastName email");

        // Get completed cases
        const completedCases = await Case.find({
            serviceProvider: providerId,
            status: "Completed"
        }).populate("client", "firstName lastName email");

        return res.status(200).json({
            success: true,
            cases: [...pendingCases, ...acceptedCases, ...completedCases]
        });

    } catch (error) {
        console.error("Error in getAllCases:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching cases",
            error: error.message
        });
    }
};

// Update case status
exports.updateCaseStatus = async (req, res) => {
    try {
        const { caseId, status } = req.body;
        const providerId = req.user.id;

        if (!caseId || !status) {
            return res.status(400).json({
                success: false,
                message: "Case ID and status are required"
            });
        }

        const case_ = await Case.findById(caseId);
        
        if (!case_) {
            return res.status(404).json({
                success: false,
                message: "Case not found"
            });
        }

        // Verify the provider is authorized to update this case
        if (case_.serviceProvider.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this case"
            });
        }

        // Update the case status
        case_.status = status;
        await case_.save();

        return res.status(200).json({
            success: true,
            message: "Case status updated successfully"
        });

    } catch (error) {
        console.error("Error in updateCaseStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating case status",
            error: error.message
        });
    }
};

//for provider
exports.acceptCase = async(req,res) => {
    try {
        const {caseId} = req.body;
        const providerId = req.user.id;

        if(!caseId) {
            return res.status(400).json({ 
                success: false, 
                message: "Case id is required" 
            });
        }

        const caseData = await Case.findById(caseId);

        if (!caseData) {
            return res.status(404).json({
                success: false,
                message: "Case not found"
            });
        }

        // Verify the provider is authorized to accept this case
        if (caseData.serviceProvider.toString() !== providerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to accept this case"
            });
        }

        // Create milestones
        const milestone1 = await Milestone.create({
            title: "Case accepted",
            description: "Case is accepted by the service provider",
            status: "Complete",
        });

        const milestone2 = await Milestone.create({
            title: "Consultation",
            description: "Consultation of proposed case is done",
            status: "Incomplete",
        });

        const milestone3 = await Milestone.create({
            title: "Case Resolved",
            description: "Case is resolved by the service provider",
            status: "Incomplete",
        });
        
        // Update case with milestones and status
        await Case.findByIdAndUpdate(caseId, {
            $push: {
                caseMilestones: { $each: [milestone1._id, milestone2._id, milestone3._id] }
            },
            status: "In-progress"
        });

        // Update provider's cases
        await User.findByIdAndUpdate(providerId, {
            $pull: { pendingCaseRequest: caseId },
            $push: { cases: caseId }
        });

        return res.status(200).json({ 
            success: true, 
            message: "Case accepted successfully" 
        });
    }
    catch(error) {
        console.error("Error in acceptCase:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error while accepting case",
            error: error.message
        });
    }
};

