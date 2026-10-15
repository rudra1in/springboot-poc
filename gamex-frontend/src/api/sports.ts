import { client } from './client';
import type { ApiResponse, PageResponse, PageParams } from './types';

// ── Types ───────────────────────────────────────────────────────────────────

export type SportType = 'TEAM' | 'INDIVIDUAL' | 'ESPORT';
export type SportStatus = 'ACTIVE' | 'INACTIVE';

export interface SportResponse {
  id: string;
  name: string;
  sportType: SportType;
  status: SportStatus;
  description: string | null;
  playersPerTeam: number;
  numberOfReferees: number | null;
  numberOfScorers: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SportRequest {
  name: string;
  sportType: SportType;
  status: SportStatus;
  description?: string;
  playersPerTeam: number;
  numberOfReferees?: number;
  numberOfScorers?: number;
}

// ── API calls ────────────────────────────────────────────────────────────────

export const sportsApi = {
  list: (params?: PageParams) =>
    client
      .get<ApiResponse<PageResponse<SportResponse>>>('/sports', { params })
      .then((r) => r.data.data),

  getById: (id: string) =>
    client
      .get<ApiResponse<SportResponse>>(`/sports/${id}`)
      .then((r) => r.data.data),

  create: (payload: SportRequest) =>
    client
      .post<ApiResponse<SportResponse>>('/sports', payload)
      .then((r) => r.data.data),

  update: (id: string, payload: SportRequest) =>
    client
      .put<ApiResponse<SportResponse>>(`/sports/${id}`, payload)
      .then((r) => r.data.data),

  delete: (id: string) =>
    client.delete<ApiResponse<void>>(`/sports/${id}`).then((r) => r.data),
};
