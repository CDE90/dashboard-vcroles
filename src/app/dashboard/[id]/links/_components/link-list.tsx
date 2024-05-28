"use client";

import type { Link, Guild } from "~/client";
import type { Channel, Role } from "src/server/server-utils";
import LinkDropdown from "@/components/LinkDropdown";
import DeleteModal from "@/components/DeleteModal";
import RoleSelectionBox from "@/components/RoleSelectionBox";
import ChannelSelectionBox from "@/components/ChannelSelectionBox";
import { deleteLink, updateLink } from "src/app/actions";

export default function LinkList({
    guild,
    links,
    channels,
    roles,
    selected,
    modal,
    selectedChannel,
    setShowSaved,
}: {
    guild: Guild;
    links: Link[];
    channels: Channel[];
    roles: Role[];
    selected: {
        link: Link | null;
        setLink: (link: Link | null) => void;
    };
    modal: {
        open: boolean;
        setOpen: (open: boolean) => void;
    };
    selectedChannel: Channel | null;
    setShowSaved: (show: boolean) => void;
}) {
    const selectedLink = selected.link;

    return (
        <div className="pt-8">
            {(links.length ?? 0) > 0 ? (
                <LinkDropdown
                    links={links}
                    channels={channels}
                    selectedLink={selectedLink}
                    setSelectedLink={selected.setLink}
                />
            ) : null}

            <DeleteModal
                open={modal.open}
                setOpen={modal.setOpen}
                title="Delete Link"
                description="Are you sure you want to delete this link?"
                handleDelete={async () => {
                    if (selectedLink) {
                        await deleteLink(guild, { linkId: selectedLink.dbId });
                    }
                    selected.setLink(null);
                    modal.setOpen(false);
                }}
            />

            {selectedLink ? (
                <div className="sm:items-start sm:gap-4 sm:border-b sm:border-gray-200 sm:pt-5">
                    <div className="mb-4 mt-1 flex flex-col gap-4 sm:mt-0">
                        <RoleSelectionBox
                            title="Linked Roles"
                            roles={roles}
                            selected={roles.filter((r) =>
                                selectedLink.linkedRoles.includes(r.id),
                            )}
                            setSelected={(newSelected) => {
                                selected.setLink({
                                    ...selectedLink,
                                    linkedRoles: newSelected.map((r) => r.id),
                                });
                            }}
                        />
                        <RoleSelectionBox
                            title="Reverse Linked Roles"
                            roles={roles}
                            selected={roles.filter((r) =>
                                selectedLink.reverseLinkedRoles.includes(r.id),
                            )}
                            setSelected={(newSelected) => {
                                selected.setLink({
                                    ...selectedLink,
                                    reverseLinkedRoles: newSelected.map(
                                        (r) => r.id,
                                    ),
                                });
                            }}
                        />
                        <div>
                            <div className="block text-sm font-medium leading-6 text-gray-700">
                                Suffix
                            </div>
                            <div className="mt-1 sm:mt-0">
                                <input
                                    type="text"
                                    name="suffix"
                                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                                    maxLength={32}
                                    value={selectedLink.suffix ?? ""}
                                    onChange={(e) => {
                                        selected.setLink({
                                            ...selectedLink,
                                            suffix: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        {/* conditional speaker roles dropdown - only if channel type is stage */}
                        {selectedChannel?.type === 13 ? (
                            <RoleSelectionBox
                                title="Speaker Roles"
                                roles={roles}
                                selected={roles.filter((r) =>
                                    selectedLink.speakerRoles.includes(r.id),
                                )}
                                setSelected={(newSelected) => {
                                    selected.setLink({
                                        ...selectedLink,
                                        speakerRoles: newSelected.map(
                                            (r) => r.id,
                                        ),
                                    });
                                }}
                            />
                        ) : null}

                        {/* conditional channel select for exclude channels if channel type is category or link type is all */}
                        {selectedChannel?.type === 4 ||
                        selectedLink.type === "ALL" ||
                        selectedLink.type === "CATEGORY" ? (
                            <ChannelSelectionBox
                                title="Exclude Channels"
                                channels={channels.filter(
                                    (c) => c.type === 2 || c.type === 13,
                                )}
                                selected={channels.filter((c) =>
                                    selectedLink.excludeChannels.includes(c.id),
                                )}
                                setSelected={(newSelected) => {
                                    selected.setLink({
                                        ...selectedLink,
                                        excludeChannels: newSelected.map(
                                            (c) => c.id,
                                        ),
                                    });
                                }}
                            />
                        ) : null}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={async () => {
                                    const previousLink = links?.find(
                                        (l) => l.dbId === selectedLink.dbId,
                                    );
                                    if (previousLink) {
                                        // check if the link has changed
                                        if (
                                            JSON.stringify(previousLink) ===
                                            JSON.stringify(selectedLink)
                                        ) {
                                            return;
                                        }
                                    }

                                    await updateLink(guild, {
                                        link: selectedLink,
                                    });

                                    setShowSaved(true);
                                }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                                onClick={() => {
                                    modal.setOpen(true);
                                }}
                            >
                                Delete Link
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
