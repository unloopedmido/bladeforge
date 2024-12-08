import Sidebar from "@/components/Sidebar";
import SwordDisplay from "@/components/SwordDisplay";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { GiAngelWings, GiUpgrade } from "react-icons/gi";
import { RiSwordFill } from "react-icons/ri";
import { FaCoins, FaWarehouse } from "react-icons/fa";
import {
	getLevelFromExperience,
	getExperienceForNextLevel,
} from "@/server/level";
import { abbreviateNumber } from "@/lib/utils";
import { IoSparkles } from "react-icons/io5";
import { MdSell } from "react-icons/md";

export default function Forge() {
	const { currentSword, profileLoading, profile } = useProfile();

	const ActionButton = ({
		icon: Icon,
		label,
		onClick,
		disabled = false,
		variant = "default",
	}: {
		icon: React.ElementType;
		label: string;
		onClick: () => void;
		disabled?: boolean;
		variant?: "default" | "success" | "warning" | "info";
	}) => {
		const variantClasses = {
			default: "bg-bronzeDark-bronze9/10 group-hover:bg-bronzeDark-bronze9/20",
			success: "bg-green-500/10 group-hover:bg-green-500/20",
			warning: "bg-orange-500/10 group-hover:bg-orange-500/20",
			info: "bg-blue-500/10 group-hover:bg-blue-500/20",
		};

		const iconClasses = {
			default: "text-bronzeDark-bronze9",
			success: "text-green-500",
			warning: "text-orange-500",
			info: "text-blue-500",
		};

		return (
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={onClick}
				disabled={disabled}
				className="group relative px-4 py-3 rounded-lg overflow-hidden bg-gradient-to-br from-bronzeDark-bronze3 to-bronzeDark-bronze2 hover:from-bronzeDark-bronze4 hover:to-bronzeDark-bronze3 border border-bronzeDark-bronze4/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<div
					className={`absolute inset-0 transition-colors ${variantClasses[variant]}`}
				/>
				<div className="relative flex items-center justify-center gap-2 text-bronzeDark-bronze12">
					<Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
					<span className="font-medium">{label}</span>
				</div>
			</motion.button>
		);
	};

	if (profileLoading || !profile) {
		return (
			<Sidebar>
				<div className="flex items-center justify-center h-full">
					<div className="text-bronzeDark-bronze11">Loading...</div>
				</div>
			</Sidebar>
		);
	}

	const currentLevel = getLevelFromExperience(Number(profile.experience));
	const nextLevelExp = getExperienceForNextLevel(currentLevel);
	const currentLevelExp = Number(profile.experience);
	const progressPercent = ((currentLevelExp / nextLevelExp) * 100).toFixed(1);

	return (
		<Sidebar header="Forge" subHeader="View and manage your currently equipped sword">
			<div className="w-full mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					{/* Left Side - Sword Display */}
					<div className="flex justify-center ">
						{currentSword ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								className="w-full max-w-[600px]"
							>
								<SwordDisplay sword={currentSword} />
							</motion.div>
						) : (
							<div className="w-full max-w-[600px] h-[800px] rounded-xl border-2 border-dashed border-bronzeDark-bronze4 bg-bronzeDark-bronze2/50 flex items-center justify-center">
								<div className="text-bronzeDark-bronze11 text-center">
									<RiSwordFill className="h-8 w-8 mx-auto mb-2 text-bronzeDark-bronze9" />
									<p>Generate a sword to begin</p>
								</div>
							</div>
						)}
					</div>

          {/* Right Side - Stats and Actions */}
					<div className="flex flex-col gap-6">
						{/* Stats Grid */}
						<div className="grid grid-cols-2 gap-4">
							{/* Level */}
							<div className="bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 rounded-lg p-4 border border-bronzeDark-bronze4">
								<div className="space-y-2">
									<div className="text-sm text-bronzeDark-bronze11">
										Level {currentLevel}
									</div>
									<div className="h-1.5 rounded-full bg-bronzeDark-bronze3 overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-bronzeDark-bronze8 to-bronzeDark-bronze9"
											style={{ width: `${progressPercent}%` }}
										/>
									</div>
									<div className="text-xs text-bronzeDark-bronze11">
										{progressPercent}%
									</div>
								</div>
							</div>

							{/* Money */}
							<div className="bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 rounded-lg p-4 border border-bronzeDark-bronze4">
								<div className="flex items-center justify-between">
									<div className="text-sm text-bronzeDark-bronze11">Money</div>
									<FaCoins className="text-yellow-500 h-4 w-4" />
								</div>
								<div className="mt-2 text-lg font-medium text-yellow-500">
									{abbreviateNumber(Number(profile.money))}
								</div>
							</div>

							{/* Essence */}
							<div className="bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 rounded-lg p-4 border border-bronzeDark-bronze4">
								<div className="flex items-center justify-between">
									<div className="text-sm text-bronzeDark-bronze11">
										Essence
									</div>
									<IoSparkles className="text-purple-500 h-4 w-4" />
								</div>
								<div className="mt-2 text-lg font-medium text-purple-500">
									{abbreviateNumber(profile.essence)}
								</div>
							</div>

							{/* Luck */}
							<div className="bg-gradient-to-br from-bronzeDark-bronze2 to-bronzeDark-bronze1 rounded-lg p-4 border border-bronzeDark-bronze4">
								<div className="flex items-center justify-between">
									<div className="text-sm text-bronzeDark-bronze11">Luck</div>
									<GiUpgrade className="text-green-500 h-4 w-4" />
								</div>
								<div className="mt-2 text-lg font-medium text-green-500">
									{profile.luck}%
								</div>
							</div>
						</div>

						{/* Main Game Actions */}
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-3">
								<ActionButton
									icon={RiSwordFill}
									label="Generate Sword"
									onClick={() => console.log("Generate Sword")}
								/>
								<ActionButton
									icon={GiAngelWings}
									label="Sacrifice Altar"
									onClick={() => console.log("Sacrifice Altar")}
									disabled={!currentSword}
									variant="warning"
								/>
								<ActionButton
									icon={GiUpgrade}
									label="Upgrade Luck"
									onClick={() => console.log("Upgrade Luck")}
									variant="success"
								/>
							</div>

							{currentSword && (
								<>
									<div className="h-px bg-gradient-to-r from-transparent via-bronzeDark-bronze4 to-transparent" />
									<div className="grid grid-cols-1 gap-3">
										<ActionButton
											icon={MdSell}
											label="Sell Sword"
											onClick={() => console.log("Sell Sword")}
											variant="success"
										/>
										<ActionButton
											icon={FaWarehouse}
											label="Store Sword"
											onClick={() => console.log("Store Sword")}
											variant="info"
										/>
										<ActionButton
											icon={GiUpgrade}
											label="Refine Sword"
											onClick={() => console.log("Refine Sword")}
											variant="warning"
										/>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Sidebar>
	);
}
