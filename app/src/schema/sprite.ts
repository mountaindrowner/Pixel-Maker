import { z } from "zod";

export const PALETTE_ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
export const TRANSPARENT_CHAR = ".";
export const MAX_PALETTE_SIZE = PALETTE_ID_CHARS.length; // 36

const paletteIdSchema = z
  .string()
  .length(1)
  .regex(/^[0-9a-z]$/, "palette id must be a single base36 char (0-9, a-z)");

const hexSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "hex must be #RRGGBB");

export const paletteEntrySchema = z.object({
  id: paletteIdSchema,
  hex: hexSchema,
  name: z.string().optional(),
});

export const boxSchema = z.object({
  x: z.number().int().nonnegative(),
  y: z.number().int().nonnegative(),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  auto: z.boolean().optional(),
});

export const frameSchema = z.object({
  name: z.string().min(1),
  durationMs: z.number().int().positive().nullable().optional(),
  rows: z.array(z.string()).min(1),
});

export const spriteSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().min(1),
  width: z.number().int().positive().max(256),
  height: z.number().int().positive().max(256),
  fps: z.number().positive().max(60),
  encoding: z.literal("chars"),
  palette: z.array(paletteEntrySchema).min(1).max(MAX_PALETTE_SIZE),
  anchor: z.object({ x: z.number().int(), y: z.number().int() }).optional(),
  boundingBox: boxSchema.optional(),
  hitbox: boxSchema.optional(),
  frames: z.array(frameSchema).min(1),
});

export type Sprite = z.infer<typeof spriteSchema>;
export type Frame = z.infer<typeof frameSchema>;
export type PaletteEntry = z.infer<typeof paletteEntrySchema>;
export type Box = z.infer<typeof boxSchema>;

export interface ValidationIssue {
  path: string;
  message: string;
}

/**
 * Deep-validate a sprite: schema + frame row dimensions + palette id references.
 * Returns issues as a list so the editor can surface them with line numbers.
 */
export function validateSprite(input: unknown): { sprite?: Sprite; issues: ValidationIssue[] } {
  const parsed = spriteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }
  const sprite = parsed.data;
  const issues: ValidationIssue[] = [];
  const validChars = new Set([TRANSPARENT_CHAR, ...sprite.palette.map((p) => p.id)]);

  sprite.frames.forEach((frame, fIdx) => {
    if (frame.rows.length !== sprite.height) {
      issues.push({
        path: `frames[${fIdx}].rows`,
        message: `expected ${sprite.height} rows, got ${frame.rows.length}`,
      });
    }
    frame.rows.forEach((row, rIdx) => {
      if (row.length !== sprite.width) {
        issues.push({
          path: `frames[${fIdx}].rows[${rIdx}]`,
          message: `expected ${sprite.width} chars, got ${row.length}`,
        });
      }
      for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (!validChars.has(c)) {
          issues.push({
            path: `frames[${fIdx}].rows[${rIdx}][${i}]`,
            message: `unknown palette id '${c}' (valid: ${[...validChars].join("")})`,
          });
          break; // one error per row is enough
        }
      }
    });
  });

  return { sprite: issues.length === 0 ? sprite : undefined, issues };
}
