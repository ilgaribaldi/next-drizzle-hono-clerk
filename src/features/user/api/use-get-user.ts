import { InferResponseType } from "hono";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export type ResponseType = InferResponseType<
  (typeof client.api.users)["$get"],
  200
>;

export const useGetUser = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await client.api.users.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
  });
};
