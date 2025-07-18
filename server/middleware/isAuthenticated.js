import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  // console.log("Checking authentication middleware");
  try {
    const token = req.cookies.token;
    // console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    // console.log("Decoded token:", decode);
    req.user = decode
    req.id= decode.userId; // Assuming the user ID is stored in the token
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;