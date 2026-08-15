import { QueryClient, useQuery } from "@tanstack/preact-query";

export const queryClient = new QueryClient();

export interface ApiError {
  errors: { detail: string }[];
}

const BASE_URL: string = import.meta.env.VITE_API_URL;

export const api = {
  get: (url: string) =>
    useQuery<any, ApiError>({
      queryKey: ["GET", url],
      queryFn: async () => {
        const resp = await fetch(BASE_URL + url, {
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "X-Api-Version": "2026-08-15",
          },
        });
        const body = await resp.json();
        if (body.errors) {
          throw body;
        }
        return body.data;
      },
    }),
};
