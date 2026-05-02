import api from "./api";

interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
}

interface RefreshResponse {
  token: string;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    username,
    password,
  });
  return data;
}

export async function refreshAuth(
  refreshToken: string,
): Promise<RefreshResponse> {
  const { data } = await api.post<RefreshResponse>("/auth/refresh", {
    refreshToken,
  });
  return data;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}