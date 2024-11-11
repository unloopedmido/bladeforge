import {
  Box,
  Button,
  Card,
  Container,
  Em,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
  Badge,
  Strong,
  ScrollArea,
} from "@radix-ui/themes";
import { motion } from "framer-motion";
import {
  Sword,
  Sparkles,
  Castle,
  Star,
  LineChart,
  Crown,
  type LucideIcon,
  Hammer,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <motion.div whileHover={{ scale: 1.02 }} className="h-full">
    <Card size="3" className="h-full">
      <Flex direction="column" gap="4" height="100%">
        <Flex gap="3" align="center">
          <Box className="rounded-lg bg-accent p-2">
            <Icon className="h-5 w-5" />
          </Box>
          <Text size="5" weight="bold">
            {title}
          </Text>
        </Flex>
        <Text size="2">{description}</Text>
      </Flex>
    </Card>
  </motion.div>
);

const features: Array<FeatureCardProps> = [
  {
    icon: Sword,
    title: "Unique Blades",
    description:
      "Forge extraordinary swords with diverse qualities, materials, and unique combinations.",
  },
  {
    icon: Sparkles,
    title: "Magical Enchants",
    description:
      "Enhance your weapons with powerful enchantments that boost their abilities.",
  },
  {
    icon: Castle,
    title: "Epic Progression",
    description:
      "Build your smithing empire from humble beginnings to legendary status.",
  },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="2"
      variant="soft"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed right-4 top-4 z-50"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};

const Home: React.FC = () => {
  return (
    <ScrollArea>
      <ThemeSwitcher />

      {/* Hero Section */}
      <Section
        size="3"
        className="relative flex min-h-screen items-center justify-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, var(--bronze-3), var(--bronze-1))",
        }}
      >
        <Container className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Flex direction="column" align="center" gap="8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <Badge className="mb-6" size="2">
                <Hammer className="mr-1 h-3 w-3" />
                Welcome to the Forge
              </Badge>

              <Heading
                size="9"
                align="center"
                className="mb-4 bg-gradient-to-r from-bronze9 to-amber9 bg-clip-text text-transparent"
              >
                Blade<Em>Forge</Em>
              </Heading>

              <Text
                size="5"
                as="p"
                className="mx-auto mb-8 max-w-2xl text-bronze11"
              >
                Master the art of bladesmithing in an idle factory game. Forge
                legendary weapons, unlock rare enchantments, and rise to become
                the realm&apos;s greatest craftsman.
              </Text>
            </motion.div>

            <Flex gap="4">
              <Button size="4">
                Start Forging
                <Sword className="ml-2 h-4 w-4" />
              </Button>
              <Button size="4" variant="soft">
                Watch Trailer
                <Star className="ml-2 h-4 w-4" />
              </Button>
            </Flex>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 opacity-50"
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </Flex>
        </Container>
      </Section>

      {/* Features & Stats Section */}
      <Section
        size="3"
        className="min-h-screen bg-slate-1 py-20 dark:bg-slate-2" // Different background for light/dark modes
      >
        <Container>
          <Grid columns={{ initial: "1", lg: "2" }} gap="8">
            {/* Left side - Features */}
            <Flex direction="column" gap="12" className="justify-center">
              <Flex direction="column" gap="4">
                <Strong>FEATURES</Strong>
                <Heading size="8">
                  Master the Art of <Em>Smithing</Em>
                </Heading>
                <Text size="4" className="max-w-xl">
                  From common steel to mythical alloys, forge weapons that will
                  become legend. Master enchantments, unlock rare materials, and
                  build your smithing empire.
                </Text>
              </Flex>

              <Grid gap="4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <FeatureCard {...feature} />
                  </motion.div>
                ))}
              </Grid>
            </Flex>

            {/* Right side - Stats */}
            <Flex
              direction="column"
              gap="8"
              className="justify-center lg:border-l lg:pl-8"
            >
              <Flex direction="column" gap="4">
                <Strong>COMMUNITY</Strong>
                <Heading size="7">
                  Join Our Growing <Em>Community</Em>
                </Heading>
                <Text size="3" className="max-w-xl">
                  Be part of an active community of bladesmiths. Share your
                  creations, compete on leaderboards, and forge your legacy
                  together.
                </Text>
              </Flex>

              <Grid gap="6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card size="4">
                    <Flex align="center" gap="8" p="6">
                      <Box className="rounded-full bg-amber9 p-4">
                        <Crown className="h-6 w-6 text-amber1" />
                      </Box>
                      <Flex direction="column" gap="1">
                        <Text size="7" weight="bold">
                          1000+
                        </Text>
                        <Text>Active Players</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card size="4">
                    <Flex align="center" gap="8" p="6">
                      <Box className="rounded-full bg-bronze9 p-4">
                        <Sword className="h-6 w-6 text-bronze1" />
                      </Box>
                      <Flex direction="column" gap="1">
                        <Text size="7" weight="bold">
                          500K+
                        </Text>
                        <Text>Swords Forged</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card size="4">
                    <Flex align="center" gap="8" p="6">
                      <Box className="rounded-full bg-blue9 p-4">
                        <LineChart className="h-6 w-6 text-blue1" />
                      </Box>
                      <Flex direction="column" gap="1">
                        <Text size="7" weight="bold">
                          300+
                        </Text>
                        <Text>Discord Members</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </motion.div>

                <Button size="4" className="mt-4">
                  Join Discord
                  <Crown className="ml-2 h-4 w-4" />
                </Button>
              </Grid>
            </Flex>
          </Grid>
        </Container>
      </Section>
    </ScrollArea>
  );
};

export default Home;
