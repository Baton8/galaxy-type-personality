import { ClientOnly } from "@tanstack/react-router";
import { useEffect } from "react";

function TypesettingInitializer() {
	useEffect(() => {
		const initTypesetter = async () => {
			const { default: Typesetter } = await import("palt-typesetting");
			const typesetter = new Typesetter();
			typesetter.renderToSelector(".typeset");
		};

		initTypesetter();
	}, []);

	return null;
}

export function TypesettingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<ClientOnly fallback={null}>
				<TypesettingInitializer />
			</ClientOnly>
			{children}
		</>
	);
}
