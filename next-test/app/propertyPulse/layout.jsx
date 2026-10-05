export const metadata = {
	title: "Property Pulse",
	description: "Property Pulse Layout - for every page under property pulse",
};

export default function PropertyPulseLayout({children}) {
	return <div className="container mx-auto wl-full">
		<div className="top-0">App Header</div>
		<main className="w-full h-full">{children}</main>
		<div className="bottom-0 absolute">App Footer</div>
	</div>;
}