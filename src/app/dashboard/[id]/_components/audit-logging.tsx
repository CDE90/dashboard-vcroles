"use client";

import { Switch } from "@headlessui/react";
import { classNames } from "src/utils/utils";
import ChannelDropdown from "@/components/ChannelDropdown";
import Link from "next/link";
import type { Channel } from "src/server/server-utils";

export function AuditLoggingSettings({
    channels,
    loggingToggle,
    loggingChannel,
}: {
    channels: Channel[];
    loggingToggle: {
        enabled: boolean;
        setEnabled: (enabled: boolean) => void;
    };
    loggingChannel: {
        channel: Channel | null;
        setChannel: (channel: Channel | null) => void;
    };
}) {
    const textChannels = channels.filter((channel) => channel.type === 0);

    return (
        <div className="space-y-6 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Audit Logging
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Edit the audit logging settings for this server.
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
                            checked={loggingToggle.enabled}
                            onChange={loggingToggle.setEnabled}
                            className={classNames(
                                loggingToggle.enabled
                                    ? "bg-indigo-600"
                                    : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                            )}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    loggingToggle.enabled
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
                            disabled={!loggingToggle.enabled}
                            selectedChannel={loggingChannel.channel}
                            setSelectedChannel={loggingChannel.setChannel}
                        />
                        {loggingToggle.enabled && !loggingChannel.channel && (
                            <p className="mt-2 text-sm text-red-600">
                                Please select a channel.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
