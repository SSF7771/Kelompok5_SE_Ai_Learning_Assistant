import jwt from "jsonwebtoken";
import User from "../models/User.js";


// jwt -> Digunakan sebagai "tiket masuk" digital agar server tahu siapa yang sedang mengakses aplikasi 
// tanpa harus meminta password berulang kali di setiap halaman.
// protect -> Lapisan keamanan (middleware) yang memeriksa apakah token JWT yang dibawa user valid 
// atau tidak sebelum mengizinkan akses ke fungsi profil.
// register -> Berfungsi untuk mendaftarkan user baru ke dalam aplikasi dengan menyimpan data identitas (seperti nama, email, dan password) 
// ke dalam model User.
// login -> Memvalidasi kredensial user (email dan password). 
// Jika data cocok, fungsi ini akan menghasilkan token menggunakan jwt (JSON Web Token) sebagai identitas digital 
// untuk mengakses fitur yang terkunci.
// getProfile -> Mengambil data detail milik user yang sedang aktif dari model User. 
// Fungsi ini menggunakan middleware protect untuk memastikan hanya user yang sudah login (memiliki token valid) yang bisa melihat data tersebut.
// updateProfile -> Memungkinkan user untuk mengubah informasi pribadi mereka di dalam database, 
// untuk memastikan data di dalam model User tetap akurat dan terbaru.
// changePassword -> Fitur keamanan khusus untuk mengganti kata sandi lama dengan kata sandi baru. 
// Fungsi ini memproses pembaruan data pada model User secara aman (biasanya melibatkan proses hashing ulang).

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRED || "7d",
    }
  );
};

// @desc -> Register new User
// @route -> POST -> /api/auth/register
// @access -> Public

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email already registered!"
            : "Username already taken",
        statusCode: 400,
      });
    }

    // Create User
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate Token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: "User registered successfully!"
    });
  } catch (error) {
    next(error);
  }
};

// @desc -> Login User
// @route -> POST -> /api/auth/login
// @access -> Public

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate Input
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Please provide an email and the password.",
            statusCode: 400
        });
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials.",
            statusCode: 401
        });
    }

    // Check Password
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials.",
            statusCode: 401
        });
    }

    // Generate Token
    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        },
        token,
        message: "Successfully Logged In!",
    });

  } catch (error) {
    next(error);

  }
};

// @desc -> Get user profile
// @route -> GET -> /api/auth/profile
// @access -> Private

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
    });

  } catch (error) {
    next(error);

  }
};

// @desc -> Update user profile
// @route -> PUT -> /api/auth/profile
// @access -> Private

export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if(username) user.username = username;
    if(email) user.email = email;
    if(profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        },
        message: "Profile updated successfully!"
    });

  } catch (error) {
    next(error);
  }
};

// @desc -> Change password
// @route -> POST -> /api/auth/change-password
// @access -> Private

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if(!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            error: "Please provide the current and new password.",
            statusCode: 400
        });
    }

    const user = await User.findById(req.user._id).select("+password");

    // Check Current Password
    const isMatch = await user.matchPassword(currentPassword);

    if(!isMatch) {
        return res.status(401).json({
            success: false,
            error: "Current password is incorrect!",
            statusCode: 401
        });
    }

    // Update Password
    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully!"
    });

  } catch (error) {
    next(error);

  }
};
