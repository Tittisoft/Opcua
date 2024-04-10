import axiosInit from '@/services/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

type ResponseData = {
  State: string;
  Address: string;
  RoundTripTime: number;
  TTL: number;
  DontFragment: boolean;
  BufferSie: number;
};

const pingPlc = async (
  data: {
    IpAddress: string;
  },
  config?: AxiosRequestConfig
): Promise<ResponseData> => {
  try {
    // Post Credentials
    const res: AxiosResponse<ResponseData> = await axiosInit.get(
      'api/PlcPing',
      {
        ...config,
        params: { ...data },
      }
    );

    return Promise.resolve(res.data);
  } catch (e) {
    // reject promise with error
    return Promise.reject(e);
  }
};

export default pingPlc;
