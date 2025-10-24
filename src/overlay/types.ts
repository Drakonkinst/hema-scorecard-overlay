import { z } from "zod";

export const NewExchangeResponseSchema = z.object({
    refresh: z.boolean(),
    matchTime: z.int().nullable()
});

export type NewExchangeResponse = z.infer<typeof NewExchangeResponseSchema>;
