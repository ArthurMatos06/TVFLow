import { v2 as cloudinary } from 'cloudinary'
//TODO: APAGAR 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadAvatar(filePath: string) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'tvflow/avatars',
    resource_type: 'image',
  })

  return result.secure_url
}