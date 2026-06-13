import { z } from "zod";

export const uploadFileSchema = z.object({
  file: z.instanceof(File, { message: "Please choose a file." }),
});

export const uploadAvatarSchema = z.object({
  file: z
    .instanceof(File, { message: "Please choose an image." })
    .refine((file) => file.type.startsWith("image/"), "Please choose an image file."),
});

export type UploadFileSchema = z.infer<typeof uploadFileSchema>;
export type UploadAvatarSchema = z.infer<typeof uploadAvatarSchema>;
