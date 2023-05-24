import { useGetCOSBucketSecret } from './api';

interface COSOperationError {
  statusCode: number;
  headers: Record<string, any>
};

interface COSOperationData extends COSOperationError {
  ETag: string;
  Location: string;
  VersionId: string;
};

interface ProgressData {
  loaded: number;
  total: number;
  speed: number;
  percent: number;
};

const COS = require('cos-wx-sdk-v5');
const Bucket = 'signdesk-1308682615';
const Region = 'ap-shanghai';

export const COSBucketBaseUrl = 'https://signdesk-1308682615.cos.ap-shanghai.myqcloud.com';

const cos = new COS({
  SimpleUploadMethod: 'putObject',
  async getAuthorization(_options: any, callback: Function) {
    const { data } = await useGetCOSBucketSecret();
    const { credentials } = data;
    callback({
      TmpSecretId: credentials.tmpSecretId,
      TmpSecretKey: credentials.tmpSecretKey,
      SecurityToken: credentials.sessionToken,
      StartTime: data.startTime,
      ExpiredTime: data.expiredTime
    }); 
  }
});

export const uploadFile = (
  key: string,
  filePath: string,
  onProgress?: (progressData: ProgressData) => void
) => {
  return new Promise<COSOperationData>((resolve, reject) => {
    cos.putObject({
      Bucket,
      Region,
      Key: key,
      FilePath: filePath,
      onProgress
    }, (error: COSOperationError, data: COSOperationData) => {
      if(error) return reject(error);
      return resolve(data);
    });
  });
};