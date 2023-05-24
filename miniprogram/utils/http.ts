import { getCurrentPage } from "../miniprogram_npm/tdesign-miniprogram/common/utils";

import Message from 'tdesign-miniprogram/message/index';

type RequestMehod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
type RequestBody = string | Record<string, any>;
export interface ResData<T> {
  code: number;
  msg: string;
  data: T;
};

const BASE_URL = 'https://signdesk.ishortv.top/signdesk';

export const request = (
  url: string,
  method: RequestMehod,
  body?: RequestBody,
  headers?: Record<string, any>
) => {
  return new Promise<ResData<unknown>>((resolve, reject) => {
    const token = wx.getStorageSync('token');
    wx.request(
      {
        url: `${BASE_URL}${url}`,
        method,
        data: body,
        header: token ? { token, ...headers } : headers,
        success(res) {
          const { statusCode } = res;
          if(statusCode === 200) resolve(res.data as ResData<unknown>);
          else if(statusCode === 401) {
            const ctx = getCurrentPage();
            Message.error({
              offset: [20, 32],
              content: '登录信息过期，请重新登录',
              duration: 4000,
              context: ctx
            });
            ctx.setData({ isLogin: false });
            reject();
          }
        },
        fail(e) { reject(e); }
      }
    )
  });
};

export const get = (
  url: string,
  body?: RequestBody,
  headers?: Record<string, any>
) => request(url, 'GET', body, headers);

export const post = (
  url: string,
  body?: RequestBody,
  headers?: Record<string, any>
) => request(url, 'POST', body, headers);

export const put = (
  url: string,
  body?: RequestBody,
  headers?: Record<string, any>
) => request(url, 'PUT', body, headers);

export const del = (
  url: string,
  body?: RequestBody,
  headers?: Record<string, any>
) => request(url, 'DELETE', body, headers);