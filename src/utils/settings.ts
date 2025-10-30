import z from "zod";

export const SettingsSchema = z.object({
    useTransparentOverlay: z.boolean()
});

export type Settings = z.infer<typeof SettingsSchema>;

export const createDefaultSettings = (): Settings => {
    return {
        useTransparentOverlay: false
    };
}
