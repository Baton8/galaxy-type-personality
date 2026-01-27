import { useEffect } from "react";

export function TypesettingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		if (typeof window === "undefined") return;

		const initTypesetter = async () => {
			const { default: Typesetter } = await import("palt-typesetting");
			const typesetter = new Typesetter();
			typesetter.renderToSelector(".typeset");
		};

		initTypesetter();
	}, []);

	return <>{children}</>;
}
