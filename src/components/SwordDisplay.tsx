import { abbreviateNumber } from "@/lib/utils";
import { getEnchantData, getSwordAura } from "@/data/common";
import { motion } from "framer-motion";
import { FaCoins } from "react-icons/fa";
import { LuSword } from "react-icons/lu";
import { GiRank3 } from "react-icons/gi";
import { IoMdHammer } from "react-icons/io";
import { GoStarFill } from "react-icons/go";
import type { Sword } from "@prisma/client";
import Rarities from "@/data/rarities";
import Materials from "@/data/materials";
import Effects from "@/data/effects";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useState } from "react";

interface SwordDisplayProps {
    sword: Sword;
}

function handleColor(color: string | string[]) {
    if (Array.isArray(color)) {
        return color[0]!;
    }
    return color;
}

export default function SwordDisplay({ sword }: SwordDisplayProps) {
    const [showEnchants, setShowEnchants] = useState(false);
    const rarity = Rarities.find((r) => r.name === sword.rarity);
    const material = Materials.find((m) => m.name === sword.material);
    const effect = Effects.find((e) => e.name === sword.effect);

    const rarityColor = handleColor(rarity?.color ?? "rgb(255,255,255)");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 rounded-xl overflow-hidden border border-bronzeDark-bronze4">
                <div
                    className="p-px"
                    style={{
                        background: effect
                            ? `linear-gradient(to bottom right, ${handleColor(effect.color)}40, transparent)`
                            : undefined,
                    }}
                >
                    <div className="grid grid-cols-1">
                        <div className="relative min-h-[400px] bg-gradient-to-br from-bronzeDark-bronze1 to-bronzeDark-bronze2">
                            <motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div
                                    className="w-full h-full relative"
                                    style={{
                                        backgroundImage: sword.aura
                                            ? `url('${getSwordAura(sword.aura)}')`
                                            : undefined,
                                        backgroundSize: "contain",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                />
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        background: `linear-gradient(45deg, transparent, ${rarityColor})`,
                                    }}
                                />
                            </motion.div>
                        </div>

                        <div className="flex flex-col p-6 lg:p-8 bg-bronzeDark-bronze2">
                            <div className="flex-1 flex flex-col gap-6">
                                <motion.div
                                    className="grid grid-cols-2 gap-4 lg:gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <IoMdHammer className="h-4 w-4" />
                                            <span>Material</span>
                                        </div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{
                                                color: handleColor(
                                                    material?.color ?? "rgb(255,255,255)"
                                                ),
                                            }}
                                        >
                                            {material?.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <GoStarFill className="h-4 w-4" />
                                            <span>Quality</span>
                                        </div>
                                        <div className="text-xl font-bold text-bronzeDark-bronze12">
                                            {sword.quality}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <GiRank3 className="h-4 w-4" />
                                            <span>Rarity</span>
                                        </div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{ color: rarityColor }}
                                        >
                                            {sword.rarity}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <LuSword className="h-4 w-4" />
                                            <span>Damage</span>
                                        </div>
                                        <div className="text-xl font-bold text-red-500">
                                            {abbreviateNumber(sword.damage)}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <FaWandMagicSparkles className="h-4 w-4" />
                                            <span>Effect</span>
                                        </div>
                                        <div
                                            className="text-xl font-bold"
                                            style={{
                                                color: effect?.color,
                                            }}
                                        >
                                            {sword.effect ?? "None"}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-bronzeDark-bronze11 text-sm">
                                            <FaCoins className="h-4 w-4" />
                                            <span>Value</span>
                                        </div>
                                        <div className="text-xl font-bold text-yellow-500">
                                            {abbreviateNumber(sword.value)}
                                        </div>
                                    </div>
                                </motion.div>
                                <button
                                    onClick={() => {
                                        setShowEnchants(!showEnchants);
                                    }}
                                    className="font-semibold hover:bg-bronzeDark-bronze5 transition-[15ms] bg-bronzeDark-bronze4 py-2 rounded-md"
                                >
                                    {showEnchants ? "Hide" : "Show"} Enchantments
                                </button>
                                {showEnchants && (
                                    <motion.div
                                        className="space-y-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="h-px bg-gradient-to-r from-transparent via-bronzeDark-bronze4 to-transparent" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {(sword.enchants as Array<string>)?.map(
                                                (enchant, index) => {
                                                    const enchantData = getEnchantData(enchant);
                                                    const enchantColor = handleColor(enchantData.color);

                                                    return (
                                                        <motion.div
                                                            key={enchant}
                                                            className="relative p-3 rounded bg-gradient-to-br from-bronzeDark-bronze3/30 to-bronzeDark-bronze2/30 border border-bronzeDark-bronze4/50"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{
                                                                delay: 0.4 + index * 0.1,
                                                            }}
                                                        >
                                                            <div
                                                                className="font-medium mb-2"
                                                                style={{
                                                                    color: enchantColor,
                                                                }}
                                                            >
                                                                {enchant}
                                                            </div>
                                                            <div className="space-y-1 text-sm">
                                                                {enchantData.luckMultiplier > 1 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-bronzeDark-bronze11">
                                                                            Luck
                                                                        </span>
                                                                        <span className="text-bronzeDark-bronze12">
                                                                            {enchantData.luckMultiplier}x
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {enchantData.valueMultiplier > 1 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-bronzeDark-bronze11">
                                                                            Value
                                                                        </span>
                                                                        <span className="text-bronzeDark-bronze12">
                                                                            {enchantData.valueMultiplier}x
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {enchantData.damageMultiplier > 1 && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-bronzeDark-bronze11">
                                                                            Damage
                                                                        </span>
                                                                        <span className="text-bronzeDark-bronze12">
                                                                            {enchantData.damageMultiplier}x
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
