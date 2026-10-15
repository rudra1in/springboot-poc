// Shared API envelope types — matches Spring Boot ApiResponse<T>

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
