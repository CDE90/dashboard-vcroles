import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <main>{children}</main>
                </body>
            </html>
        </ClerkProvider>
    );
}
