const db = require("../models/main");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = db;

const createTokens = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email },
        "your_jwt_secret", 
        { expiresIn: "7d" } 
    );
};

const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/avataaars/png?seed=${randomSeed}`;
};

module.exports = {
    Register: async (req, res) => {
        try {
            const { full_name, email, password } = req.body;
            const hash = await bcrypt.hash(password, 10);
            const profile_url = generateRandomAvatar();

            const newUser = await Users.create({
                full_name,
                email,
                password: hash,
                profile_url
            });

            res.status(201).json({
                message: "User Registered",
                user: {
                    id: newUser.user_id.toString(),
                    fullName: newUser.full_name,
                    email: newUser.email,
                    profileUrl: newUser.profile_url
                },
            });
        } catch (error) {
            console.error("Error: ", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    Login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ where: { email: email } });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({ error: "Wrong email or password" });
            }

            const accessToken = createTokens(user);

            res.json({
                message: "Logged in",
                accessToken: accessToken,
                user: {
                    id: user.user_id.toString(),
                    fullName: user.full_name,
                    email: user.email,
                    profileUrl: user.profile_url || generateRandomAvatar()
                }
            });
        } catch (error) {
            console.error("Error: ", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    UpdateProfileImage: async (req, res) => {
        try {
            const { userId, profileUrl } = req.body;
            const user = await Users.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            await user.update({ profile_url: profileUrl });

            res.json({
                message: "Profile image updated successfully",
                profileUrl: profileUrl
            });
        } catch (error) {
            console.error("Error updating profile image:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

