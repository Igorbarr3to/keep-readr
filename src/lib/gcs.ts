import { Storage } from '@google-cloud/storage'

const gcpKey = JSON.parse(process.env.GCP_KEY as string);

export const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: gcpKey
});

export const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);