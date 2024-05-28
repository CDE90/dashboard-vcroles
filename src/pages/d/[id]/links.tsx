import type { LinkType, Link } from "~/client";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactElement } from "react";
import ChannelDropdown from "../../../components/ChannelDropdown";
import ChannelSelectionBox from "../../../components/ChannelSelectionBox";
import DeleteModal from "../../../components/DeleteModal";
import LinkDropdown from "../../../components/LinkDropdown";
import LinkTypeDropdown from "../../../components/LinkTypeDropdown";
import RoleSelectionBox from "../../../components/RoleSelectionBox";
import SavedNotificationContainer from "../../../components/SavedNotification";
import DashboardLayout from "../../../layouts/Dashboard";
import type { Channel } from "src/server/server-utils";
import { trpc } from "../../../utils/trpc";
import type { NextPageWithLayout } from "../../_app";
import { default as NextLink } from "next/link";

type Query = {
    id: string;
};

const DashboardLinksPage: NextPageWithLayout = () => {
    // Get the guild id from the url
    const router = useRouter();
    const { id } = router.query as Query;

    // Get the guild channels
    const { data: channels } = trpc.discord.getGuildChannels.useQuery({
        guild: id,
    });

    // Get the guild roles
    const { data: roles } = trpc.discord.getGuildRoles.useQuery({ guild: id });

    // Get the guild links
    const { data: linkData } = trpc.discord.getLinks.useQuery({ guild: id });

    // Set the guild links
    const [links, setLinks] = useState(linkData);

    const [selectedLink, setSelectedLink] = useState<Link | null>(null);

    const selectedChannel = channels?.find(
        (channel) => channel.id === selectedLink?.id,
    );

    const [modalOpen, setModalOpen] = useState(false);

    const [showSaved, setShowSaved] = useState(false);

    const [createLinkType, setCreateLinkType] = useState<LinkType>("REGULAR");
    const [createLinkChannel, setCreateLinkChannel] = useState<Channel | null>(
        null,
    );
    const allowedChannelTypes =
        createLinkType === "REGULAR"
            ? [2]
            : createLinkType === "CATEGORY"
              ? [4]
              : createLinkType === "STAGE"
                ? [13]
                : createLinkType === "PERMANENT"
                  ? [2, 4, 13]
                  : [];

    useEffect(() => {
        setCreateLinkChannel(null);
    }, [createLinkType]);

    const utils = trpc.useContext();
    const updateMutation = trpc.discord.updateLink.useMutation({
        onMutate: () => {
            utils.discord.getLinks.cancel({ guild: id });
            const optimisticUpdate = utils.discord.getLinks.getData({
                guild: id,
            });
            if (optimisticUpdate) {
                utils.discord.getLinks.setData({ guild: id }, optimisticUpdate);
            }
        },
        onSettled: () => {
            utils.discord.getLinks.invalidate({ guild: id });
        },
    });
    const deleteMutation = trpc.discord.deleteLink.useMutation({
        onMutate: () => {
            utils.discord.getLinks.cancel({ guild: id });
            const optimisticUpdate = utils.discord.getLinks.getData({
                guild: id,
            });
            if (optimisticUpdate) {
                utils.discord.getLinks.setData({ guild: id }, optimisticUpdate);
            }
        },
        onSettled: () => {
            utils.discord.getLinks.invalidate({ guild: id });
        },
    });
    const createMutation = trpc.discord.createLink.useMutation({
        onMutate: () => {
            utils.discord.getLinks.cancel({ guild: id });
            const optimisticUpdate = utils.discord.getLinks.getData({
                guild: id,
            });
            if (optimisticUpdate) {
                utils.discord.getLinks.setData({ guild: id }, optimisticUpdate);
            }
        },
        onSettled: () => {
            utils.discord.getLinks.invalidate({ guild: id });
        },
        onSuccess(data) {
            setSelectedLink(data);
            setCreateLinkType("REGULAR");
            setCreateLinkChannel(null);
        },
    });

    // every time the ID changes, update the state
    useEffect(() => {
        setLinks(linkData);
    }, [id, linkData]);

    useEffect(() => {
        setSelectedLink(null);
    }, [id]);

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

                <div className="pt-8">
                    {(links?.length ?? 0) > 0 ? (
                        <LinkDropdown
                            links={links ?? []}
                            channels={channels ?? []}
                            selectedLink={selectedLink}
                            setSelectedLink={setSelectedLink}
                        />
                    ) : null}

                    <DeleteModal
                        open={modalOpen}
                        setOpen={setModalOpen}
                        title="Delete Link"
                        description="Are you sure you want to delete this link?"
                        handleDelete={async () => {
                            if (selectedLink) {
                                deleteMutation.mutate({
                                    dbId: selectedLink.dbId,
                                    guild: id,
                                });
                            }
                            setSelectedLink(null);
                            setModalOpen(false);
                        }}
                    />

                    {selectedLink ? (
                        <div className="sm:items-start sm:gap-4 sm:border-b sm:border-gray-200 sm:pt-5">
                            <div className="mb-4 mt-1 flex flex-col gap-4 sm:mt-0">
                                <RoleSelectionBox
                                    title="Linked Roles"
                                    roles={roles ?? []}
                                    selected={
                                        roles?.filter((r) =>
                                            selectedLink.linkedRoles.includes(
                                                r.id,
                                            ),
                                        ) ?? []
                                    }
                                    setSelected={(selected) => {
                                        setSelectedLink({
                                            ...selectedLink,
                                            linkedRoles: selected.map(
                                                (r) => r.id,
                                            ),
                                        });
                                    }}
                                />
                                <RoleSelectionBox
                                    title="Reverse Linked Roles"
                                    roles={roles ?? []}
                                    selected={
                                        roles?.filter((r) =>
                                            selectedLink.reverseLinkedRoles.includes(
                                                r.id,
                                            ),
                                        ) ?? []
                                    }
                                    setSelected={(selected) => {
                                        setSelectedLink({
                                            ...selectedLink,
                                            reverseLinkedRoles: selected.map(
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
                                                setSelectedLink({
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
                                        roles={roles ?? []}
                                        selected={
                                            roles?.filter((r) =>
                                                selectedLink.speakerRoles.includes(
                                                    r.id,
                                                ),
                                            ) ?? []
                                        }
                                        setSelected={(selected) => {
                                            setSelectedLink({
                                                ...selectedLink,
                                                speakerRoles: selected.map(
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
                                        channels={
                                            channels?.filter(
                                                (c) =>
                                                    c.type === 2 ||
                                                    c.type === 13,
                                            ) ?? []
                                        }
                                        selected={
                                            channels?.filter((c) =>
                                                selectedLink.excludeChannels.includes(
                                                    c.id,
                                                ),
                                            ) ?? []
                                        }
                                        setSelected={(selected) => {
                                            setSelectedLink({
                                                ...selectedLink,
                                                excludeChannels: selected.map(
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
                                        onClick={() => {
                                            const previousLink = links?.find(
                                                (l) =>
                                                    l.dbId ===
                                                    selectedLink.dbId,
                                            );
                                            if (previousLink) {
                                                // check if the link has changed
                                                if (
                                                    JSON.stringify(
                                                        previousLink,
                                                    ) ===
                                                    JSON.stringify(selectedLink)
                                                ) {
                                                    return;
                                                }
                                            }
                                            updateMutation.mutate(selectedLink);
                                            setShowSaved(true);
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                                        onClick={() => {
                                            setModalOpen(true);
                                        }}
                                    >
                                        Delete Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
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
                                    selected={createLinkType}
                                    setSelected={setCreateLinkType}
                                />
                            </div>
                        </div>
                    </div>

                    {createLinkType !== "ALL" ? (
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
                                        channels={
                                            channels?.filter((c) =>
                                                allowedChannelTypes.includes(
                                                    c.type,
                                                ),
                                            ) ?? []
                                        }
                                        selectedChannel={createLinkChannel}
                                        setSelectedChannel={
                                            setCreateLinkChannel
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
                            onClick={() => {
                                const link = links?.find(
                                    (l) =>
                                        l.type === createLinkType &&
                                        (l.id === createLinkChannel?.id ||
                                            l.id === id),
                                );
                                if (link) {
                                    setSelectedLink(link);
                                    return;
                                }
                                if (
                                    !createLinkChannel &&
                                    createLinkType !== "ALL"
                                ) {
                                    return;
                                } else if (createLinkType === "ALL" && !id) {
                                    return;
                                }
                                createMutation.mutate({
                                    type: createLinkType,
                                    guildId: id,
                                    id:
                                        createLinkType === "ALL"
                                            ? id
                                            : createLinkChannel?.id ?? "",
                                });
                            }}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </form>
            <SavedNotificationContainer
                show={showSaved}
                setShow={setShowSaved}
            />
        </>
    );
};

DashboardLinksPage.getLayout = (page: ReactElement) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default DashboardLinksPage;
