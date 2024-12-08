import { api } from "@/utils/api";
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AppRouter } from "@/server/api/root";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { UserProfile } from "@/server/user";
import type { Sword } from "@prisma/client";

interface ProfileContextType {
	profile: UserProfile | null;
	profileLoading: boolean;
	error: TRPCClientErrorLike<AppRouter> | null;
	refetchProfile: () => Promise<UserProfile | undefined>;
	currentSword: Sword | null;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
	undefined,
);

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [currentSword, setCurrentSword] = useState<Sword | null>(null);

	const { data, isLoading, error, refetch } = api.user.profile.useQuery(
		undefined,
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			retry: 2,
		},
	);

	useEffect(() => {
		if (!isLoading && data) {
			setProfile(data);

			if (data.currentSword !== null) {
				setCurrentSword(data.swords.find((s) => s.id === data.currentSword)!);
			}
		}
	}, [data, isLoading]);

	const handleRefetch = async () => {
		const result = await refetch();
		return result.data;
	};

	return (
		<ProfileContext.Provider
			value={{
				profile,
				profileLoading: isLoading,
				error,
				refetchProfile: handleRefetch,
				currentSword,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
}
