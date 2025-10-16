import { ApiResponse } from "@/utils/apiResponse";
import apiAxios from "@/utils/axios";
import { computed, InjectionKey, Ref, ref } from "vue";

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  GUEST = "GUEST",
}

export interface User {
  uid: number;
  username: string;
  role: UserRole;
  createdAt: Date;
  need2FA: boolean;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UseAuthReturn {
  user: Ref<User>;
  loggedIn: Ref<boolean>;
  initAuth: () => Promise<User>;
  getGuestUser: () => Promise<User>;
  getCurrentUser: () => Promise<User>;
  login: (userLoginRequest: UserLoginRequest) => Promise<User>;
  logout: () => void;
}

export const roleMap = {
  [UserRole.ADMIN]: "管理员",
  [UserRole.GUEST]: "游客",
  [UserRole.MEMBER]: "普通用户",
};

export const defaultGuest: User = {
  uid: -1,
  username: "",
  role: UserRole.GUEST,
  createdAt: new Date(),
  need2FA: false,
};

const user = ref<User>(defaultGuest);

export const authInjectKey: InjectionKey<UseAuthReturn> = Symbol("auth");

export const useAuth = (): UseAuthReturn => {
  const loggedIn = computed(() => user.value.role !== UserRole.GUEST);
  const initAuth = async (): Promise<User> => {
    try {
      const resp = await apiAxios.get<ApiResponse<User>>("/auth/me");
      user.value = resp.data.data;
      return user.value;
    } catch (error: any) {
      // console.log(error);
      if (error.response?.status === 401) {
        return await getGuestUser();
      }
      throw error;
    }
  };

  const getGuestUser = async (): Promise<User> => {
    const resp = await apiAxios.post<ApiResponse<string>>("/auth/guest", null);
    user.value = {
      uid: -1,
      username: resp.data.data,
      role: UserRole.GUEST,
      createdAt: new Date(),
      need2FA: false,
    };
    return user.value;
  };

  const getCurrentUser = async () => user.value || (await getGuestUser());

  const login = async (userLoginRequest: UserLoginRequest): Promise<User> => {
    const resp = await apiAxios
      .post<ApiResponse<User>>("/auth/login", {
        ...userLoginRequest,
      })
      .catch((error) => {
        throw error;
      });
    user.value = resp.data.data;
    return user.value;
  };

  const logout = async () => {
    await apiAxios.post("/auth/logout").then(() => {
      user.value = defaultGuest;
    });
    window.location.reload();
  };

  return {
    user,
    loggedIn,

    initAuth,
    getGuestUser,
    getCurrentUser,
    login,
    logout,
  };
};
