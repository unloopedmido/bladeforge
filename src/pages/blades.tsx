import Sidebar from "@/components/Sidebar";
import { useProfile } from "@/hooks/useProfile";
import { abbreviateNumber, getSwordAura } from "@/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export default function Blades() {
	const { profile, profileLoading } = useProfile();

	useEffect(() => {
		console.log(profile?.swords);
	}, [profile, profileLoading]);

	if (profileLoading || !profile) {
		return (
			<Sidebar>
				<div className="flex items-center justify-center h-full">
					<div className="text-bronzeDark-bronze11">Loading...</div>
				</div>
			</Sidebar>
		);
	}

	return (
		<Sidebar
			header="My Blades"
			subHeader="View and manage all your generated blades"
		>
			<div className="bg-bronzeDark-bronze1 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 md:place-items-start place-items-center">
				{profile.swords.map((sword) => (
					<div key={sword.id} className="flex flex-col items-center max-w-[400px]">
						<h2 className="font-semibold text-xl text-clip">
							{sword.quality} {sword.rarity} Sword
						</h2>
						<Image
							className="bg-bronzeDark-bronze5 rounded-md"
							src={getSwordAura(sword.aura!)}
							height={300}
							width={300}
							alt={sword.rarity}
						/>
						<div className="flex justify-between w-full px-2 py-2">
							<p className="text-yellow-500">
								${abbreviateNumber(sword.value)}
							</p>
							<p className="text-red-500">{abbreviateNumber(sword.damage)}</p>
						</div>
					</div>
				))}
			</div>
		</Sidebar>
	);
}
