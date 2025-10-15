export enum ApiCode {
  OK = 2000,
  FAILURE = 4000,
}

export interface ApiResponse<T> {
  success: boolean;
  apiCode: ApiCode;
  message: string;
  data: T;
  timestamp: Date;
}
