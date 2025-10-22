import { z } from "zod";

export const NewExchangeResponse = z.object({
    refresh: z.boolean(),
    matchTime: z.int().nullable()
});

export type NewExchangeResponseType = z.infer<typeof NewExchangeResponse>;
