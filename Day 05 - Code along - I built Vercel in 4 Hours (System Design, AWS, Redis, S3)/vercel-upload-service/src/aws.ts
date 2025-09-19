import { S3 } from "aws-sdk";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

console.log("ENVS, heellllo ");
console.log(process.env.accessKeyId, process.env.secretAccessKey, process.env.endpoint);

const s3 = new S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: process.env.endpoint
})
// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    //console.log("Uploading file to S3:", fileContent);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log("here is " , response);
}