import { QueryClient, useMutation, useQuery } from "@tanstack/preact-query";
import { Resource } from "./types";
import { supabase } from "./supabase";

export const queryClient = new QueryClient();

export interface ApiError {
  errors: { detail: string; code?: string }[];
}

const BASE_URL: string = import.meta.env.VITE_API_URL;

interface PostResource {
  type: string;
  attributes: any;
}

function retry(cnt: number, err: ApiError): boolean {
  // Retry non-API errors (network errors).
  if (!err.errors) {
    return true;
  }
  // Retry server errors (5xx, always include code).
  if (err.errors[0].code) {
    return true;
  }
  // Don't retry API errors without a code (client errors).
  return false;
}

async function getToken(): Promise<string | null> {
  const session = await supabase.auth.getSession();
  if (session.error) {
    throw session.error;
  }
  return session.data.session?.access_token || null;
}

async function getHeaders() {
  const headers: { [key: string]: string } = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    "X-Api-Version": "2026-08-15",
  };
  const token = await getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  get: (url: string) =>
    useQuery<Resource, ApiError>({
      queryKey: ["GET", url],
      queryFn: async () => {
        const resp = await fetch(BASE_URL + url, {
          headers: await getHeaders(),
        });
        const body = await resp.json();
        if (body.errors) {
          throw body;
        }
        return body.data;
      },
      retry: retry,
    }),

  post: (url: string) =>
    useMutation<Resource, ApiError, PostResource>({
      mutationKey: ["POST", url],
      mutationFn: async (data: PostResource) => {
        const resp = await fetch(BASE_URL + url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: await getHeaders(),
        });
        const body = await resp.json();
        if (body.errors) {
          throw body;
        }
        return body.data;
      },
    }),
};
