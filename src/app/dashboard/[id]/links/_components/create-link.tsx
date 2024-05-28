"use client";

import type { Channel } from "src/server/server-utils";
import type { Link, LinkType, Guild } from "~/client";
import ChannelDropdown from "@/components/ChannelDropdown";
import LinkTypeDropdown from "@/components/LinkTypeDropdown";
import { createLink } from "src/app/actions";

export default function CreateLink({
    guild,
    channels,
    links,
    createLinkType,
    createLinkChannel,
    setSelectedLink,
}: {
    guild: Guild;
    channels: Channel[];
    links: Link[];
    createLinkType: {
        type: LinkType;
        setType: (type: LinkType) => void;
    };
    createLinkChannel: {
        channel: Channel | null;
        setChannel: (channel: Channel | null) => void;
    };
    setSelectedLink: (link: Link | null) => void;
}) {
    const allowedChannelTypes =
        createLinkType.type === "REGULAR"
            ? [2]
            : createLinkType.type === "CATEGORY"
              ? [4]
              : createLinkType.type === "STAGE"
                ? [13]
                : createLinkType.type === "PERMANENT"
                  ? [2, 4, 13]
                  : [];

    return (
        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Create Link
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Create a new link.
                </p>
            </div>

            <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                        htmlFor="link-type"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                        Link Type
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <LinkTypeDropdown
                            selected={createLinkType.type}
                            setSelected={createLinkType.setType}
                        />
                    </div>
                </div>
            </div>

            {createLinkType.type !== "ALL" ? (
                <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                            htmlFor="link-channel"
                            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                            Channel
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                            <ChannelDropdown
                                channels={channels.filter((c) =>
                                    allowedChannelTypes.includes(c.type),
                                )}
                                selectedChannel={createLinkChannel.channel}
                                setSelectedChannel={
                                    createLinkChannel.setChannel
                                }
                            />
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="flex justify-end">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={async () => {
                        const link = links.find(
                            (l) =>
                                l.type === createLinkType.type &&
                                (l.id === createLinkChannel.channel?.id ||
                                    l.id === guild.id),
                        );
                        if (link) {
                            setSelectedLink(link);

                            createLinkChannel.setChannel(null);
                            return;
                        }
                        if (
                            !createLinkChannel &&
                            createLinkType.type !== "ALL"
                        ) {
                            return;
                        } else if (createLinkType.type === "ALL" && !guild.id) {
                            return;
                        }

                        await createLink(guild, {
                            linkType: createLinkType.type,
                            linkId:
                                createLinkType.type === "ALL"
                                    ? guild.id
                                    : createLinkChannel.channel?.id ?? "",
                        });

                        createLinkChannel.setChannel(null);
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
}
