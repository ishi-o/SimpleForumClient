import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";

export interface Board {
  bid: number;
  name: string;
  description: string;
  moderatorId: number;
  createdAt: Date;
}

export interface BoardCreateRequest {
  name: string;
  description: string;
  moderatorUid: number;
}

export interface UseBoardReturn {
  createBoard: (boardCreateRequest: BoardCreateRequest) => Promise<Board>;
}

export const useBoard = (): UseBoardReturn => {
  const createBoard = async (boardCreateRequest: BoardCreateRequest) => {
    const resp = await apiAxios.post<ApiResponse<Board>>("/boards", {
      ...boardCreateRequest,
    });
    return resp.data.data;
  };
  return {
    createBoard,
  };
};
