import {
    getGuildChannels,
    getGuildData,
    getGuildRoles,
} from "src/server/server-utils";
import { redirect } from "next/navigation";
import { ClientDashboardPage } from "./_components/settings-page";

export default async function DashboardPage({
    params,
}: {
    params: { id: string };
}) {
    const channels = await getGuildChannels(params.id);
    const roles = await getGuildRoles(params.id);
    const guild = await getGuildData(params.id);

    if (!guild) {
        return redirect("/dashboard");
    }

    return (
        <ClientDashboardPage guild={guild} channels={channels} roles={roles} />
    );
}
