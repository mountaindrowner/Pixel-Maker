import { z } from "zod";
import { paletteEntrySchema } from "./sprite";

export const paletteFileSchema = z.object({
  schemaVersion: z.literal(1),
  colors: z.array(paletteEntrySchema),
});

export type PaletteFile = z.infer<typeof paletteFileSchema>;
