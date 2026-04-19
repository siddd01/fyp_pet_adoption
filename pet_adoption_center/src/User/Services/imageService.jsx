const isCloudinaryUrl = (url) =>
  typeof url === "string" && url.includes("res.cloudinary.com");

export const getOptimizedImageUrl = (
  url,
  { width, height, crop = "fill", gravity = "auto", quality = "auto:best" } = {}
) => {
  if (!url || !isCloudinaryUrl(url) || url.includes("/upload/f_auto")) {
    return url;
  }

  const transforms = ["f_auto", "dpr_auto", `q_${quality}`];

  if (width) {
    transforms.push(`w_${width}`);
  }

  if (height) {
    transforms.push(`h_${height}`);
  }

  if (width || height) {
    transforms.push(`c_${crop}`, `g_${gravity}`);
  }

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
};

export default getOptimizedImageUrl;
