import type { Metadata } from 'next';
import './globals.css';
import './console.css';
import './park-world.css';
import './title-screen.css';
import './roster.css';
import './turbo.css';
import './modes.css';
import './player-select.css';
import './park-atlas.css';
export const metadata: Metadata = {title:'Super Mack Fighters Turbo',description:'Das Pixel-Arcade-Turnier: lokale Duelle und eine Tour durch den Europa-Park.'};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>){return <html lang="de"><body>{children}</body></html>}


