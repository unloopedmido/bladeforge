import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
	FaCrown,
	FaHammer,
	FaDiscord,
	FaGem,
	FaBalanceScale,
	FaMagic,
	FaChevronDown,
	FaTrophy,
	FaStar,
} from "react-icons/fa";
import { LuSwords } from "react-icons/lu";

const features = [
	{
		icon: LuSwords,
		title: "Unique Generation",
		description:
			"Every blade is unique with random properties based on your luck and level.",
	},
	{
		icon: FaBalanceScale,
		title: "Ascension System",
		description:
			"Upgrade your sword's rarity, quality, and materials through the ascension system.",
	},
	{
		icon: FaMagic,
		title: "Enchantments",
		description:
			"Enhance your weapons with powerful enchants using essence from sacrificed blades.",
	},
	{
		icon: FaGem,
		title: "Deep Progression",
		description:
			"Build your smithing empire from basic blades to legendary weapons.",
	},
];

const stats = [
	{
		icon: FaCrown,
		value: "1,000+",
		label: "Active Players",
	},
	{
		icon: LuSwords,
		value: "500K+",
		label: "Swords Generated",
	},
	{
		icon: FaHammer,
		value: "3M+",
		label: "Refine Attempts",
	},
	{
		icon: FaDiscord,
		value: "300+",
		label: "Discord Members",
	},
];

