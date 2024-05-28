import { LinkType } from "~/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Guild } from "src/server/server-utils";
import {
    getUserToken,
    getUserAccount,
    fetchUserGuilds,
    fetchBotGuilds,
    checkUserPermissions,
    getGuildChannels,
    getGuildRoles,
} from "src/server/server-utils";

const linkTypeSchema = z.enum([
    LinkType.ALL,
    LinkType.CATEGORY,
    LinkType.STAGE,
    LinkType.REGULAR,
    LinkType.PERMANENT,
]);

const linkSchema = z.object({
    id: z.string(),
    type: linkTypeSchema,
    guildId: z.string(),
    linkedRoles: z.array(z.string()),
    reverseLinkedRoles: z.array(z.string()),
    suffix: z.string().nullable(),
    speakerRoles: z.array(z.string()),
    excludeChannels: z.array(z.string()),
});

export const discordRouter = router({
    getGuilds: protectedProcedure.query(async ({ ctx }) => {
        const accessToken = await getUserToken(ctx.auth.userId);
        if (!accessToken) {
            return [];
        }

        const account = await getUserAccount(ctx.auth.userId);
        if (!account) {
            return [];
        }

        const userGuilds = await fetchUserGuilds(
            accessToken,
            account.externalId,
        );

        const guilds = userGuilds.filter(
            (guild) => guild.owner === true || guild.permissions & (1 << 3),
        );

        const botGuilds = await fetchBotGuilds();

        const guildsWithBot: Guild[] = guilds.map((guild) => {
            return {
                ...guild,
                includesBot: botGuilds.some(
                    (botGuild) => botGuild.id === guild.id,
                ),
            };
        });

        return guildsWithBot;
    }),
    checkUserPermissions: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                return false;
            }

            if (!input.guild) {
                return true;
            }

            return await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );
        }),
    getGuildChannels: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            if (!input.guild) {
                return [];
            }

            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!account) {
                return [];
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                return [];
            }

            return await getGuildChannels(input.guild);
        }),
    getGuildRoles: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            if (!input.guild) {
                return [];
            }

            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!account) {
                return [];
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                return [];
            }

            return await getGuildRoles(input.guild);
        }),
    getGuildData: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            if (!input.guild) {
                return null;
            }

            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                return null;
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                return null;
            }

            const guild = await ctx.prisma.guild.findUnique({
                where: {
                    id: input.guild,
                },
            });

            if (!guild) {
                return await ctx.prisma.guild.create({
                    data: {
                        id: input.guild,
                    },
                });
            }

            return guild;
        }),
    getLinks: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            if (!input.guild) {
                return [];
            }

            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                return [];
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                return [];
            }

            const links = await ctx.prisma.link.findMany({
                where: {
                    guildId: input.guild,
                },
            });

            return links;
        }),
    getGenerators: protectedProcedure
        .input(z.object({ guild: z.union([z.string(), z.undefined()]) }))
        .query(async ({ ctx, input }) => {
            if (!input.guild) {
                return [];
            }

            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                return [];
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                return [];
            }

            const generators = await ctx.prisma.voiceGenerator.findMany({
                where: {
                    guildId: input.guild,
                },
            });

            return generators;
        }),
    updateGuildData: protectedProcedure
        .input(
            z.object({
                guild: z.string(),
                data: z.object({
                    loggingChannel: z.string().optional(),
                    loggingEnabled: z.boolean(),
                    ttsEnabled: z.boolean(),
                    ttsRole: z.string().optional(),
                    ttsLeave: z.boolean(),
                }),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const logging = input.data.loggingEnabled
                ? input.data.loggingChannel
                : null;

            const guild = await ctx.prisma.guild.update({
                where: {
                    id: input.guild,
                },
                data: {
                    logging,
                    ttsEnabled: input.data.ttsEnabled,
                    ttsRole: input.data.ttsRole ?? null,
                    ttsLeave: input.data.ttsLeave,
                },
            });

            return guild;
        }),

    deleteLink: protectedProcedure
        .input(z.object({ dbId: z.string(), guild: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guild,
            );

            if (!hasPermissions) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const prevLink = await ctx.prisma.link.findUnique({
                where: {
                    dbId: input.dbId,
                },
            });

            if (!prevLink) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Link not found",
                });
            } else if (prevLink.guildId !== input.guild) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const link = await ctx.prisma.link.delete({
                where: {
                    dbId: input.dbId,
                },
            });

            return link;
        }),
    createLink: protectedProcedure
        .input(
            z.object({
                guildId: z.string(),
                id: z.string(),
                type: linkTypeSchema,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guildId,
            );

            if (!hasPermissions) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const link = await ctx.prisma.link.create({
                data: {
                    id: input.id,
                    guildId: input.guildId,
                    type: input.type,
                },
            });

            return link;
        }),
    updateLink: protectedProcedure
        .input(
            linkSchema.extend({
                dbId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const accessToken = await getUserToken(ctx.auth.userId);
            const account = await getUserAccount(ctx.auth.userId);

            if (!accessToken || !account) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const hasPermissions = await checkUserPermissions(
                accessToken,
                account.externalId,
                input.guildId,
            );

            if (!hasPermissions) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const prevLink = await ctx.prisma.link.findUnique({
                where: {
                    dbId: input.dbId,
                },
            });

            if (!prevLink) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Link not found",
                });
            } else if (prevLink.guildId !== input.guildId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to perform this action",
                });
            }

            const link = await ctx.prisma.link.update({
                where: {
                    dbId: input.dbId,
                },
                data: {
                    id: input.id,
                    guildId: input.guildId,
                    type: input.type,
                    linkedRoles: input.linkedRoles,
                    reverseLinkedRoles: input.reverseLinkedRoles,
                    suffix: input.suffix,
                    speakerRoles: input.speakerRoles,
                    excludeChannels: input.excludeChannels,
                },
            });

            return link;
        }),
});
