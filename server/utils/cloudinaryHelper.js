const cloudinary = require("cloudinary").v2;

const uploadToCloudinary = async (file, folder) => {
  const base64String = file.buffer.toString("base64");
  const dataUrl = `data:${file.mimetype};base64,${base64String}`;
  return await cloudinary.uploader.upload(dataUrl, { folder });
};

function extractPublicIdFromCloudinaryUrl(url) {
  try {
    if (!url) return null;
    const u = new URL(String(url));
    if (!u.hostname.includes("cloudinary.com")) return null;

    const marker = "/upload/";
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;

    const after = u.pathname.slice(idx + marker.length);
    const parts = after.split("/").filter(Boolean);

    const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
    if (versionIndex === -1) return null;

    const publicParts = parts.slice(versionIndex + 1);
    if (publicParts.length === 0) return null;

    const last = publicParts[publicParts.length - 1];
    publicParts[publicParts.length - 1] = String(last).replace(/\.[^.]+$/, "");

    const publicId = publicParts.join("/");
    return publicId || null;
  } catch {
    return null;
  }
}

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const safeDeleteFromCloudinary = async ({ publicId, url } = {}) => {
  const resolved = publicId || extractPublicIdFromCloudinaryUrl(url);
  if (!resolved) return null;
  return await deleteFromCloudinary(resolved);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  safeDeleteFromCloudinary,
  extractPublicIdFromCloudinaryUrl,
};
