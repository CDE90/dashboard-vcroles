import type { Guild } from "src/server/server-utils";
import {
    checkUserPermissions,
    getUserToken,
    getUserAccount,
    fetchUserGuilds,
    fetchBotGuilds,
} from "src/server/server-utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SeoHeaders } from "@/components/SeoHeaders";
import { ClientDashboardLayout } from "./_components/_layout";
import { Suspense } from "react";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
        auth().redirectToSignIn();
        return null;
    }

    const accessToken = await getUserToken(userId);
    const account = await getUserAccount(userId);

    if (!account) {
        auth().redirectToSignIn();
        return null;
    }

    const userAllowed = checkUserPermissions(
        accessToken,
        account?.externalId,
        params.id,
    );

    if (!userAllowed) {
        if (typeof window !== "undefined") {
            return redirect("/dashboard");
        }
        return (
            <SeoHeaders
                title="VC Roles | Dashboard"
                description="View the dashboard for your server"
                url="https://www.vcroles.com/dashboard"
            />
        );
    }

    // get the users guilds
    const userGuilds = await fetchUserGuilds(accessToken, account.externalId);

    const guilds = userGuilds.filter(
        (guild) => guild.owner === true || guild.permissions & (1 << 3),
    );

    const botGuilds = await fetchBotGuilds();

    const guildsWithBot: Guild[] = guilds.map((guild) => {
        return {
            ...guild,
            includesBot: botGuilds.some((botGuild) => botGuild.id === guild.id),
        };
    });

    const filteredGuilds = guildsWithBot.filter((g) => {
        return g.includesBot;
    });

    return (
        <ClientDashboardLayout
            guilds={filteredGuilds}
            guildId={params.id}
            user={{
                email: user.primaryEmailAddress?.emailAddress ?? "",
                username: user.username ?? "",
            }}
        >
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ClientDashboardLayout>
    );
}
