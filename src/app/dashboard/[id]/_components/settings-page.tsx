"use client";

import SavedNotificationContainer from "@/components/SavedNotification";
import { useState } from "react";
import type { Guild } from "~/client";
import type { Channel, Role } from "src/server/server-utils";
import { AuditLoggingSettings } from "./audit-logging";
import { TTSSettings } from "./tts-settings";
import { updateGuildData } from "src/app/actions";

export function ClientDashboardPage({
    guild,
    channels,
    roles,
}: {
    guild: Guild;
    channels: Channel[];
    roles: Role[];
}) {
    // Audit logging state
    const [loggingToggle, setLoggingToggle] = useState(
        guild.logging ? true : false,
    );
    const currentChannel =
        channels.find((channel) => channel.id === guild.logging) ?? null;
    const [loggingChannel, setLoggingChannel] = useState<Channel | null>(
        currentChannel,
    );

    // TTS state
    const [ttsToggle, setTtsToggle] = useState(guild.ttsEnabled ? true : false);
    const currentRole = roles.find((role) => role.id === guild.ttsRole) ?? null;
    const [ttsRole, setTtsRole] = useState<Role | null>(currentRole);
    const [ttsLeave, setTtsLeave] = useState(guild.ttsLeave ? true : false);

    const [showSavedNotification, setShowSavedNotification] = useState(false);

    return (
        <>
            <form
                className="mt-6 space-y-8 divide-y divide-gray-200"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <AuditLoggingSettings
                        channels={channels}
                        loggingToggle={{
                            enabled: loggingToggle,
                            setEnabled: setLoggingToggle,
                        }}
                        loggingChannel={{
                            channel: loggingChannel,
                            setChannel: setLoggingChannel,
                        }}
                    />

                    <TTSSettings
                        roles={roles}
                        ttsToggle={{
                            enabled: ttsToggle,
                            setEnabled: setTtsToggle,
                        }}
                        ttsRole={{
                            role: ttsRole,
                            setRole: setTtsRole,
                        }}
                        ttsLeave={{
                            enabled: ttsLeave,
                            setEnabled: setTtsLeave,
                        }}
                    />
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => {
                                setLoggingToggle(guild.logging ? true : false);
                                setLoggingChannel(
                                    channels.find(
                                        (c) => c.id === guild.logging,
                                    ) ?? null,
                                );
                                setTtsToggle(guild.ttsEnabled ? true : false);
                                setTtsRole(
                                    roles.find((r) => r.id === guild.ttsRole) ??
                                        null,
                                );
                                setTtsLeave(guild.ttsLeave ? true : false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={async () => {
                                await updateGuildData(guild, {
                                    loggingToggle: loggingToggle,
                                    loggingChannel: loggingChannel,
                                    ttsToggle: ttsToggle,
                                    ttsRole: ttsRole,
                                    ttsLeave: ttsLeave,
                                });

                                setShowSavedNotification(true);
                            }}
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
}
