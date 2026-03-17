import { zColor } from "@remotion/zod-types";
import { z } from "zod";

// ── Per-template schemas ───────────────────────────────────────────

export const heroSceneSchema = z.object({
  type: z.literal("hero"),
  title: z.string(),
  subtitle: z.string().optional(),
  background: zColor().optional(),
  textColor: zColor().optional(),
  duration: z.number().min(1).max(60).default(5),
});

export const listSceneSchema = z.object({
  type: z.literal("list"),
  title: z.string(),
  items: z.array(z.string()).min(1).max(8),
  duration: z.number().min(1).max(60).default(6),
});

export const gridCardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const gridSceneSchema = z.object({
  type: z.literal("grid"),
  title: z.string(),
  cards: z.array(gridCardSchema).min(1).max(9),
  columns: z.number().min(2).max(3).default(3),
  duration: z.number().min(1).max(60).default(6),
});

export const codeSceneSchema = z.object({
  type: z.literal("code"),
  title: z.string(),
  code: z.string(),
  language: z.string().default("typescript"),
  duration: z.number().min(1).max(60).default(7),
});

export const flowStepSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
});

export const flowSceneSchema = z.object({
  type: z.literal("flow"),
  title: z.string(),
  steps: z.array(flowStepSchema).min(2).max(7),
  duration: z.number().min(1).max(60).default(6),
});

export const chatMessageSchema = z.object({
  sender: z.string(),
  text: z.string(),
  isUser: z.boolean().default(false),
});

export const chatSceneSchema = z.object({
  type: z.literal("chat"),
  title: z.string().optional(),
  messages: z.array(chatMessageSchema).min(1).max(10),
  duration: z.number().min(1).max(60).default(6),
});

export const statItemSchema = z.object({
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

export const statSceneSchema = z.object({
  type: z.literal("stat"),
  title: z.string(),
  stats: z.array(statItemSchema).min(1).max(6),
  duration: z.number().min(1).max(60).default(5),
});

export const sequenceMessageSchema = z.object({
  from: z.number(), // actor index
  to: z.number(), // actor index
  label: z.string(),
  description: z.string().optional(),
});

export const sequenceSceneSchema = z.object({
  type: z.literal("sequence"),
  title: z.string(),
  actors: z.array(z.string()).min(2).max(5),
  messages: z.array(sequenceMessageSchema).min(1).max(12),
  duration: z.number().min(1).max(60).default(8),
});

// ── Discriminated union ────────────────────────────────────────────

export const sceneSchema = z.discriminatedUnion("type", [
  heroSceneSchema,
  listSceneSchema,
  gridSceneSchema,
  codeSceneSchema,
  flowSceneSchema,
  chatSceneSchema,
  statSceneSchema,
  sequenceSceneSchema,
]);

export type Scene = z.infer<typeof sceneSchema>;
export type HeroScene = z.infer<typeof heroSceneSchema>;
export type ListScene = z.infer<typeof listSceneSchema>;
export type GridScene = z.infer<typeof gridSceneSchema>;
export type CodeScene = z.infer<typeof codeSceneSchema>;
export type FlowScene = z.infer<typeof flowSceneSchema>;
export type ChatScene = z.infer<typeof chatSceneSchema>;
export type StatScene = z.infer<typeof statSceneSchema>;
export type SequenceScene = z.infer<typeof sequenceSceneSchema>;
