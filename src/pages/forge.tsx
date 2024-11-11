import React, { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { api } from "@/utils/api";
import { type Sword as SwordType } from "@prisma/client";
import { type ClientUserType } from "@/data/common";
import { Button } from "@/components/ui/button";
import {
  Clover,
  Coins,
  Hammer,
  Handshake,
  Save,
  Star,
  type LucideIcon,
} from "lucide-react";
import { abbreviateNumber } from "@/lib/func";
import { toast } from "sonner";
import SwordDisplay from "@/components/sword";
import FakeSword from "@/components/fakesword";
import { Card } from "@/components/ui/card";
import AscenderSheet from "@/components/ascendersheet";
import RerollModal from "@/components/enchants";
import SacrificeModal from "@/components/sacrifice";
import UpgradeLuckDialog from "@/components/upgradeluckdialog";

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
  color?: string;
}

interface ActionButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  disabled: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  loading?: boolean;
  cooldown?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon: Icon,
  label,
  value,
  color = "text-white",
}) => (
  <div className="flex-1 transition-transform hover:scale-105">
    <Card className="relative overflow-hidden bg-black/40 transition-all hover:bg-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div className="relative flex items-center gap-3 p-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${color} bg-black/20`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold">
            {abbreviateNumber(String(value ?? 0))}
          </p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  </div>
);

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon: Icon,
  label,
  disabled,
  variant = "default",
  loading = false,
  cooldown = 0,
}) => (
  <Button
    variant={variant}
    size="lg"
    onClick={onClick}
    disabled={disabled || loading || cooldown > 0}
    className="relative h-14 w-full overflow-hidden"
  >
    <div className="absolute inset-0 bg-white/5" />
    <div className="relative flex items-center justify-center gap-2">
      <Icon className="h-5 w-5" />
      <span className="font-bold">
        {loading ? "Processing..." : cooldown > 0 ? `${cooldown}s` : label}
      </span>
    </div>
    {cooldown > 0 && (
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-200"
        style={{ width: `${(cooldown / 2) * 100}%` }}
      />
    )}
  </Button>
);

const useCooldown = (initialDuration = 0) => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 0.25));
      }, 250);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const startCooldown = () => {
    setCooldown(initialDuration);
  };

  return { cooldown, startCooldown };
};

export default function Forge() {
  const [sword, setSword] = useState<SwordType | null>(null);
  const [user, setUser] = useState<ClientUserType | null>(null);
  const { cooldown: forgeCooldown, startCooldown: startForgeCooldown } =
    useCooldown(user?.vip ? 1 : 2);
  const { cooldown: sellCooldown, startCooldown: startSellCooldown } =
    useCooldown(user?.vip ? 1 : 2);

  const { data: userData, isLoading } = api.user.user.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { mutate: generateSword, isPending: isGenerating } =
    api.sword.generateSword.useMutation({
      onSuccess: (data) => {
        setSword(data);
        startForgeCooldown();
        toast.success("✨ New sword forged!");
      },
      onError: (error) => toast.error(error.message),
    });

  const { mutate: sellSword, isPending: isSelling } =
    api.sword.sellSword.useMutation({
      onSuccess: (data) => {
        setSword(null);
        startSellCooldown();
        toast.success("💰 Sword sold successfully!");
        if (user) {
          setUser({ ...user, money: data.money, experience: data.experience });
        }
      },
      onError: (error) => toast.error(error.message),
    });

  const { mutate: unequipSword, isPending: isStoring } =
    api.sword.unequipSword.useMutation({
      onSuccess: (data) => {
        setSword(null);
        toast.success(`🎒 Sword stored! ${data} slots remaining`);
      },
      onError: (error) => toast.error(error.message),
    });

  useEffect(() => {
    if (userData) {
      setSword(userData.swords.find((s) => s.id === userData.swordId) ?? null);
      setUser(userData);
    }
  }, [userData]);

  const isActionDisabled = isSelling || isStoring || isGenerating;

  if (isLoading) return <Layout isLoading />;

  const handleGenerate = () => {
    if (!sword) generateSword();
  };

  const handleSell = () => {
    if (sword) sellSword(sword.id);
  };

  const handleStore = () => {
    if (sword) unequipSword();
  };

  return (
    <Layout>
      <div className="container relative mx-auto max-w-4xl space-y-6 px-4 py-8">
        {/* Stats Section */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <StatItem
            icon={Coins}
            label="Gold"
            value={Number(user?.money)}
            color="text-yellow-500"
          />
          <StatItem
            icon={Clover}
            label="Luck"
            value={Number(user?.luck)}
            color="text-green-500"
          />
          <StatItem
            icon={Star}
            label="Essence"
            value={user?.essence}
            color="text-purple-500"
          />
        </div>

        {/* Sword Display */}
        <div className="flex justify-center">
          <div className="relative rounded-lg p-6">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-3xl" />
            {sword ? (
              <SwordDisplay username={user?.name ?? ""} sword={sword} />
            ) : (
              <FakeSword />
            )}
          </div>
        </div>

        {/* Primary Actions */}
        <Card className="overflow-hidden bg-black/40 p-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <ActionButton
                icon={Hammer}
                label="Forge"
                onClick={handleGenerate}
                disabled={!!sword}
                loading={isGenerating}
                cooldown={forgeCooldown}
              />
              <ActionButton
                icon={Handshake}
                label="Sell"
                variant="destructive"
                onClick={handleSell}
                disabled={!sword}
                loading={isSelling}
                cooldown={sellCooldown}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ActionButton
                icon={Save}
                label="Store"
                variant="outline"
                onClick={handleStore}
                disabled={!sword}
                loading={isStoring}
              />
              <AscenderSheet
                disabled={isActionDisabled || sellCooldown > 0}
                sword={sword}
                user={user}
                setSword={setSword}
              />
            </div>
          </div>

          {/* Enhancement Actions */}
          <div className="mt-6 grid gap-4 border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <RerollModal
                setSword={setSword}
                setUser={setUser}
                sword={sword}
                essenceLeft={user?.essence ?? 0}
              />
              <SacrificeModal
                setSword={setSword}
                setUser={setUser}
                sword={sword}
              />
            </div>
            <UpgradeLuckDialog user={user} setUser={setUser} />
          </div>
        </Card>
      </div>
    </Layout>
  );
}
