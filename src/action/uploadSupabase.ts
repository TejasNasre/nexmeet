import { createClient } from "../utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = createClient();
  console.log("Storage initialized");
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};
export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;
  console.log("File name:", fileName);
  console.log("File extension:", fileExtension);
  console.log("Upload path:", path);

  try {
    console.log("Compressing image...")
    file = await imageCompression(file, {
      maxSizeMB: 1,
    });
    console.log("Image compression successful");
  } catch (error) {
    console.error(error);
    console.error("Error during image compression:", error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();
  console.log("Uploading image...");
  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    console.error("Error during image upload:", error);
    return { imageUrl: "", error: "Image upload failed" };
  }
  console.log("Image upload successful:", data);
  const imageUrl = `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${
    data?.path
  }`;
  console.log("Image URL generated:", imageUrl);
  return { imageUrl, error: "" };
};
