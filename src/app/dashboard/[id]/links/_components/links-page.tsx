"use client";

import type { Guild, Link, LinkType } from "~/client";
import type { Role, Channel } from "src/server/server-utils";
import { useState, useEffect } from "react";
import { default as NextLink } from "next/link";
import SavedNotificationContainer from "@/components/SavedNotification";
import LinkList from "./link-list";
import CreateLink from "./create-link";

export function ClientLinksDashboardPage({
    guild,
    channels,
    roles,
    links,
}: {
    guild: Guild;
    channels: Channel[];
    roles: Role[];
    links: Link[];
}) {
    // Set the guild links
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);

    const selectedChannel =
        channels.find((channel) => channel.id === selectedLink?.id) ?? null;

    const [modalOpen, setModalOpen] = useState(false);

    const [showSaved, setShowSaved] = useState(false);

    const [createLinkType, setCreateLinkType] = useState<LinkType>("REGULAR");
    const [createLinkChannel, setCreateLinkChannel] = useState<Channel | null>(
        null,
    );

    useEffect(() => {
        setCreateLinkChannel(null);
    }, [createLinkType]);

    return (
        <>
            <form
                className="mt-6 space-y-8 divide-y divide-gray-200"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Links
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Edit the links for this server.
                                </p>
                            </div>
                            <NextLink
                                href="/docs/features/linking"
                                className="mt-2 text-base leading-7 text-indigo-600 sm:ml-auto sm:mt-0"
                            >
                                Learn More &rarr;
                            </NextLink>
                        </div>
                    </div>
                </div>

                {/* A list of all the links */}
                <LinkList
                    guild={guild}
                    links={links}
                    channels={channels}
                    roles={roles}
                    selected={{
                        link: selectedLink,
                        setLink: setSelectedLink,
                    }}
                    modal={{
                        open: modalOpen,
                        setOpen: setModalOpen,
                    }}
                    selectedChannel={selectedChannel}
                    setShowSaved={setShowSaved}
                />

                {/* Options for creating a new link */}
                <CreateLink
                    guild={guild}
                    channels={channels}
                    links={links}
                    createLinkType={{
                        type: createLinkType,
                        setType: setCreateLinkType,
                    }}
                    createLinkChannel={{
                        channel: createLinkChannel,
                        setChannel: setCreateLinkChannel,
                    }}
                    setSelectedLink={setSelectedLink}
                />
            </form>
            <SavedNotificationContainer
                show={showSaved}
                setShow={setShowSaved}
            />
        </>
    );
}
