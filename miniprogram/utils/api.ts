import { get, post, put, del } from './http';

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

export interface SignItem {
  picUrl: string;
  address: string;
  createTime: string;
};

export interface PagingSignItemsData {
  currentPage: number;
  pageSize: number;
  totalPage: 0;
  hasNext: boolean;
  hasPrevious: boolean;
  records: SignItem[]
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
  put('/wx/user/updateUserInfo', userInfo) as Promise<ResData<boolean | string>>;

export const useGetUserPicList = (params: {
  page: number;
  size: number;
  offset: number;
}) => get('/pic/getUserPicList', params) as Promise<ResData<PagingSignItemsData>>;

export const useAddSign = (picKey: string, address: string) =>
  post('/pic/save', { picKey, address }) as Promise<ResData<SignItem>>;

export const useDeleteSign = (picUrl: string) =>
  del('/pic/del', { picUrl }) as Promise<ResData<boolean | string>>;

export const useBindSign = (signId: number) =>
  post('/pic/bind', { signId }) as Promise<ResData<null>>;

export const useGetSignItem = (signId: number) =>
  get('/pic/get', { signId }) as Promise<ResData<SignItem>>;