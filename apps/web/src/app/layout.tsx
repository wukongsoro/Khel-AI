import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./global.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "Khel AI - Play & Create Games Instantly",
	description: "Describe your game. Watch it come to life. Share it with the world.",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link
					rel="stylesheet"
					href="/fontawesome/releases/v6.3.0/css/pro.min.css?token=2c15cc0cc7"
				/>
			</head>
			<body>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
