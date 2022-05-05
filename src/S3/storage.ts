import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS
});

const upload = async (Bucket: string, Key: string, ContentType: string, Body: any) =>
    s3.upload({
        Bucket,
        Key,
        Body,
        ContentType
    }).promise();

const deleteFile = async (Bucket: string, Key: string) =>
    s3.deleteObject({ Bucket, Key }).promise();

export {
    upload,
    deleteFile,
};
