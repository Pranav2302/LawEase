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


//for provider
exports.acceptCase = async(req,res) => {
    try {
        //take case id
        const {caseId} = req.body

        console.log(req.body)

        //take userid
        const userId = req.user.id

        console.log("userId: ", userId)

        //if caseId missing
        if(!caseId) {
            return res.status(400).json({ 
                success: false, 
                message: "Case id is required" 
            })
        }

        //find case of that id 
        const caseData = await Case.findById(caseId)

        console.log("caseData: ", caseData)

        //make basic milestone and add to the case
        const milestone1 = await Milestone.create({
            title: "Case accepted",
            description: "Case is accepted by the service provider",
            status: "Complete",
        })

        console.log("milestone1: ", milestone1)

        const milestone2 = await Milestone.create({
            title: "Consultation",
            description: "Consultation of proposed case is done",
            status: "Incomplete",
        })

        const milestone3 = await Milestone.create({
            title: "Case Resolved",
            description: "Case is resolved by the service provider",
            status: "Incomplete",
        })
        
        //push milestones into case
        await Case.findByIdAndUpdate(caseId, {
            $push: {
                caseMilestones: { $each: [milestone1._id, milestone2._id, milestone3._id] }
            }
        })

        //update status
        await Case.findByIdAndUpdate(caseId, {
            status: "In-progress"
        })

        //remove from pendingCaseRequest of user
        await User.findByIdAndUpdate(userId, {
            $pull: {
                pendingCaseRequest: caseId
            }
        })

        //add to the cases collection of that user
        await User.findByIdAndUpdate(userId, {
            $push: {
                cases: caseData._id
            }
        })

        return res.status(200).json({ 
            success: true, 
            message: "Case accepted successfully" 
        })
    }
    catch(error) {
        return res.status(400).json({ 
            success: false, 
            message: "Error while accepting case" 
        })
    }
}

