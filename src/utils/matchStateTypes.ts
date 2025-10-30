import z from "zod";
import { doublesToStr, timeToStr } from "../overlay/dataParsing";

export const FighterInfoSchema = z.object({
    name: z.string(),
    school: z.string().optional(),
    score: z.int(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional()
});

export const MatchInfoSchema = z.object({
    tournamentName: z.string(),
    fighter1: FighterInfoSchema,
    fighter2: FighterInfoSchema,
    doubles: z.string(), // Display string
    matchTime: z.string(), // Display string
    lastExchangeId: z.string()
});

export const PartialMatchInfoSchema = MatchInfoSchema.partial().extend({
    fighter1: FighterInfoSchema.partial().optional(),
    fighter2: FighterInfoSchema.partial().optional(),
});

export type FighterInfo = z.infer<typeof FighterInfoSchema>;
export type MatchInfo = z.infer<typeof MatchInfoSchema>;
export type PartialMatchInfo = z.infer<typeof PartialMatchInfoSchema>;

export interface MatchUpdate {
    needsRefresh: boolean;
    matchTime: string | null;
};

export const getBlankMatchInfo = (): MatchInfo => {
    return {
        tournamentName: '',
        fighter1: {
            name: 'Fighter 1',
            school: '',
            score: 0
        },
        fighter2: {
            name: 'Fighter 2',
            school: '',
            score: 0
        },
        doubles: doublesToStr(0),
        matchTime: timeToStr(0),
        lastExchangeId: "-1"
    };
};


