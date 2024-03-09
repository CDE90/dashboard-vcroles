import type { NextPage } from "next";
import { useSession, signIn } from "next-auth/react";

import { trpc } from "../../utils/trpc";
import NavBar from "../../components/NavBar";
import Loading from "../../components/Loading";
import { iconHashToUrl } from "../../utils/utils";
import Link from "next/link";
import { BottomBackground, TopBackground } from "src/components/Background";
import { SeoHeaders } from "src/components/SeoHeaders";
import Image from "next/image";

const Title: React.FC = () => {
    return (
        <SeoHeaders
            title="VC Roles | Dashboard"
            description="Select a server to view its dashboard."
            url="https://vcroles.com/dashboard"
        />
    );
};

const Dashboard: NextPage = () => {
    const { data: session, status } = useSession();
    const { data: guilds, isLoading: loading } =
        trpc.discord.getGuilds.useQuery();

    if (!session && status === "unauthenticated") {
        return (
            <>
                <Title />
                <div className="isolate bg-white">
                    <TopBackground />
                    <NavBar />
                    <div className="relative px-6 lg:px-8">
                        <BottomBackground />
                        <div className="mx-auto max-w-3xl pt-5 pb-8 sm:pt-12 sm:pb-10">
                            <div>
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                                        Dashboard
                                    </h1>
                                    <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                                        Please sign in to view your dashboard.
                                    </p>
                                    <div className="mt-6 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => signIn("discord")}
                                            className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                                        >
                                            Sign in with Discord
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Title />
            <div className="isolate bg-white">
                <TopBackground />
                <NavBar />
                <div className="relative px-6 lg:px-8">
                    <BottomBackground />
                    <div className="mx-auto max-w-3xl pt-5 pb-8 sm:pt-12 sm:pb-10">
                        <div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                                    Dashboard
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                                    Select a server to view its dashboard.
                                </p>
                            </div>
                        </div>
                        {loading ? (
                            <Loading />
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {(guilds ?? []).map((guild) => (
                                    <div
                                        key={guild.id}
                                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
                                    >
                                        <div className="flex flex-1 flex-col p-8">
                                            <Image
                                                className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                                                src={
                                                    guild.icon
                                                        ? iconHashToUrl(
                                                              guild.icon,
                                                              guild.id,
                                                          )
                                                        : "https://cdn.discordapp.com/embed/avatars/0.png"
                                                }
                                                alt=""
                                                width={128}
                                                height={128}
                                            />
                                            <h3 className="mt-6 overflow-clip text-sm font-medium text-gray-900">
                                                {guild.name}
                                            </h3>
                                            <dl className="mt-1 flex flex-grow flex-col justify-between">
                                                <dt className="sr-only">
                                                    Role
                                                </dt>
                                                <dd className="text-sm text-gray-500">
                                                    {guild.owner
                                                        ? "Owner"
                                                        : "Admin"}
                                                </dd>
                                            </dl>
                                        </div>
                                        <div className="flex flex-1 flex-col p-8">
                                            {guild.includesBot ? (
                                                <Link
                                                    href={`/dashboard/${guild.id}`}
                                                    className="block w-full rounded-md border border-transparent bg-gray-900 py-2 px-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                                                >
                                                    View Dashboard
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/invite?guild=${guild.id}`}
                                                    className="block w-full rounded-md border border-transparent bg-gray-900 py-2 px-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                                                >
                                                    Add Bot
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="col-span-full flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow">
                                    <div className="flex flex-1 flex-col p-8">
                                        <h3 className="mt-6 overflow-clip text-sm font-medium text-gray-900">
                                            {guilds?.length === 0
                                                ? "No servers found"
                                                : "Add another server"}
                                        </h3>
                                        <dl className="mt-1 flex flex-grow flex-col justify-between">
                                            <dt className="sr-only">Info</dt>
                                            <dd className="text-sm text-gray-500">
                                                {guilds?.length === 0
                                                    ? "You need to add the bot to a server or have administrator permissions to view its dashboard."
                                                    : "Add the bot to another server to view its dashboard."}
                                            </dd>
                                        </dl>
                                    </div>
                                    <div className="flex flex-1 flex-col p-8">
                                        <Link
                                            href="/invite"
                                            className="block w-full rounded-md border border-transparent bg-gray-900 py-2 px-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
                                        >
                                            Add Bot
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
