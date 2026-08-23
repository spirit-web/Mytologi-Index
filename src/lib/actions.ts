"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// Server Actions för läsframsteg (StoryProgress). Anropas från små
// klient-komponenter (checkbox/stjärna) på story-sidan. Ingen
// inloggning/userId — se schema.prisma-kommentar om varför.

export async function toggleStoryCompleted(storyId: string, nextCompleted: boolean) {
  await prisma.storyProgress.upsert({
    where: { storyId },
    update: { completedAt: nextCompleted ? new Date() : null },
    create: { storyId, completedAt: nextCompleted ? new Date() : null },
  });
  revalidatePath("/", "layout");
}

export async function toggleStoryFavorite(storyId: string, nextFavorite: boolean) {
  await prisma.storyProgress.upsert({
    where: { storyId },
    update: { isFavorite: nextFavorite },
    create: { storyId, isFavorite: nextFavorite },
  });
  revalidatePath("/", "layout");
}
