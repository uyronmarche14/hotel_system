export interface ApiError extends Error {
  status?: number;
  response?: {
    status: number;
    data: { message: string };
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
