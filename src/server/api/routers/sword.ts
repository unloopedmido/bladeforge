import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import Materials from "@/data/materials";
import Qualities from "@/data/qualities";
import Rarities from "@/data/rarities";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { abbreviateNumber } from "@/lib/func";
import { env } from "@/env";
import { generateSword, getProperty, totalLuck } from "@/server/util";

const userCache = new Map<
  string,
  {
    lastAscend?: Date;
    lastGeneration?: Date;
    lastLuckUpgrade?: Date;
  }
>();

const userWithSword = async (ctx: {
  db: PrismaClient;
  session: { user: { id: string } };
}) => {
  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
    include: { swords: true },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  if (user?.swordId) {
    const sword = user.swords.find((s) => s.id === user.swordId);

    if (!sword)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Sword not found",
      });

    return {
      user,
      sword,
    };
  }

  return {
    user,
  };
};

export const swordRouter = createTRPCRouter({
  generateSword: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = await userWithSword(ctx);

    const now = Date.now();
    const cachedUser = userCache.get(user.id);
    const lastGeneration = cachedUser?.lastGeneration?.getTime() ?? 0;

    const cooldown = user?.vip ? 1000 : 2000;

    if (lastGeneration && now - lastGeneration < cooldown) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Please wait ${((cooldown - (now - lastGeneration)) / 1000).toFixed(1)}s before generating a new sword`,
      });
    }

    if (user?.swordId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "You must unequip your current sword before generating a new one",
      });

    const sword = await generateSword(user);

    if (sword.aura === "None") {
      sword.aura = undefined!;
    }

    if (sword.effect === "None") {
      sword.effect = undefined!;
    }

    const generatedSword = await ctx.db.sword.create({
      data: {
        ...sword,
        ownerId: ctx.session.user.id,
        value: String(sword.value),
        damage: String(sword.damage),
        experience: Math.round(sword.experience),
        enchants: sword.enchants?.map((enchant) => enchant.name) ?? [],
      },
    });

    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { swordId: generatedSword.id },
    });

    userCache.set(user.id, { ...cachedUser, lastGeneration: new Date() });

    return generatedSword;
  }),

  sellSword: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const sword = await ctx.db.sword.findUnique({ where: { id: input } });
        const { user } = await userWithSword(ctx);

        if (!sword || sword.ownerId !== ctx.session.user.id)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sword not found or you do not own this sword",
          });

        const [updatedUser] = await ctx.db.$transaction([
          ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
              money: String(BigInt(user.money) + BigInt(sword.value)),
              swordId: null,
              experience: { increment: sword.experience },
            },
          }),
          ctx.db.sword.delete({ where: { id: input } }),
        ]);

        return {
          money: updatedUser.money,
          experience: updatedUser.experience,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sell sword",
          cause: error,
        });
      }
    }),

  equipSword: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const sword = await ctx.db.sword.findUnique({ where: { id: input } });
        if (!sword || sword.ownerId !== ctx.session.user.id)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Sword not found or you do not own this sword",
          });

        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { swordId: sword.id },
        });
        return sword;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to equip sword",
          cause: error,
        });
      }
    }),

  unequipSword: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { user } = await userWithSword(ctx);
      if (!user?.swordId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No sword equipped",
        });

      // Check how many swords the user has
      const swords = user.swords.length;

      if (swords > 10 && !user.vip)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have up to 10 swords equipped",
        });

      if (swords > 30 && user.vip)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only have up to 30 swords equipped",
        });

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { swordId: null },
      });

      const canSave = user.vip ? 30 - swords : 10 - swords;

      return canSave;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to unequip sword",
        cause: error,
      });
    }
  }),

  swords: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { user } = await userWithSword(ctx);

      const swords = user.swords;

      // Dont show the user's equipped sword in the list
      const filteredSwords = swords.filter(
        (sword) => sword.id !== user.swordId,
      );

      // Sort by value
      filteredSwords.sort((a, b) => Number(b.value) - Number(a.value));

      return filteredSwords;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch swords",
        cause: error,
      });
    }
  }),

  getCurrentSword: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { sword } = await userWithSword(ctx);

      return sword;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current sword",
        cause: error,
      });
    }
  }),

  ascend: protectedProcedure
    .input(z.enum(["material", "quality", "rarity"]))
    .mutation(async ({ ctx, input }) => {
      const { user, sword } = await userWithSword(ctx);

      const now = Date.now();
      const cachedUser = userCache.get(user.id);
      const lastAscend = cachedUser?.lastAscend?.getTime() ?? 0;

      const cooldown = user.vip ? 500 : 1000;

      if (lastAscend && now - lastAscend < cooldown) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Please wait ${((cooldown - (now - lastAscend)) / 1000).toFixed(1)}s before ascending again`,
        });
      }

      if (!userWithSword) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!sword) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No sword equipped",
        });
      }

      const ascending: "material" | "quality" | "rarity" = input;
      const ascendingArray = {
        material: Materials,
        quality: Qualities,
        rarity: Rarities,
      };

      const currentProperty = ascendingArray[ascending].find(
        (p) => p.name === sword[ascending],
      );

      const userTotalLuck = await totalLuck(user);
      const attemptedProperty = await getProperty(
        ascendingArray[ascending],
        user,
      );

      const RNGLuck = attemptedProperty.chance / userTotalLuck;

      if (attemptedProperty.chance > (currentProperty?.chance ?? 0)) {
        if (RNGLuck > 2000) {
          const webhookURI = env.DISCORD_WEBHOOK_URI;
          if (webhookURI) {
            void fetch(webhookURI, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                embeds: [
                  {
                    title: `🎉 ${user.name} has found a ${attemptedProperty.name}!`,
                    description: `Base Chance: 1/${abbreviateNumber(String(attemptedProperty.chance))}\nCurrent Chance: 1/${abbreviateNumber(String(RNGLuck))}`,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }),
            });
          }
        }

        const newValue =
          (Number(sword.value) / (currentProperty?.valueMultiplier ?? 1)) *
          attemptedProperty.valueMultiplier;
        const newDamage =
          ascending !== "material" &&
          currentProperty &&
          "damageMultiplier" in currentProperty
            ? (Number(sword.damage) / currentProperty.damageMultiplier) *
              (attemptedProperty.damageMultiplier ?? 1)
            : Number(sword.damage);
        const newExperience = Math.floor(newValue * 0.1);

        const updatedSword = await ctx.db.sword.update({
          where: { id: sword.id },
          data: {
            [ascending]: attemptedProperty.name,
            value: String(Math.round(newValue)),
            damage: String(Math.round(newDamage)),
            experience: Math.round(newExperience),
          },
        });

        userCache.set(ctx.session.user.id, {
          ...cachedUser,
          lastAscend: new Date(),
        });

        return {
          sword: updatedSword,
          property: attemptedProperty,
          luck: RNGLuck,
        };
      }

      // Update lastAscend even if the ascension failed
      userCache.set(ctx.session.user.id, {
        ...cachedUser,
        lastAscend: new Date(),
      });

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to ascend to ${attemptedProperty.name} (1/${abbreviateNumber(String(RNGLuck))}) as the current ${input} better or same`,
      });
    }),
});
