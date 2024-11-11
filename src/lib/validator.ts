// lib/action-validators.ts

interface CooldownData {
    lastAction: Date;
  }
  
  type CooldownMap = Map<string, {
    lastGeneration?: Date;
    lastAscend?: Date;
    lastSell?: Date;
    lastReroll?: Date;
    lastSacrifice?: Date;
  }>;
  
  const cooldowns: CooldownMap = new Map();
  
  // Clean up old cooldowns every hour
  setInterval(() => {
    const now = Date.now();
    for (const [userId, data] of cooldowns.entries()) {
      const oldestAction = Math.min(
        ...[
          data.lastGeneration,
          data.lastAscend,
          data.lastSell,
          data.lastReroll,
          data.lastSacrifice,
        ]
          .filter(Boolean)
          .map((date) => date!.getTime()),
      );
      if (now - oldestAction > 3600000) {
        cooldowns.delete(userId);
      }
    }
  }, 3600000);
  
  type ActionType = "generation" | "ascend" | "sell" | "reroll" | "sacrifice";
  
  const COOLDOWNS = {
    generation: { normal: 2000, vip: 1000 },
    ascend: { normal: 1000, vip: 500 },
    sell: { normal: 2000, vip: 1000 },
    reroll: { normal: 750, vip: 375 },
    sacrifice: { normal: 600000, vip: 600000 }, // 10 minutes for both
  } as const;
  
  export function validateCooldown(
    userId: string,
    action: ActionType,
    isVip: boolean,
  ): { success: true } | { success: false; remainingTime: number } {
    const now = Date.now();
    const userData = cooldowns.get(userId) ?? {};
    const lastActionTime = userData[`last${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof typeof userData]?.getTime() ?? 0;
    
    const cooldown = COOLDOWNS[action][isVip ? "vip" : "normal"];
    
    if (now - lastActionTime < cooldown) {
      return { 
        success: false, 
        remainingTime: (cooldown - (now - lastActionTime)) / 1000,
      };
    }
    
    // Update cooldown
    cooldowns.set(userId, {
      ...userData,
      [`last${action.charAt(0).toUpperCase() + action.slice(1)}`]: new Date(),
    });
    
    return { success: true };
  }
  
  export async function withCooldown<T>(
    userId: string,
    action: ActionType,
    isVip: boolean,
    fn: () => Promise<T>,
  ): Promise<T> {
    const validation = validateCooldown(userId, action, isVip);
    
    if (!validation.success) {
      throw new Error(
        `Please wait ${validation.remainingTime.toFixed(1)}s before ${action} again`,
      );
    }
    
    return await fn();
  }