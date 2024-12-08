import { ProfileContext } from "@/contexts/Profile";
import { useContext } from "react";

export function useProfile() {
	const context = useContext(ProfileContext);

	if (!context) {
		throw new Error("useProfile must be used within a ProfileProvider");
	}

	return context;
}
