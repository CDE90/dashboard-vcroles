"use client";

import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    PlusIcon,
} from "@heroicons/react/20/solid";
import type { Guild } from "src/server/server-utils";

import { iconHashToUrl, classNames } from "../utils/utils";
import Link from "next/link";
import { SmallLoading } from "./Loading";

const GuildDropdown: React.FC<{
    guilds: Guild[];
    selectedID: string;
    subPage?: string;
}> = ({ guilds, selectedID, subPage }) => {
    const [selectedGuild, setSelectedGuild] = useState(
        guilds.find((g) => g.id === selectedID),
    );

    useEffect(() => {
        setSelectedGuild(guilds.find((g) => g.id === selectedID));
    }, [selectedID, guilds]);

    return (
        <Listbox value={selectedGuild}>
            {({ open }) => (
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                        <span className="flex items-center">
                            {selectedGuild ? (
                                <>
                                    <img
                                        src={
                                            selectedGuild?.icon
                                                ? iconHashToUrl(
                                                      selectedGuild.icon,
                                                      selectedGuild?.id,
                                                  )
                                                : "https://cdn.discordapp.com/embed/avatars/0.png"
                                        }
                                        alt=""
                                        className="h-6 w-6 flex-shrink-0 rounded-full"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="ml-3 block truncate">
                                        {selectedGuild.name}
                                    </span>
                                </>
                            ) : (
                                <SmallLoading />
                            )}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>

                    <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {guilds.map((guild) => (
                                <Listbox.Option
                                    key={guild.id}
                                    className={({ active }) =>
                                        classNames(
                                            active
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-900",
                                            "relative cursor-default select-none py-2 pl-3 pr-9",
                                        )
                                    }
                                    value={guild}
                                >
                                    {({ selected, active }) => (
                                        <Link
                                            href={
                                                selected
                                                    ? "#"
                                                    : `/dashboard/${guild.id}/${
                                                          subPage ?? ""
                                                      }`
                                            }
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    src={
                                                        guild.icon
                                                            ? iconHashToUrl(
                                                                  guild.icon,
                                                                  guild.id,
                                                              )
                                                            : "https://cdn.discordapp.com/embed/avatars/0.png"
                                                    }
                                                    alt=""
                                                    className="h-6 w-6 flex-shrink-0 rounded-full"
                                                    width={24}
                                                    height={24}
                                                />
                                                <span
                                                    className={classNames(
                                                        selected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                        "ml-3 block truncate",
                                                    )}
                                                >
                                                    {guild.name}
                                                </span>
                                            </div>

                                            {selected ? (
                                                <span
                                                    className={classNames(
                                                        active
                                                            ? "text-white"
                                                            : "text-indigo-600",
                                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                                    )}
                                                >
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </Link>
                                    )}
                                </Listbox.Option>
                            ))}
                            {/* Add bot button */}
                            <Listbox.Option
                                key="add"
                                className={({ active }) =>
                                    classNames(
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900",
                                        "relative cursor-default select-none border-t-2 border-gray-200 py-2 pl-3 pr-9",
                                    )
                                }
                                value={null}
                            >
                                {({ selected }) => (
                                    <Link href="/dashboard">
                                        <div className="flex items-center">
                                            <PlusIcon
                                                className="h-6 w-6 flex-shrink-0 rounded-full"
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={classNames(
                                                    selected
                                                        ? "font-semibold"
                                                        : "font-normal",
                                                    "ml-3 block truncate",
                                                )}
                                            >
                                                Add a server
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </Listbox.Option>
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
};

export default GuildDropdown;
