import z from "zod";

export const SettingsSchema = z.object({
    useTransparentOverlay: z.boolean().optional(),
    useLocalCorsRouting: z.boolean().optional() // Requires a local cors proxy to be running
});

export type Settings = z.infer<typeof SettingsSchema>;

export const createDefaultSettings = (): Settings => {
    return {};
}
