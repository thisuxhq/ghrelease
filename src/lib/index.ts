// place files you want to import through the `$lib` alias in this folder.

// merge class names with conditional rendering
export function clsx(...args: any[]): string {
	return args.filter(Boolean).join(' ');
}
