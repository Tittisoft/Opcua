import { PLCItem } from '@/configs/interfaces';
import axiosInit from '@/services/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

type ResponseData = {
  PlcItems: Array<PLCItem>;
};

const getPlcItems = async (
  data?: null,
  config?: AxiosRequestConfig
): Promise<ResponseData> => {
  try {
    // Post Credentials
    const res: AxiosResponse<ResponseData> = await axiosInit.get(
      '/api/GetPlcItems',
      { ...config }
    );

    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default getPlcItems;