export default function Landing() {
	const router = useRouter();
	const { status } = useSession();

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		element?.scrollIntoView({ behavior: "smooth" });
	};

	// Bouncing animation for chevron
	const bounceAnimation = {
		y: [0, -8, 0],
		transition: {
			duration: 1.5,
			repeat: Infinity,
			ease: "easeInOut",
		},
	};

	const handleStartForging = () => {
		if (status === "authenticated") {
			void router.push("/forge");
		} else {
			void signIn("discord");
		}
	};

	return (
		<div className="h-screen snap-y snap-mandatory overflow-y-auto overflow-x-hidden">
			{/* Hero Section */}
			<section
				id="hero"
				className="relative flex min-h-screen snap-start items-center"
			>
				<div className="bg-bronzeDark-bronze1 absolute inset-0">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(161,128,114,0.15),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(161,128,114,0.1),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(161,128,114,0.1),transparent_50%)]" />
				</div>

				<div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:py-0">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-center"
					>
						<h1 className="text-bronzeDark-bronze12 mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
							Master the Art of{" "}
							<span className="from-bronzeDark-bronze9 to-bronzeDark-bronze8 bg-gradient-to-r bg-clip-text text-transparent">
								Bladesmithing
							</span>
						</h1>
						<p className="text-bronzeDark-bronze11 mx-auto mb-8 max-w-2xl text-base sm:mb-12 sm:text-lg md:text-xl">
							Forge legendary weapons in this idle factory game. Generate unique
							blades, unlock rare materials, and rise through the ranks to
							become the realm&apos;s greatest weaponsmith.
						</p>
						<button
							onClick={handleStartForging}
							className="from-bronzeDark-bronze9 to-bronzeDark-bronze8 text-bronzeDark-bronze1 hover:from-bronzeDark-bronze8 hover:to-bronzeDark-bronze8 group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-6 py-3 text-base font-medium transition-all active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
						>
							Start Forging
							<FaHammer className="h-5 w-5 transition-transform group-hover:rotate-12" />
						</button>
					</motion.div>
				</div>

				{/* Animated Chevron */}
				<motion.button
					animate={bounceAnimation}
					onClick={() => scrollToSection("features")}
					className="text-bronzeDark-bronze11 hover:text-bronzeDark-bronze12 absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-colors"
				>
					<FaChevronDown className="h-8 w-8" />
				</motion.button>
			</section>

			{/* Features & Stats Section */}
			<section
				id="features"
				className="relative flex min-h-screen snap-start items-center"
			>
				<div className="bg-bronzeDark-bronze2 absolute inset-0">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(161,128,114,0.1),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(161,128,114,0.05),transparent_50%)]" />
				</div>

				<div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:py-16">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						{/* Features Column */}
						<div className="space-y-8 sm:space-y-12">
							<div>
								<h2 className="text-bronzeDark-bronze12 text-2xl font-bold sm:text-3xl md:text-4xl">
									Forge Your Legacy
								</h2>
								<p className="text-bronzeDark-bronze11 mt-4 text-base sm:text-lg">
									Experience a deep crafting system with endless possibilities
								</p>
							</div>

							<div className="space-y-6 sm:space-y-8">
								{features.map((feature, index) => (
									<motion.div
										key={feature.title}
										initial={{ opacity: 0, x: -20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
										className="group space-y-2 sm:space-y-3"
									>
										<div className="flex items-center gap-4">
											<div className="bg-bronzeDark-bronze4 group-hover:bg-bronzeDark-bronze5 rounded-lg p-2 transition-all sm:p-3">
												<feature.icon className="text-bronzeDark-bronze11 h-5 w-5 sm:h-6 sm:w-6" />
											</div>
											<h3 className="text-bronzeDark-bronze12 text-lg font-bold sm:text-xl">
												{feature.title}
											</h3>
										</div>
										<p className="text-bronzeDark-bronze11 pl-14 text-sm sm:pl-16 sm:text-base">
											{feature.description}
										</p>
									</motion.div>
								))}
							</div>
						</div>

						{/* Stats Column */}
						<div className="lg:border-bronzeDark-bronze4 flex flex-col justify-center lg:border-l lg:pl-16">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8 lg:grid-cols-1">
								{stats.map((stat, index) => (
									<motion.div
										key={stat.label}
										initial={{ opacity: 0, x: 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 }}
										className="from-bronzeDark-bronze3 to-bronzeDark-bronze3/50 hover:from-bronzeDark-bronze4 hover:to-bronzeDark-bronze3 group overflow-hidden rounded-xl bg-gradient-to-br p-4 transition-all sm:p-6"
									>
										<div className="flex items-center gap-4">
											<div className="bg-bronzeDark-bronze4/50 group-hover:bg-bronzeDark-bronze5 rounded-lg p-2 transition-all sm:p-3">
												<stat.icon className="text-bronzeDark-bronze9 h-5 w-5 sm:h-6 sm:w-6" />
											</div>
											<div>
												<div className="text-bronzeDark-bronze12 text-2xl font-bold sm:text-3xl">
													{stat.value}
												</div>
												<div className="text-bronzeDark-bronze11 text-xs sm:text-sm">
													{stat.label}
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Animated Chevron */}
				<motion.button
					animate={bounceAnimation}
					onClick={() => scrollToSection("community")}
					className="text-bronzeDark-bronze11 hover:text-bronzeDark-bronze12 absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-colors"
				>
					<FaChevronDown className="h-8 w-8" />
				</motion.button>
			</section>

			{/* Community Section */}
			<section
				id="community"
				className="relative flex min-h-screen snap-start items-center"
			>
				<div className="bg-bronzeDark-bronze1 absolute inset-0">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(161,128,114,0.1),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(161,128,114,0.05),transparent_50%)]" />
				</div>

				<div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:py-16">
					<div className="mb-12 text-center">
						<h2 className="text-bronzeDark-bronze12 mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
							Join Our Thriving Community
						</h2>
						<p className="text-bronzeDark-bronze11 mx-auto max-w-2xl text-base sm:text-lg">
							Connect with fellow bladesmiths, participate in events, and get
							exclusive perks
						</p>
					</div>

					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{/* Current Features */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="from-bronzeDark-bronze3 to-bronzeDark-bronze3/50 group rounded-xl bg-gradient-to-br p-6"
						>
							<div className="bg-bronzeDark-bronze4/50 group-hover:bg-bronzeDark-bronze5 mb-4 inline-flex rounded-lg p-3 transition-all">
								<FaStar className="text-bronzeDark-bronze9 h-6 w-6" />
							</div>
							<h3 className="text-bronzeDark-bronze12 mb-3 text-lg font-bold">
								Weekly Events
							</h3>
							<ul className="text-bronzeDark-bronze11 space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Weekly giveaways with valuable prizes
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Early access to update sneak peeks
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Community challenges and events
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Exclusive discord activities
								</li>
							</ul>
						</motion.div>

						{/* Coming Soon Features */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="from-bronzeDark-bronze3 to-bronzeDark-bronze3/50 group rounded-xl bg-gradient-to-br p-6"
						>
							<div className="bg-bronzeDark-bronze4/50 group-hover:bg-bronzeDark-bronze5 mb-4 inline-flex rounded-lg p-3 transition-all">
								<FaTrophy className="text-bronzeDark-bronze9 h-6 w-6" />
							</div>
							<div className="mb-3 flex items-center gap-2">
								<h3 className="text-bronzeDark-bronze12 text-lg font-bold">
									Ranked Battles
								</h3>
								<span className="text-bronzeDark-bronze9 bg-bronzeDark-bronze4 rounded-full px-2 py-1 text-xs font-medium">
									Coming Soon
								</span>
							</div>
							<ul className="text-bronzeDark-bronze11 space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Monthly competitive ladder
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Battle with equipped swords
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Monthly rank rewards
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Seasonal leaderboards
								</li>
							</ul>
						</motion.div>

						{/* Premium Benefits */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="from-bronzeDark-bronze3 to-bronzeDark-bronze3/50 group rounded-xl bg-gradient-to-br p-6"
						>
							<div className="bg-bronzeDark-bronze4/50 group-hover:bg-bronzeDark-bronze5 mb-4 inline-flex rounded-lg p-3 transition-all">
								<FaCrown className="text-bronzeDark-bronze9 h-6 w-6" />
							</div>
							<h3 className="text-bronzeDark-bronze12 mb-3 text-lg font-bold">
								Member Perks
							</h3>
							<ul className="text-bronzeDark-bronze11 space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									VIP & Booster benefits and exclusive features
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Discuss best strategies with top players
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Trading system access (Coming Soon)
								</li>
								<li className="flex items-start gap-2">
									<span className="text-bronzeDark-bronze9 mt-1">•</span>
									Donation features (Coming Soon)
								</li>
							</ul>
						</motion.div>
					</div>

					<div className="mt-12 text-center">
						<a
							href="https://discord.gg/K3G9Nupc2c"
							target="_blank"
							rel="noopener noreferrer"
							className="from-bronzeDark-bronze9 to-bronzeDark-bronze8 text-bronzeDark-bronze1 hover:from-bronzeDark-bronze8 hover:to-bronzeDark-bronze8 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-6 py-3 text-base font-medium transition-all active:scale-95 sm:px-8 sm:py-4 sm:text-lg"
						>
							Join Our Discord
							<FaDiscord className="h-5 w-5" />
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
