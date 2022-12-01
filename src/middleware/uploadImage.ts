import { Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

export const multerFilter = (_: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.array("myfiles", 10);

export const uploadImages = (req: Request, res: Response, next: NextFunction) => {
  uploadFiles(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

export const resizeImages = async (req: any, _: Response, next: NextFunction) => {
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file: any) => {
      const filename = file.originalname.replace(/\..+$/, "");
      const newFilename = `social-gram-simform-${filename}-${Date.now()}.jpeg`;

      await sharp(file.buffer)
        .resize(640, 320)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/posts/${newFilename}`);

      req.body.images.push(newFilename);
    })
  );

  next();
};

export const getResult = async (req: Request, res:Response) => {
  if (req.body.images.length <= 0) {
    return res.send(`You must select at least 1 image.`);
  }

  const images = req.body.images
    .map((image: string) => "" + image + "")
    .join("");

  return res.send(`Images were uploaded:${images}`);
};


