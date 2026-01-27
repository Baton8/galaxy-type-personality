type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "btn-primary",
	secondary: "btn-secondary",
	ghost: "btn-ghost",
};

const getButtonClassName = (
	variant: ButtonVariant,
	className?: string,
): string => {
	const base = variantClasses[variant];
	return className ? `${base} ${className}` : base;
};

export function Button({
	variant = "primary",
	className,
	...props
}: ButtonProps) {
	return (
		<button {...props} className={getButtonClassName(variant, className)} />
	);
}
