"use client";

import { Switch } from "@headlessui/react";
import { classNames } from "src/utils/utils";
import Link from "next/link";
import type { Role } from "src/server/server-utils";
import RoleDropdown from "@/components/RoleDropdown";

export function TTSSettings({
    roles,
    ttsToggle,
    ttsRole,
    ttsLeave,
}: {
    roles: Role[];
    ttsToggle: {
        enabled: boolean;
        setEnabled: (enabled: boolean) => void;
    };
    ttsRole: {
        role: Role | null;
        setRole: (role: Role | null) => void;
    };
    ttsLeave: {
        enabled: boolean;
        setEnabled: (enabled: boolean) => void;
    };
}) {
    return (
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
                            checked={ttsToggle.enabled}
                            onChange={ttsToggle.setEnabled}
                            className={classNames(
                                ttsToggle.enabled
                                    ? "bg-indigo-600"
                                    : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                            )}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    ttsToggle.enabled
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
                            roles={roles}
                            disabled={!ttsToggle.enabled}
                            selectedRole={ttsRole.role}
                            setSelectedRole={ttsRole.setRole}
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
                            checked={ttsLeave.enabled}
                            onChange={ttsLeave.setEnabled}
                            className={classNames(
                                ttsLeave.enabled
                                    ? "bg-indigo-600"
                                    : "bg-gray-200",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                            )}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    ttsLeave.enabled
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
    );
}
