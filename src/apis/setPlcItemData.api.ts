import axiosInit from '@/services/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

type ResponseData = {};

const setPlcItemData = async (
  data: {
    CODICE: string;
    Uri: string;
  },
  config?: AxiosRequestConfig
): Promise<ResponseData> => {
  try {
    // Post Credentials
    const res: AxiosResponse<ResponseData> = await axiosInit.put(
      '/api/SetData',
      {
        ...data,
      },
      { ...config }
    );

    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default setPlcItemData;
