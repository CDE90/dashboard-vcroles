import axios from "axios";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma, redis } from "src/server/db/client";
import { env } from "src/env/server.mjs";

export const BASE_URL = "https://discord.com/api/v10";

export const CACHE_DURATION = 60 * 5; // 5 minutes

export type GuildResponse = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: number;
};

export type Guild = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: number;
    includesBot: boolean;
};

export type Channel = {
    id: string;
    name: string;
    type: ChannelType;
    position: number;
};

export const ChannelType = {
    GUILD_TEXT: 0,
    GUILD_VOICE: 2,
    GUILD_CATEGORY: 4,
    GUILD_STAGE_VOICE: 13,
} as const;

export type ChannelType = (typeof ChannelType)[keyof typeof ChannelType];

export type Role = {
    id: string;
    name: string;
    color: number;
    position: number;
};

export const fetchBotGuilds = async () => {
    return await prisma.guild.findMany();
};

export const fetchUserGuilds = async (
    access_token: string | null,
    discordID: string,
) => {
    if (!access_token) {
        return [];
    }

    const URL = `${BASE_URL}/users/@me/guilds`;

    // check the redis cache
    const cacheKey = `discord:userGuilds:${discordID}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
        return cached as GuildResponse[];
    }

    const response = await axios.get<GuildResponse[]>(URL, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status !== 200) {
        return [];
    }

    const guilds = response.data.map((guild) => {
        return {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            owner: guild.owner,
            permissions: guild.permissions,
        };
    });

    // cache the response
    await redis.set(cacheKey, guilds, {
        ex: CACHE_DURATION,
    });

    return response.data;
};

export const fetchMutualGuilds = async (
    access_token: string | null,
    discordID: string,
) => {
    const userGuilds = await fetchUserGuilds(access_token, discordID);

    const botGuilds = await fetchBotGuilds();

    const mutualGuilds = userGuilds.filter((guild) =>
        botGuilds.some((botGuild) => botGuild.id === guild.id),
    );

    return mutualGuilds;
};

export const checkUserPermissions = async (
    accessToken: string | null,
    accountId: string,
    guildId: string,
) => {
    if (accountId === env.DISCORD_DEV_USER) {
        return true;
    }

    if (!accessToken) {
        return false;
    }

    const mutualGuilds = await fetchMutualGuilds(accessToken, accountId);

    return mutualGuilds.some(
        (guild) =>
            guild.id === guildId &&
            (guild.owner === true || guild.permissions & (1 << 3)),
    );
};

export async function getUserToken(userId: string) {
    const clerkTokenResponse = await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_discord",
    );
    // @ts-expect-error - this works :)
    const accessToken = clerkTokenResponse[0]?.token;

    if (!accessToken) {
        return null;
    }

    return accessToken;
}

export async function getUserAccount(userId: string) {
    const user = await clerkClient.users.getUser(userId);
    const discordAccounts = user.externalAccounts.filter(
        (account) => account.provider === "oauth_discord",
    );
    const account = discordAccounts[0];

    if (!account) {
        return null;
    }

    return account;
}

export async function getGuildChannels(guildId: string) {
    const URL = `${BASE_URL}/guilds/${guildId}/channels`;

    // check the redis cache for the channels
    const cacheKey = `discord:channels:${guildId}`;
    const cachedChannels = await redis.get(cacheKey);

    if (cachedChannels) {
        return cachedChannels as Channel[];
    }

    const response = await axios.get<Channel[]>(URL, {
        headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
    });

    if (response.status !== 200) {
        return [];
    }

    const channels = response.data
        .map((channel) => {
            return {
                id: channel.id,
                name: channel.name,
                type: channel.type,
                position: channel.position,
            };
        })
        .filter(
            (channel) =>
                channel.type === 0 ||
                channel.type === 2 ||
                channel.type === 4 ||
                channel.type === 13,
        );

    await redis.set(cacheKey, JSON.stringify(channels), {
        ex: CACHE_DURATION,
    });

    return channels;
}

export async function getGuildRoles(guildId: string) {
    const URL = `${BASE_URL}/guilds/${guildId}/roles`;

    // check the redis cache for the roles
    const cacheKey = `discord:roles:${guildId}`;
    const cachedRoles = await redis.get(cacheKey);

    if (cachedRoles) {
        return cachedRoles as Role[];
    }

    const response = await axios.get<Role[]>(URL, {
        headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
    });

    if (response.status !== 200) {
        return [];
    }

    const roles: Role[] = response.data.map((role) => {
        return {
            id: role.id,
            name: role.name,
            color: role.color,
            position: role.position,
        };
    });

    await redis.set(cacheKey, JSON.stringify(roles), {
        ex: CACHE_DURATION,
    });

    return roles;
}

export async function getGuildData(guildId: string) {
    const guild = await prisma.guild.findUnique({
        where: {
            id: guildId,
        },
    });

    return guild;
}

export async function getGuildLinks(guildId: string) {
    const links = await prisma.link.findMany({
        where: { guildId },
    });

    return links;
}
