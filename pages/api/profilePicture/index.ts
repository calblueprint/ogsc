import { NextApiRequest, NextApiResponse } from "next";
import aws from "aws-sdk";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { key } = req.query;
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
      signatureVersion: "v4",
    });
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${process.env.PATH_NAME}${key}`,
    };
    const url = s3.getSignedUrl("getObject", params);
    res.json({
      url,
    });
  } catch (err) {
    res.status(404).json({
      statusCode: 404,
      message: "Could not find user's profile picture.",
    });
  }
};
