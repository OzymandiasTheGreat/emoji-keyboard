import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();
export const navigate = (route: string, params?: Record<string, any>) => {
	if (navigationRef.isReady()) {
		navigationRef.navigate(route, params);
	}
};
