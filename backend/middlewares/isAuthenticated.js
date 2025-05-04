const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
       
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        // ✅ Fix: Correct variable name (decode, not deocde)
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        req.id = decode.userId; 

        next(); 
    } catch (error) {
        console.log("Authentication Error:", error);
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
};


module.exports = isAuthenticated;
