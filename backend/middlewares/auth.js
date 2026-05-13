import jwt from "jsonwebtoken";
import User from "../models/User.js";

// protect -> Bertindak sebagai "security" yang mengizinkan permintaan berlanjut ke fungsi controller berikutnya jika token valid, 
// atau memblokirnya (401 Unauthorized) jika token salah atau tidak ada. 
// Jika ada, data pengguna yang berhasil diverifikasi akan disimpan ke dalam objek req.user

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User not found!",
          statusCode: 401,
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error: ", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token Is Expired!",
          statusCode: 401,
        });
      }

        return res.status(401).json({
            success: false,
            message: "Not Authorized, token failed!",
            statusCode: 401,
        });
    }
  }
  
  if(!token) {
    return res.status(401).json({
        success: false,
        message: "Not Authorized, no token!",
        statusCode: 401,
    });
  }

};

export default protect;
