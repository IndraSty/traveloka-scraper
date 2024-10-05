import { User } from "../models/user-schema.js"

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).send({ message: "Unauthorized" })

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                create_at: user.create_at,
                update_at: user.update_at
            },
            message: "Get User Successfully"
        });
        
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export {
    getUser
}