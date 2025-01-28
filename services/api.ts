import axios from 'axios';
import { AccountData } from '@/types/account';
import { CardData } from '@/types/card';

const BASE_URL = 'https://shalo-api.vta-group.tech/api/v1';

// トレンドリソースを取得
export async function fetchTrendingResources(): Promise<CardData[]> {
  const response = await axios.get(`${BASE_URL}/trending/`);
  return response.data;
}

// アカウントデータを取得
export async function fetchAccountData(token: string): Promise<AccountData | null> {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`${BASE_URL}/account/`, { headers });
  return response.data;
}

// ブックマークを取得
export async function fetchBookmarks(token: string): Promise<CardData[]> {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.get(`${BASE_URL}/bookmarks/`, { headers });
  return response.data;
}

// リソースをIDで取得
export async function fetchResourceById(id: string, token: string): Promise<CardData | null> {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${BASE_URL}/resources/${id}/`, { headers });
  return response.data;
}

export async function bookmarkResourceById(id: string, token: string): Promise<void> {
  const headers = { Authorization: `Bearer ${token}` };
  await axios.post(`${BASE_URL}/resources/${id}/bookmark`, {}, { headers });

}

export async function updateResourceById(id: string, updatedResource: Partial<CardData>, token: string): Promise<CardData> {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.put(`${BASE_URL}/resources/${id}/update`, updatedResource, { headers });

  return response.data;
}
export async function deleteResourceById(id: string, token: string): Promise<boolean> {
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(`${BASE_URL}/resources/${id}/delete`, { headers });

  return true;
}

// 全てのリソースを取得
export async function fetchAllResources(): Promise<CardData[]> {
  const response = await axios.get(`${BASE_URL}/resources/`);
  return response.data;
}

// リソースを検索
export async function searchResources(query: string): Promise<CardData[]> {
  const response = await axios.get(`${BASE_URL}/search/`, { params: { query } });
  return response.data;
}

// アカウントを削除
export async function deleteAccount(userId: string): Promise<boolean> {
  await axios.delete(`${BASE_URL}/delete-account/${userId}/`);
  return true;
}

// リソースを作成
export async function createResource(resourceData: Omit<CardData, 'id' | 'dateCreated' | 'author' | 'previewImage'>, token: string): Promise<CardData> {
  const headers = { Authorization: `Bearer ${token}` };

  const response = await axios.post(`${BASE_URL}/create-resource/`, resourceData, { headers });
  return response.data;
}

// サインイン
export async function signIn(email: string, password: string): Promise<{ accountData: AccountData; token: string }> {
  const response = await axios.post(`${BASE_URL}/sign-in/`, { email, password });
  return response.data;
}

// サインアップ
export async function signUp(email: string, password: string): Promise<{ accountData: AccountData; token: string }> {
  const response = await axios.post(`${BASE_URL}/sign-up/`, { email, password });
  return response.data;
}