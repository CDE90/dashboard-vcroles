"use server";

import type { Channel, Role } from "src/server/server-utils";
import {
    checkUserPermissions,
    getUserAccount,
    getUserToken,
} from "src/server/server-utils";
import type { Guild, Link, LinkType } from "~/client";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "src/server/db/client";
import { revalidatePath } from "next/cache";

const UNAUTHORIZED = "You are not authorized to perform this action";

export async function updateGuildData(
    guild: Guild,
    options: {
        loggingToggle: boolean;
        loggingChannel: Channel | null;
        ttsToggle: boolean;
        ttsRole: Role | null;
        ttsLeave: boolean;
    },
) {
    // Check the users permissions
    const { userId } = auth();

    if (!userId) {
        return UNAUTHORIZED;
    }

    const accessToken = await getUserToken(userId);
    const account = await getUserAccount(userId);

    if (!account || !accessToken) {
        return UNAUTHORIZED;
    }

    const hasPermissions = await checkUserPermissions(
        accessToken,
        account?.externalId,
        guild.id,
    );

    if (!hasPermissions) {
        return UNAUTHORIZED;
    }

    // Now check if the guild data has actually changed
    if (
        options.loggingToggle === (guild.logging ? true : false) &&
        ((options.loggingChannel === null && guild.logging === null) ||
            options.loggingChannel?.id === guild.logging) &&
        options.ttsToggle === guild.ttsEnabled &&
        ((options.ttsRole === null && guild.ttsRole === null) ||
            options.ttsRole?.id === guild.ttsRole) &&
        options.ttsLeave === guild.ttsLeave
    ) {
        return;
    } else if (options.loggingToggle && !options.loggingChannel) {
        return;
    }

    // Now update the guild data
    const logging = options.loggingToggle
        ? options.loggingChannel && options.loggingChannel.id
        : null;

    const updatedGuild = await prisma.guild.update({
        where: {
            id: guild.id,
        },
        data: {
            logging,
            ttsEnabled: options.ttsToggle,
            ttsRole: options.ttsRole?.id ?? null,
            ttsLeave: options.ttsLeave,
        },
    });

    revalidatePath(`/dashboard/${guild.id}`);

    return updatedGuild;
}

export async function deleteLink(
    guild: Guild,
    options: {
        linkId: string;
    },
) {
    // Check the users permissions
    const { userId } = auth();

    if (!userId) {
        return UNAUTHORIZED;
    }

    const accessToken = await getUserToken(userId);
    const account = await getUserAccount(userId);

    if (!account || !accessToken) {
        return UNAUTHORIZED;
    }

    const hasPermissions = await checkUserPermissions(
        accessToken,
        account?.externalId,
        guild.id,
    );

    if (!hasPermissions) {
        return UNAUTHORIZED;
    }

    // Delete the link
    const prevLink = await prisma.link.findUnique({
        where: {
            dbId: options.linkId,
        },
    });

    if (!prevLink) {
        return UNAUTHORIZED;
    } else if (prevLink.guildId !== guild.id) {
        return UNAUTHORIZED;
    }

    const link = await prisma.link.delete({
        where: {
            dbId: options.linkId,
        },
    });

    revalidatePath(`/dashboard/${guild.id}/links`);

    return link;
}

export async function updateLink(
    guild: Guild,
    options: {
        link: Link;
    },
) {
    // Check the users permissions
    const { userId } = auth();

    if (!userId) {
        return UNAUTHORIZED;
    }

    const accessToken = await getUserToken(userId);
    const account = await getUserAccount(userId);

    if (!account || !accessToken) {
        return UNAUTHORIZED;
    }

    const hasPermissions = await checkUserPermissions(
        accessToken,
        account?.externalId,
        guild.id,
    );

    if (!hasPermissions) {
        return UNAUTHORIZED;
    }

    // Update the link
    const prevLink = await prisma.link.findUnique({
        where: {
            dbId: options.link.dbId,
        },
    });

    if (!prevLink) {
        return UNAUTHORIZED;
    } else if (prevLink.guildId !== guild.id) {
        return UNAUTHORIZED;
    }

    const link = await prisma.link.update({
        where: {
            dbId: options.link.dbId,
        },
        data: {
            ...options.link,
        },
    });

    revalidatePath(`/dashboard/${guild.id}/links`);

    return link;
}

export async function createLink(
    guild: Guild,
    options: {
        linkType?: LinkType;
        linkId?: string;
    },
) {
    // Check the users permissions
    const { userId } = auth();

    if (!userId) {
        return UNAUTHORIZED;
    }

    const accessToken = await getUserToken(userId);
    const account = await getUserAccount(userId);

    if (!account || !accessToken) {
        return UNAUTHORIZED;
    }

    const hasPermissions = await checkUserPermissions(
        accessToken,
        account?.externalId,
        guild.id,
    );

    if (!hasPermissions) {
        return UNAUTHORIZED;
    }

    if (!options.linkType || !options.linkId) {
        return UNAUTHORIZED;
    }

    const link = await prisma.link.create({
        data: {
            id: options.linkId,
            guildId: guild.id,
            type: options.linkType,
        },
    });

    revalidatePath(`/dashboard/${guild.id}/links`);

    return link;
}
