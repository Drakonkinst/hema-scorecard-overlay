import z from "zod";

export const NewExchangeResponseSchema = z.object({
    refresh: z.boolean(),
    matchTime: z.string().nullable()
});

export const GetStreamOverlayInfoResponseSchema = z.object({
    tournamentName: z.string(),
    fighter1Name: z.string(),
    fighter1School: z.string(),
    fighter1Score: z.string(),
    color1Code: z.string(),
    color1Contrast: z.string(),
    fighter2Name: z.string(),
    fighter2School: z.string(),
    fighter2Score: z.string(),
    color2Code: z.string(),
    color2Contrast: z.string(),
    doubles: z.string(),
    lastExchange: z.int(),
    matchTime: z.string()
});

export type NewExchangeResponse = z.infer<typeof NewExchangeResponseSchema>;
export type GetStreamOverlayInfoResponse = z.infer<typeof GetStreamOverlayInfoResponseSchema>;
