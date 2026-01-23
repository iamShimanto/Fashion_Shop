const mongoose = require("mongoose");
const User = require("../models/auth.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");

function pickUser(u) {
  if (!u) return null;
  return {
    _id: u._id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    phone: u.phone,
    address: u.address,
    avater: u.avater,
    emailVerified: u.emailVerified,
    isBlocked: Boolean(u.isBlocked),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function adminListUsers(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const q = (req.query.q || "").toString().trim();
    const role = (req.query.role || "").toString().trim();
    const verified = (req.query.verified || "").toString().trim();
    const blocked = (req.query.blocked || "").toString().trim();

    const filter = {};
    if (role) filter.role = role;
    if (verified === "true") filter.emailVerified = true;
    if (verified === "false") filter.emailVerified = false;
    if (blocked === "true") filter.isBlocked = true;
    if (blocked === "false") filter.isBlocked = false;

    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "fullName email role phone address avater emailVerified isBlocked createdAt updatedAt",
        ),
      User.countDocuments(filter),
    ]);

    return successResponse(res, 200, "Users fetched", {
      items: items.map(pickUser),
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminGetUserById(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid user id");
    }

    const user = await User.findById(id).select(
      "fullName email role phone address avater emailVerified isBlocked createdAt updatedAt",
    );
    if (!user) return errorResponse(res, 404, "User not found");

    return successResponse(res, 200, "User fetched", pickUser(user));
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminUpdateUser(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid user id");
    }

    if (String(req.userId) === String(id)) {
      return errorResponse(res, 400, "You cannot modify your own account");
    }

    const user = await User.findById(id);
    if (!user) return errorResponse(res, 404, "User not found");

    const { role, isBlocked, emailVerified } = req.body || {};

    if (role !== undefined) {
      const nextRole = String(role);
      if (!["user", "admin"].includes(nextRole)) {
        return errorResponse(res, 400, "Invalid role");
      }
      user.role = nextRole;
    }

    if (isBlocked !== undefined) {
      user.isBlocked = Boolean(isBlocked);
    }

    if (emailVerified !== undefined) {
      user.emailVerified = Boolean(emailVerified);
    }

    await user.save();

    return successResponse(res, 200, "User updated", pickUser(user));
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminDeleteUser(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid user id");
    }

    if (String(req.userId) === String(id)) {
      return errorResponse(res, 400, "You cannot delete your own account");
    }

    const user = await User.findById(id);
    if (!user) return errorResponse(res, 404, "User not found");

    if (user.role === "admin") {
      return errorResponse(res, 400, "Cannot delete an admin user");
    }

    await User.deleteOne({ _id: id });
    return successResponse(res, 200, "User deleted");
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

module.exports = {
  adminListUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
};
