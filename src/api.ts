import { QueryClient, useQuery } from "@tanstack/preact-query";

export const queryClient = new QueryClient();

const BASE_URL: string = import.meta.env.VITE_API_URL;

export const api = {
  get: (url: string) =>
    useQuery({
      queryKey: [url],
      queryFn: async () => {
        const resp = await fetch(BASE_URL + url);
        const body = await resp.json();
        if (body.errors) {
          throw Error(body.errors);
        }
        return body.data;
      },
    }),
};
