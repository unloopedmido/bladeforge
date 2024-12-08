import { useState } from "react";
import { api } from "@/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { abbreviateNumber, getLevelFromExperience } from "@/lib/func";
import Link from "next/link";
import {
	FaCrown,
	FaMedal,
	FaTrophy,
	FaCoins,
	FaClover,
	FaChartLine,
	FaStar,
	FaGem,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type LeaderboardType = "level" | "luck" | "coins";

const RankIcon = ({ position }: { position: number }) => {
	if (position === 1)
		return <FaCrown className="text-bronzeDark-bronze9 h-6 w-6" />;
	if (position === 2)
		return <FaMedal className="text-bronzeDark-bronze8 h-6 w-6" />;
	if (position === 3)
		return <FaMedal className="text-bronzeDark-bronze7 h-6 w-6" />;
	return <FaTrophy className="text-bronzeDark-bronze6 h-5 w-5" />;
};

export default function Leaderboards() {
	const [activeBoard, setActiveBoard] = useState<LeaderboardType>("level");
	const { data: users, isLoading } = api.user.getUsers.useQuery(undefined, {
		refetchOnWindowFocus: false,
		refetchInterval: 10000,
	});

	const tabs = [
		{ id: "level", label: "Top Levels", icon: FaChartLine },
		{ id: "luck", label: "Luckiest", icon: FaClover },
		{ id: "coins", label: "Richest", icon: FaCoins },
	] as const;

	const getSortedUsers = (type: LeaderboardType) => {
		if (!users) return [];
		switch (type) {
			case "level":
				return [...users]
					.sort((a, b) => Number(b.experience) - Number(a.experience))
					.slice(0, 50);
			case "luck":
				return [...users].sort((a, b) => b.luck - a.luck).slice(0, 50);
			case "coins":
				return [...users]
					.sort((a, b) => Number(b.money) - Number(a.money))
					.slice(0, 50);
		}
	};

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<h1 className="text-bronzeDark-bronze12 mb-2 text-4xl font-bold">
					Leaderboards
				</h1>
				<p className="text-bronzeDark-bronze11">
					Top Bladesmiths competing for glory
				</p>
			</div>

			{/* Tabs */}
			<div className="mb-8 flex flex-wrap justify-center gap-4">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveBoard(tab.id)}
						className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
							activeBoard === tab.id
								? "from-bronzeDark-bronze9 to-bronzeDark-bronze8 text-bronzeDark-bronze1 bg-gradient-to-r"
								: "bg-bronzeDark-bronze3 text-bronzeDark-bronze11 hover:bg-bronzeDark-bronze4"
						}`}
					>
						<tab.icon className="h-4 w-4" />
						{tab.label}
					</button>
				))}
			</div>

			{/* Leaderboard */}
			<div className="space-y-4">
				<AnimatePresence mode="wait">
					{getSortedUsers(activeBoard).map((user, index) => (
						<motion.div
							key={user.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
							className={`group relative overflow-hidden rounded-lg border transition-all ${
								index < 3
									? "border-bronzeDark-bronze9/20 bg-bronzeDark-bronze3/50"
									: "border-bronzeDark-bronze4/20 bg-bronzeDark-bronze3/30"
							}`}
						>
							{/* Gradient overlay for top 3 */}
							{index < 3 && (
								<div className="from-bronzeDark-bronze9/10 absolute inset-0 -z-10 bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							)}

							<div className="flex items-center gap-4 p-4">
								{/* Rank */}
								<div className="bg-bronzeDark-bronze4/50 flex h-12 w-12 items-center justify-center rounded-lg">
									<RankIcon position={index + 1} />
								</div>

								{/* User Info */}
								<div className="flex flex-1 items-center gap-3">
									<Avatar className="border-bronzeDark-bronze9/20 h-12 w-12 border-2">
										<AvatarImage src={user.image ?? undefined} />
										<AvatarFallback className="bg-bronzeDark-bronze4 text-bronzeDark-bronze11">
											{user.name?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<div>
										<div className="flex items-center gap-2">
											<Link
												href={`/profiles/${user.id}`}
												className="text-bronzeDark-bronze12 hover:text-bronzeDark-bronze11 font-bold transition-colors"
											>
												{user.name}
											</Link>
											{user.vip && (
												<span className="from-bronzeDark-bronze9 to-bronzeDark-bronze8 text-bronzeDark-bronze1 rounded bg-gradient-to-r px-1.5 py-0.5 text-xs font-bold">
													VIP
												</span>
											)}
										</div>
										<div className="text-bronzeDark-bronze11 flex items-center gap-2 text-sm">
											<FaStar className="text-bronzeDark-bronze9 h-3 w-3" />
											Level {getLevelFromExperience(Number(user.experience))}
										</div>
									</div>
								</div>

								{/* Stats */}
								<div className="flex items-center gap-6">
									<div className="flex items-center gap-2">
										<FaCoins className="text-bronzeDark-bronze9 h-4 w-4" />
										<span className="text-bronzeDark-bronze11 text-sm font-medium">
											{abbreviateNumber(user.money)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FaClover className="text-bronzeDark-bronze9 h-4 w-4" />
										<span className="text-bronzeDark-bronze11 text-sm font-medium">
											{user.luck}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FaGem className="text-bronzeDark-bronze9 h-4 w-4" />
										<span className="text-bronzeDark-bronze11 text-sm font-medium">
											{user.essence}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
