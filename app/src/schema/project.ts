import { z } from "zod";

export const projectSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().min(1),
  canvas: z.object({
    width: z.number().int().positive().max(256),
    height: z.number().int().positive().max(256),
  }),
  defaultFps: z.number().positive().max(60),
  sprites: z.array(z.string()),
  createdAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
