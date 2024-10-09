import { generateSword, getRandomProperty, luckFromLevel } from "@/data/common";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import Materials from "@/data/materials";
import Qualities from "@/data/qualities";
import Rarities from "@/data/rarities";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getLevelFromExperience } from "@/lib/func";

const handleError = (error: unknown, message: string) => {
  console.error(error);
  return { success: false, message, sword: null, swords: null };
};

const findUserSword = async (ctx: {
  db: PrismaClient;
  session: { user: { id: string } };
}) => {
  const user = await ctx.db.user.findUnique({
    where: { id: ctx.session.user.id },
  });
  return {
    user,
    sword: user?.swordId
      ? await ctx.db.sword.findUnique({ where: { id: user.swordId } })
      : null,
  };
};

export const swordRouter = createTRPCRouter({
  generateSword: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = await findUserSword(ctx);
    const lastGeneration = user?.lastGeneration;

    if (lastGeneration) {
      const now = Date.now();
      const cooldown = user?.vip ? 2000 : 3000; // 2 seconds for VIP, 3 seconds for normal members (increase of 50%)
      if (now - new Date(lastGeneration).getTime() < cooldown)
        return {
          success: false,
          message: `Please wait ${((cooldown - (now - new Date(lastGeneration).getTime())) / 1000).toFixed(1)}s before generating another sword`,
          sword: null,
        };
    }

    if (user?.swordId)
      return {
        success: false,
        message: "You already have a sword equipped",
        sword: null,
      };

    const sword = generateSword(user!);
    const generatedSword = await ctx.db.sword.create({
      data: {
        ...sword,
        ownerId: ctx.session.user.id,
        value: Math.round(sword.value),
        damage: Math.round(sword.damage),
        experience: Math.round(sword.experience),
      },
    });

    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { swordId: generatedSword.id, lastGeneration: new Date() },
    });
    return {
      success: true,
      message: "Sword generated successfully",
      sword: generatedSword,
    };
  }),

  sellSword: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const sword = await ctx.db.sword.findUnique({ where: { id: input } });
        if (!sword || sword.ownerId !== ctx.session.user.id)
          return {
            success: false,
            message: "Sword not found or you do not own this sword",
            sword: null,
          };

        await ctx.db.$transaction([
          ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
              money: { increment: sword.value },
              swordId: null,
              experience: { increment: sword.experience },
            },
          }),
          ctx.db.sword.delete({ where: { id: input } }),
        ]);

        return { success: true, message: "Sword sold successfully", sword };
      } catch (error) {
        return handleError(error, "Failed to sell sword");
      }
    }),

  equipSword: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const sword = await ctx.db.sword.findUnique({ where: { id: input } });
        if (!sword || sword.ownerId !== ctx.session.user.id)
          return {
            success: false,
            message: "Sword not found or you do not own this sword",
            sword: null,
          };

        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { swordId: sword.id },
        });
        return { success: true, message: "Sword equipped successfully", sword };
      } catch (error) {
        return handleError(error, "Failed to equip sword");
      }
    }),

  unequipSword: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { user } = await findUserSword(ctx);
      if (!user?.swordId)
        return { success: false, message: "No sword equipped", sword: null };

      // Check how many swords the user has
      const swords = await ctx.db.sword.count({
        where: { ownerId: ctx.session.user.id },
      });

      if (swords > 10 && !user.vip)
        return {
          success: false,
          message: "You can only have up to 10 swords equipped",
          sword: null,
        };

      if (swords > 20 && user.vip)
        return {
          success: false,
          message: "You can only have up to 20 swords equipped",
          sword: null,
        };

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { swordId: null },
      });
      const canSave = user.vip ? 20 - swords : 10 - swords;
      return {
        success: true,
        message: `${canSave} more swords can be saved`,
        sword: user.swordId,
      };
    } catch (error) {
      return handleError(error, "Failed to unequip sword");
    }
  }),

  swords: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user)
        return { success: false, message: "User not found", swords: null };
      const swords = await ctx.db.sword.findMany({
        where: { ownerId: ctx.session.user.id },
      });

      // Dont show the user's equipped sword in the list
      const filteredSwords = swords.filter(
        (sword) => sword.id !== user.swordId,
      );

      // Sort by value
      filteredSwords.sort((a, b) => Number(b.value) - Number(a.value));

      return {
        success: true,
        message: "Swords fetched successfully",
        swords: filteredSwords,
      };
    } catch (error) {
      return handleError(error, "Failed to fetch swords");
    }
  }),

  getCurrentSword: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { user, sword } = await findUserSword(ctx);
      if (!user)
        return { success: false, message: "User not found", sword: null };
      if (!sword)
        return { success: false, message: "No sword equipped", sword: null };

      return {
        success: true,
        message: "Current sword fetched successfully",
        sword,
      };
    } catch (error) {
      return handleError(error, "Failed to fetch current sword");
    }
  }),

  ascend: protectedProcedure
    .input(z.enum(["material", "quality", "rarity"]))
    .mutation(async ({ ctx, input }) => {
      const { user, sword } = await findUserSword(ctx);
      if (!user) {
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

      const cooldown = user.vip ? 1000 : 1500; // 1 second for VIP, 1.5 seconds for normal members
      const now = Date.now();
      const lastAscend = user.lastAscend
        ? new Date(user.lastAscend).getTime()
        : 0;

      if (now - lastAscend < cooldown) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Please wait ${((cooldown - (now - lastAscend)) / 1000).toFixed(1)}s before ascending again`,
        });
      }

      const ascending = input;
      const ascendingArray = {
        material: Materials,
        quality: Qualities,
        rarity: Rarities,
      };

      const currentProperty = ascendingArray[ascending].find(
        (p) => p.name === sword[ascending],
      );

      const levelLuck = luckFromLevel(
        getLevelFromExperience(Number(user.experience)),
      );
      const userLuck = Number(user.luck) * (user.vip ? 1.25 : 1); // VIP users get a 25% luck bonus
      const attemptedProperty = getRandomProperty(
        ascendingArray[ascending],
        userLuck,
        levelLuck,
      );

      if (attemptedProperty.chance > (currentProperty?.chance ?? 0)) {
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

        await ctx.db.sword.update({
          where: { id: sword.id },
          data: {
            [ascending]: attemptedProperty.name,
            value: Math.round(newValue),
            damage: Math.round(newDamage),
            experience: Math.round(newExperience),
          },
        });

        await ctx.db.user.update({
          where: { id: user.id },
          data: { lastAscend: new Date(now) },
        });

        return {
          message: `Upgraded successfully! You got ${attemptedProperty.name} (1/${Math.round(attemptedProperty.chance / (userLuck * levelLuck))})`,
          sword: await ctx.db.sword.findUnique({ where: { id: sword.id } }),
        };
      }

      await ctx.db.user.update({
        where: { id: user.id },
        data: { lastAscend: new Date(now) },
      });

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to Upgrade!\nYou got ${attemptedProperty.name} (1/${Math.round(attemptedProperty.chance / (userLuck * levelLuck))})`,
      });
    }),
});
