import Link from "next/link";
import Image from "next/image";
import { type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
	FaHammer,
	FaDiceD20,
	FaTrophy,
	FaUsers,
	FaBook,
	FaShieldAlt,
	FaHome,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import { LuSwords } from "react-icons/lu";
import { useState } from "react";

interface SidebarProps {
	children: ReactNode;
	header?: string;
	subHeader?: string;
}

const Pages = {
	game: [
		{ name: "Home", path: "/", icon: FaHome },
		{ name: "Forge", path: "/forge", icon: FaHammer },
		{ name: "My Blades", path: "/blades", icon: LuSwords },
		{ name: "Chances", path: "/chances", icon: FaDiceD20 },
	],
	community: [
		{ name: "Leaderboards", path: "/leaderboards", icon: FaTrophy },
		{ name: "Profiles", path: "/profiles", icon: FaUsers },
	],
	misc: [
		{ name: "Guide", path: "/guide", icon: FaBook },
		{ name: "Settings", path: "/settings", icon: FaGear },
		{ name: "Terms of Service", path: "/terms", icon: FaShieldAlt },
		{ name: "Privacy Policy", path: "/privacy", icon: FaShieldAlt },
	],
};

export default function Sidebar({ children, header, subHeader }: SidebarProps) {
	const { data: session } = useSession();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const SidebarContent = () => (
		<div className="flex h-full flex-col">
			{/* Logo Section with gradient border */}
			<div className="relative border-b border-bronzeDark-bronze3">
				<div className="flex items-center gap-3 p-4">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-bronzeDark-bronze9 to-bronzeDark-bronze8">
						<span className="text-lg font-bold text-bronzeDark-bronze1">B</span>
					</div>
					<Link
						className="text-xl font-bold tracking-tight text-bronzeDark-bronze11 transition-colors hover:text-bronzeDark-bronze12"
						href="/"
					>
						BladeForge
					</Link>
				</div>
			</div>

			{/* Navigation */}
			<div className="scrollbar-thin scrollbar-track-bronzeDark-bronze1 scrollbar-thumb-bronzeDark-bronze4 flex-1 overflow-y-auto">
				<nav className="space-y-6 p-4">
					{Object.entries(Pages).map(([category, pages]) => (
						<div key={category} className="space-y-2">
							<h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-bronzeDark-bronze9">
								{category}
							</h2>
							<div className="space-y-1">
								{pages.map((page) => {
									const isActive = pathname === page.path;
									return (
										<Link
											key={page.path}
											href={page.path}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
												isActive
													? "bg-bronzeDark-bronze3 text-bronzeDark-bronze12"
													: "text-bronzeDark-bronze11 hover:bg-bronzeDark-bronze3/50 hover:text-bronzeDark-bronze12"
											}`}
										>
											<div className="flex items-center gap-3">
												<page.icon
													className={`h-4 w-4 transition-colors ${
														isActive
															? "text-bronzeDark-bronze9"
															: "text-bronzeDark-bronze9 group-hover:text-bronzeDark-bronze9"
													}`}
												/>
												<span className="font-medium">{page.name}</span>
											</div>
											{isActive && (
												<div className="h-1.5 w-1.5 rounded-full bg-bronzeDark-bronze9" />
											)}
										</Link>
									);
								})}
							</div>
						</div>
					))}
				</nav>
			</div>

			{/* User Profile Section with gradient */}
			<div className="relative border-t border-bronzeDark-bronze3 p-4">
				<div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-bronzeDark-bronze1 to-transparent" />
				{session ? (
					<div className="group overflow-hidden rounded-lg bg-gradient-to-br from-bronzeDark-bronze3 to-bronzeDark-bronze3/50 p-3">
						<div className="flex items-center gap-3">
							{session.user?.image ? (
								<Image
									src={session.user.image}
									alt={session.user.name ?? "User avatar"}
									width={40}
									height={40}
									className="rounded-lg ring-2 ring-bronzeDark-bronze9/20 transition-all duration-300 group-hover:ring-bronzeDark-bronze9/40"
								/>
							) : (
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bronzeDark-bronze4 text-bronzeDark-bronze11 ring-2 ring-bronzeDark-bronze9/20 transition-all duration-300 group-hover:ring-bronzeDark-bronze9/40">
									{session.user?.name?.charAt(0) ?? "U"}
								</div>
							)}
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-bronzeDark-bronze12">
									{session.user?.name ?? "User"}
								</p>
								<p className="truncate text-xs text-bronzeDark-bronze11">
									{session.user?.email ?? ""}
								</p>
							</div>
							<Link
								href="/settings"
								className="rounded-lg p-2 text-bronzeDark-bronze9 transition-all duration-200 hover:bg-bronzeDark-bronze4 hover:text-bronzeDark-bronze12 active:scale-95"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<FaGear className="h-4 w-4" />
							</Link>
						</div>
					</div>
				) : (
					<Link
						href="/api/auth/signin"
						className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-bronzeDark-bronze9 to-bronzeDark-bronze8 p-3 text-sm font-medium text-bronzeDark-bronze1 transition-all hover:from-bronzeDark-bronze8 hover:to-bronzeDark-bronze8 active:scale-95"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);

	return (
		<div className="flex min-h-screen bg-bronzeDark-bronze2">
			{/* Desktop Sidebar */}
			<aside className="hidden w-64 flex-shrink-0 bg-bronzeDark-bronze1 sm:block">
				<div className="fixed h-screen w-64">
					<SidebarContent />
				</div>
			</aside>

			{/* Mobile Header */}
			<div className="fixed top-0 z-30 flex h-16 w-full items-center justify-between border-b border-bronzeDark-bronze3 bg-bronzeDark-bronze1/95 px-4 backdrop-blur-sm sm:hidden">
				<div className="flex items-center gap-3">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-bronzeDark-bronze9 to-bronzeDark-bronze8">
						<span className="text-lg font-bold text-bronzeDark-bronze1">B</span>
					</div>
					<span className="text-lg font-bold text-bronzeDark-bronze11">
						BladeForge
					</span>
				</div>
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="rounded-lg p-2 text-bronzeDark-bronze9 transition-all duration-200 hover:bg-bronzeDark-bronze3 active:scale-95"
				>
					{isMobileMenuOpen ? (
						<IoClose className="h-6 w-6" />
					) : (
						<IoMenu className="h-6 w-6" />
					)}
				</button>
			</div>

			{/* Mobile Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-bronzeDark-bronze1 transition-transform duration-200 ease-out ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				} sm:hidden`}
				style={{ top: "64px" }}
			>
				<SidebarContent />
			</aside>

			{/* Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 z-10 bg-bronzeDark-bronze1/60 backdrop-blur-sm sm:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Main Content */}
			<main className="flex-1 bg-bronzeDark-bronze2">
				{/* Content Area with Mobile-Friendly Header */}
				<div className="pt-16 sm:pt-0"> {/* Add padding top for mobile header */}
					{/* Header Section */}
					{(header 
          ?? subHeader) && (
						<div className="border-b border-bronzeDark-bronze3 bg-bronzeDark-bronze1/95 px-4 py-4 sm:px-6 sm:py-8 backdrop-blur-sm">
							<div className="mx-auto max-w-7xl">
								{header && (
									<h1 className="bg-gradient-to-r from-bronzeDark-bronze12 to-bronzeDark-bronze11 bg-clip-text text-2xl sm:text-4xl font-bold tracking-tight text-transparent">
										{header}
									</h1>
								)}
								{subHeader && (
									<p className="mt-2 text-base sm:text-lg text-bronzeDark-bronze11">
										{subHeader}
									</p>
								)}
							</div>
						</div>
					)}
					
					{/* Page Content */}
					<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 text-bronzeDark-bronze11">
						<div className="flex flex-col justify-center w-full">
							{children}
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}