import jwt from 'jsonwebtoken';

export const generateToken = (user, res) => {
    if (!user || !user._id) {
        console.error("Error: User ID is missing while generating token");
        return;
    }

    const token = jwt.sign(
        { userId: user._id.toString() },  
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // console.log("Generated Token:", token);  

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};
