export const uploadImage = async (file: File): Promise<string> => {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_BB_API_URI}`,
    { method: "POST", body },
  );
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Image upload failed.");
  }
  return json.data.url as string;
};