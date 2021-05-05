import aws from "aws-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export type AwsDTO = aws.S3.PresignedPost;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: "v4",
  });
  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `${process.env.PATH_NAME}${req.query.file}`,
    },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
      ["starts-with", "$key", "images/"],
    ],
  });

  res.status(200).json(post);
};

export default handler;
