import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
    HashtagIcon,
    FolderIcon,
    SpeakerWaveIcon,
    SignalIcon,
    XMarkIcon,
    ListBulletIcon,
    LockClosedIcon,
} from "@heroicons/react/20/solid";
import { type Link, LinkType } from "~/client";
import type { Channel } from "src/server/server-utils";

import { classNames } from "../utils/utils";

const LinkDropdown: React.FC<{
    links: Link[];
    disabled?: boolean;
    selectedLink: Link | null;
    setSelectedLink: (link: Link | null) => void;
    channels: Channel[];
}> = ({ links, disabled, selectedLink, setSelectedLink, channels }) => {
    const selectedChannel = channels.find(
        (channel) => channel.id === selectedLink?.id,
    );
    return (
        <Listbox
            value={selectedLink}
            onChange={setSelectedLink}
            disabled={disabled}
        >
            {({ open }) => (
                <div className="relative mt-1">
                    <Listbox.Button
                        className={classNames(
                            disabled ? "cursor-default" : "cursor-pointer",
                            "relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
                        )}
                    >
                        <span className="flex items-center">
                            {selectedLink ? (
                                <div className="flex items-center">
                                    {selectedLink.type ===
                                    LinkType.PERMANENT ? (
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    ) : selectedChannel ? (
                                        selectedChannel.type === 0 ? (
                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                        ) : selectedChannel.type === 2 ? (
                                            <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                                        ) : selectedChannel.type === 4 ? (
                                            <FolderIcon className="h-5 w-5 text-gray-400" />
                                        ) : selectedChannel.type === 13 ? (
                                            <SignalIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                        )
                                    ) : (
                                        <ListBulletIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                    <span className="ml-3 block truncate">
                                        {selectedChannel
                                            ? selectedChannel.name
                                            : selectedLink.type === LinkType.ALL
                                              ? "All"
                                              : "Unknown"}
                                    </span>
                                </div>
                            ) : (
                                <span className="ml-3 block truncate">
                                    Select a link
                                </span>
                            )}
                            {/* add xmark icon which setsselected to null */}
                            {selectedLink && (
                                <XMarkIcon
                                    className="ml-auto h-5 w-5 text-gray-400"
                                    onClick={() => setSelectedLink(null)}
                                />
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
                            {links.map((link) => {
                                const channel = channels.find(
                                    (channel) => channel.id === link.id,
                                );
                                return (
                                    <Listbox.Option
                                        key={link.id + link.type}
                                        className={({ active }) =>
                                            classNames(
                                                active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                            )
                                        }
                                        value={link}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {link.type ===
                                                    LinkType.PERMANENT ? (
                                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                                    ) : channel ? (
                                                        channel.type === 0 ? (
                                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                                        ) : channel.type ===
                                                          2 ? (
                                                            <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                                                        ) : channel.type ===
                                                          4 ? (
                                                            <FolderIcon className="h-5 w-5 text-gray-400" />
                                                        ) : channel.type ===
                                                          13 ? (
                                                            <SignalIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                                        )
                                                    ) : (
                                                        <ListBulletIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                    <span className="ml-3 block truncate">
                                                        {channel
                                                            ? channel.name
                                                            : link.type ===
                                                                LinkType.ALL
                                                              ? "All"
                                                              : "Unknown"}
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
                                            </>
                                        )}
                                    </Listbox.Option>
                                );
                            })}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
};

export default LinkDropdown;
