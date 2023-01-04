import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    HashtagIcon,
    SignalIcon,
    SpeakerWaveIcon,
    FolderIcon,
    XMarkIcon,
} from "@heroicons/react/20/solid";
import type { Channel } from "../server/trpc/router/discord";

import { classNames } from "../utils/utils";

const ChannelDropdown: React.FC<{
    channels: Channel[];
    disabled?: boolean;
    selected: Channel | null;
    setSelected: (channel: Channel | null) => void;
}> = ({ channels, disabled, selected, setSelected }) => {
    channels.sort((a, b) => a.name.localeCompare(b.name));
    return (
        <Listbox value={selected} onChange={setSelected} disabled={disabled}>
            {({ open }) => (
                <>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className={classNames(
                                disabled ? "cursor-default" : "cursor-pointer",
                                "relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            )}
                        >
                            <span className="flex items-center">
                                {selected ? (
                                    <>
                                        {selected.type === 0 ? (
                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                        ) : selected.type === 2 ? (
                                            <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                                        ) : selected.type === 4 ? (
                                            <FolderIcon className="h-5 w-5 text-gray-400" />
                                        ) : selected.type === 13 ? (
                                            <SignalIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <HashtagIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                        <span className="ml-3 block truncate">
                                            {selected?.name}
                                        </span>
                                        <XMarkIcon
                                            className="ml-auto h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                            onClick={() => setSelected(null)}
                                        />
                                    </>
                                ) : (
                                    <span className="ml-3 block truncate">
                                        Select a channel
                                    </span>
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
                                {channels.map((channel) => (
                                    <Listbox.Option
                                        key={channel.id}
                                        className={({ active }) =>
                                            classNames(
                                                active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                        }
                                        value={channel}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {channel.type === 0 ? (
                                                        <HashtagIcon className="h-5 w-5 text-gray-400" />
                                                    ) : channel.type === 2 ? (
                                                        <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />
                                                    ) : channel.type === 4 ? (
                                                        <FolderIcon className="h-5 w-5 text-gray-400" />
                                                    ) : channel.type === 13 ? (
                                                        <SignalIcon className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <HashtagIcon className="h-5 w-5 text-gray-400" />
                                                    )}
                                                    <span
                                                        className={classNames(
                                                            selected
                                                                ? "font-semibold"
                                                                : "font-normal",
                                                            "ml-3 block truncate"
                                                        )}
                                                    >
                                                        {channel.name}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active
                                                                ? "text-white"
                                                                : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
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
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
};

export default ChannelDropdown;
