import { cloudinary } from "../lib/cloudinary.js";

export const avatarService = {
  async upload(buffer: Buffer, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tvflow/avatars",
          public_id: userId,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("O Cloudinary não retornou o resultado."));
            return;
          }

          resolve(result.secure_url);
        },
      );

      stream.end(buffer);
    });
  },
};