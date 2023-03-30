import { get, post, put } from './http';

import type { ResData } from './http';

export interface UserInfo {
  nickname: string;
  avatar: string;
  phone: string;
  introduction: string;
};

export interface COSScrectOption {
  credentials: {
    tmpSecretId: string;
    tmpSecretKey: string;
    sessionToken: string;
  };
  startTime: string;
  expiredTime: string;
};

export const useLogin = (code: string) => 
  post(
    '/wx/user/login',
    { code },
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  ) as Promise<ResData<string>>;

export const useGetUserInfo = () =>
  get('/wx/user/getUserInfo') as Promise<ResData<UserInfo>>;

export const useGetCOSBucketSecret = () =>
  post('/cos/getSecret') as Promise<ResData<COSScrectOption>>;

export const useUpdateUserInfo = (userInfo: Partial<UserInfo>) =>
  put('/wx/user/updateUserInfo', userInfo) as Promise<ResData<boolean>>;
