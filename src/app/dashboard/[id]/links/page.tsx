import { redirect } from "next/navigation";
import {
    getGuildChannels,
    getGuildData,
    getGuildLinks,
    getGuildRoles,
} from "src/server/server-utils";
import { ClientLinksDashboardPage } from "./_components/links-page";

export default async function LinksPage({
    params,
}: {
    params: { id: string };
}) {
    const channels = await getGuildChannels(params.id);
    const roles = await getGuildRoles(params.id);
    const guild = await getGuildData(params.id);
    const links = await getGuildLinks(params.id);

    if (!guild) {
        return redirect("/dashboard");
    }

    return (
        <ClientLinksDashboardPage
            guild={guild}
            channels={channels}
            roles={roles}
            links={links}
        />
    );
}
