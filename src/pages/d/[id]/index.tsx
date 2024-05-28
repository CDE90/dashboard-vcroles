import { Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import { type ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
import DashboardLayout from "../../../layouts/Dashboard";
import { trpc } from "../../../utils/trpc";
import { classNames } from "../../../utils/utils";
import ChannelDropdown from "../../../components/ChannelDropdown";
import type { Channel, Role } from "src/server/server-utils";
import RoleDropdown from "../../../components/RoleDropdown";
import SavedNotificationContainer from "../../../components/SavedNotification";
import Link from "next/link";

type Query = {
    id: string;
};

const DashboardPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query as Query;

    const { data: channels } = trpc.discord.getGuildChannels.useQuery({
        guild: id,
    });
    const { data: roles } = trpc.discord.getGuildRoles.useQuery({ guild: id });
    const { data: guild } = trpc.discord.getGuildData.useQuery({ guild: id });

    // Audit logging state
    const [loggingToggle, setLoggingToggle] = useState(
        guild?.logging ? true : false,
    );
    const currentChannel =
        channels?.find((channel) => channel.id === guild?.logging) ?? null;
    const [loggingChannel, setLoggingChannel] = useState<Channel | null>(
        currentChannel,
    );

    // TTS state
    const [ttsToggle, setTtsToggle] = useState(
        guild?.ttsEnabled ? true : false,
    );
    const currentRole =
        roles?.find((role) => role.id === guild?.ttsRole) ?? null;
    const [ttsRole, setTtsRole] = useState<Role | null>(currentRole);
    const [ttsLeave, setTtsLeave] = useState(guild?.ttsLeave ? true : false);

    const [showSavedNotification, setShowSavedNotification] = useState(false);

    const utils = trpc.useContext();
    const mutation = trpc.discord.updateGuildData.useMutation({
        onMutate: () => {
            utils.discord.getGuildData.cancel({ guild: id });
            const optimisticUpdate = utils.discord.getGuildData.getData({
                guild: id,
            });
            if (optimisticUpdate) {
                utils.discord.getGuildData.setData(
                    { guild: id },
                    optimisticUpdate,
                );
            }
        },
        onSettled: () => {
            utils.discord.getGuildData.invalidate({ guild: id });
        },
    });

    const textChannels = channels?.filter((channel) => channel.type === 0);

    // every time the ID changes, update the state
    useEffect(() => {
        setLoggingToggle(guild?.logging ? true : false);
        setLoggingChannel(currentChannel);
        setTtsToggle(guild?.ttsEnabled ? true : false);
        setTtsRole(currentRole);
        setTtsLeave(guild?.ttsLeave ? true : false);
    }, [id, guild, currentChannel, currentRole]);

    return (
        <>
            <form
                className="mt-6 space-y-8 divide-y divide-gray-200"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (
                        loggingChannel?.id === guild?.logging &&
                        loggingToggle === (guild?.logging ? true : false) &&
                        ttsToggle === guild?.ttsEnabled &&
                        (ttsRole?.id ?? null) === guild?.ttsRole &&
                        ttsLeave === guild?.ttsLeave
                    ) {
                        return;
                    } else if (loggingToggle && !loggingChannel) {
                        return;
                    }
                    mutation.mutate({
                        guild: id,
                        data: {
                            loggingChannel: loggingChannel?.id,
                            loggingEnabled: loggingToggle,
                            ttsEnabled: ttsToggle,
                            ttsRole: ttsRole?.id,
                            ttsLeave,
                        },
                    });
                    setShowSavedNotification(true);
                }}
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Audit Logging
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Edit the audit logging settings for this
                                    server.
                                </p>
                            </div>
                            <Link
                                href="/docs/features/audit-logs"
                                className="mt-2 text-base leading-7 text-indigo-600 sm:ml-auto sm:mt-0"
                            >
                                Learn More &rarr;
                            </Link>
                        </div>

                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="audit-toggle"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Enable Audit Logging
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <Switch
                                        checked={loggingToggle}
                                        onChange={setLoggingToggle}
                                        className={classNames(
                                            loggingToggle
                                                ? "bg-indigo-600"
                                                : "bg-gray-200",
                                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                        )}
                                    >
                                        <span className="sr-only">
                                            Use setting
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                loggingToggle
                                                    ? "translate-x-5"
                                                    : "translate-x-0",
                                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            )}
                                        />
                                    </Switch>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="audit-channel"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Audit Logging Channel
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <ChannelDropdown
                                        channels={textChannels ?? []}
                                        disabled={!loggingToggle}
                                        selectedChannel={loggingChannel}
                                        setSelectedChannel={setLoggingChannel}
                                    />
                                    {loggingToggle && !loggingChannel && (
                                        <p className="mt-2 text-sm text-red-600">
                                            Please select a channel.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    TTS Settings
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Edit the TTS settings for this server.
                                </p>
                            </div>
                            <Link
                                href="/docs/features/tts"
                                className="mt-2 text-base leading-7 text-indigo-600 sm:ml-auto sm:mt-0"
                            >
                                Learn More &rarr;
                            </Link>
                        </div>

                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="tts-toggle"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Enable TTS
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <Switch
                                        checked={ttsToggle}
                                        onChange={setTtsToggle}
                                        className={classNames(
                                            ttsToggle
                                                ? "bg-indigo-600"
                                                : "bg-gray-200",
                                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                        )}
                                    >
                                        <span className="sr-only">
                                            Use setting
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                ttsToggle
                                                    ? "translate-x-5"
                                                    : "translate-x-0",
                                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            )}
                                        />
                                    </Switch>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="tts-role"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    TTS Role (optional)
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <RoleDropdown
                                        roles={roles ?? []}
                                        disabled={!ttsToggle}
                                        selectedRole={ttsRole}
                                        setSelectedRole={setTtsRole}
                                    />
                                </div>
                            </div>

                            {/* TTS Leave Toggle */}

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                <label
                                    htmlFor="tts-leave-toggle"
                                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                                >
                                    Enable TTS Leave
                                </label>
                                <div className="mt-1 sm:col-span-2 sm:mt-0">
                                    <Switch
                                        checked={ttsLeave}
                                        onChange={setTtsLeave}
                                        className={classNames(
                                            ttsLeave
                                                ? "bg-indigo-600"
                                                : "bg-gray-200",
                                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                        )}
                                    >
                                        <span className="sr-only">
                                            Use setting
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                ttsLeave
                                                    ? "translate-x-5"
                                                    : "translate-x-0",
                                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                            )}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                                setLoggingToggle(guild?.logging ? true : false);
                                setLoggingChannel(
                                    channels?.find(
                                        (c) => c.id === guild?.logging,
                                    ) ?? null,
                                );
                                setTtsToggle(guild?.ttsEnabled ? true : false);
                                setTtsRole(
                                    roles?.find(
                                        (r) => r.id === guild?.ttsRole,
                                    ) ?? null,
                                );
                                setTtsLeave(guild?.ttsLeave ? true : false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
            <SavedNotificationContainer
                show={showSavedNotification}
                setShow={setShowSavedNotification}
            />
        </>
    );
};

DashboardPage.getLayout = (page: ReactElement) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardPage;
