import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LinearGradient as LG } from "react-text-gradients";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Star, Diamond, Sparkles, Wand2, Flame, type LucideIcon } from "lucide-react";
import { abbreviateNumber, rgbToAlpha } from "@/lib/func";
import Rarities from "@/data/rarities";
import Qualities from "@/data/qualities";
import Materials from "@/data/materials";
import Enchants from "@/data/enchants";
import Auras from "@/data/auras";
import Effects from "@/data/effects";
import { getSwordAura } from '@/data/common';

type CategoryId = 'rarity' | 'quality' | 'material' | 'enchants' | 'auras' | 'effects';

interface Category {
  id: CategoryId;
  icon: LucideIcon;
  title: string;
}

interface BaseItem {
  name: string;
  chance: number;
  valueMultiplier: number;
  damageMultiplier: number;
  color: string | string[];
}

interface Enchant extends BaseItem {
  tier: number;
  experienceMultiplier: number;
  luckMultiplier: number;
}

interface ChanceCardProps extends Partial<Enchant> {
  name: string;
  chance: number;
  valueMultiplier: number;
  color: string | string[];
  userTotalLuck?: number;
  showPersonalizedChances?: boolean;
  auraImage?: string;
  isPercentage?: boolean;
}

const ChanceCard: React.FC<ChanceCardProps> = ({ 
  name, 
  chance, 
  valueMultiplier, 
  damageMultiplier = 0, 
  color, 
  experienceMultiplier = 0, 
  luckMultiplier = 0, 
  userTotalLuck = 1,
  showPersonalizedChances = true,
  auraImage,
  isPercentage = false
}) => (
  <Card className="group relative overflow-hidden transition-all hover:bg-card">
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    <CardHeader className="p-3">
      <div className="flex items-center gap-2">
        <CardTitle>
          <LG gradient={["to left", Array.isArray(color) ? color.join(", ") : rgbToAlpha(color, 1).join(", ")]} className="text-lg font-bold">
            {name}
          </LG>
        </CardTitle>
        {auraImage && (
          <img src={auraImage} alt={`${name} aura`} className="h-8 w-8 object-contain" />
        )}
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3">
      <div className="flex flex-col items-center">
        <p className="font-medium">
          {isPercentage 
            ? `${chance}%`
            : showPersonalizedChances 
              ? `1/${abbreviateNumber(String(chance / userTotalLuck))}`
              : `1/${abbreviateNumber(String(chance))}`
          }
        </p>
        <p className="text-xs text-muted-foreground">Chance</p>
      </div>

      {valueMultiplier > 0 && (
        <div className="flex flex-col items-center">
          <p className="font-medium">{abbreviateNumber(String(valueMultiplier))}</p>
          <p className="text-xs text-muted-foreground">Value</p>
        </div>
      )}

      {damageMultiplier > 0 && (
        <div className="flex flex-col items-center">
          <p className="font-medium">{abbreviateNumber(String(damageMultiplier))}</p>
          <p className="text-xs text-muted-foreground">Damage</p>
        </div>
      )}

      {experienceMultiplier > 0 && (
        <div className="flex flex-col items-center">
          <p className="font-medium">{abbreviateNumber(String(experienceMultiplier))}%</p>
          <p className="text-xs text-muted-foreground">Experience</p>
        </div>
      )}

      {luckMultiplier > 0 && (
        <div className="flex flex-col items-center">
          <p className="font-medium">{abbreviateNumber(String(luckMultiplier))}%</p>
          <p className="text-xs text-muted-foreground">Luck</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Chances(): JSX.Element {
  const [activeCategory, setActiveCategory] = React.useState<CategoryId>('rarity');
  const [showPersonalizedChances, setShowPersonalizedChances] = React.useState(true);
  const { status } = useSession();
  const { data: userTotalLuck, isLoading: isUserTotalLuckLoading } = api.user.userTotalLuck.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  if (isUserTotalLuckLoading || status === "loading") {
    return <Layout isLoading />;
  }

  const categories: Category[] = [
    { id: 'rarity', icon: Diamond, title: 'Rarities' },
    { id: 'quality', icon: Star, title: 'Qualities' },
    { id: 'material', icon: Sword, title: 'Materials' },
    { id: 'enchants', icon: Sparkles, title: 'Enchants' },
    { id: 'auras', icon: Wand2, title: 'Auras' },
    { id: 'effects', icon: Flame, title: 'Effects' }
  ];

  const renderContent = (): JSX.Element => {
    switch (activeCategory) {
      case 'rarity':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Rarities.sort((a, b) => a.chance - b.chance).map(r => (
              <ChanceCard 
                key={r.name} 
                {...r} 
                userTotalLuck={userTotalLuck}
                showPersonalizedChances={showPersonalizedChances}
              />
            ))}
          </div>
        );
      case 'quality':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Qualities.sort((a, b) => a.chance - b.chance).map(q => (
              <ChanceCard 
                key={q.name} 
                {...q} 
                color="rgb(255,255,255)" 
                userTotalLuck={userTotalLuck}
                showPersonalizedChances={showPersonalizedChances}
              />
            ))}
          </div>
        );
      case 'material':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Materials.sort((a, b) => a.chance - b.chance).map(m => (
              <ChanceCard 
                key={m.name} 
                {...m} 
                damageMultiplier={1} 
                userTotalLuck={userTotalLuck}
                showPersonalizedChances={showPersonalizedChances}
              />
            ))}
          </div>
        );
      case 'enchants':
        return (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6].map((tier) => (
              <div key={tier}>
                <Badge variant="outline" className="mb-4">
                  Tier {tier}
                </Badge>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Enchants.filter(e => e.tier === tier).map(e => (
                    <ChanceCard 
                      key={e.name} 
                      {...e}
                      showPersonalizedChances={showPersonalizedChances}
                      isPercentage
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'auras':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Auras.filter(a => a.valueMultiplier > 1)
              .sort((a, b) => b.chance - a.chance)
              .map(a => (
                <ChanceCard 
                  key={a.name} 
                  {...a}
                  showPersonalizedChances={showPersonalizedChances}
                  auraImage={getSwordAura(a.name)}
                  isPercentage
                />
              ))}
          </div>
        );
      case 'effects':
        return (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Effects.filter(e => e.valueMultiplier > 1)
              .sort((a, b) => b.chance - a.chance)
              .map(e => (
                <ChanceCard 
                  key={e.name} 
                  {...e}
                  showPersonalizedChances={showPersonalizedChances}
                  isPercentage
                />
              ))}
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <h1 className="text-3xl font-bold">Item Chances</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Base chances</span>
            <Switch
              checked={showPersonalizedChances}
              onCheckedChange={setShowPersonalizedChances}
            />
            <span className="text-sm text-muted-foreground">Personal chances</span>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as CategoryId)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 gap-2 sm:grid-cols-6">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div>
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}