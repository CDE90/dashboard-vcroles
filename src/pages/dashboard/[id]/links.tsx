import { useRouter } from "next/router";
import { type ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
import DashboardLayout from "../../../layouts/Dashboard";
import { trpc } from "../../../utils/trpc";
import RoleSelectionBox from "../../../components/RoleSelectionBox";
import { type Link, LinkType } from "@prisma/client";
import ChannelSelectionBox from "../../../components/ChannelSelectionBox";
import LinkDropdown from "../../../components/LinkDropdown";
import DeleteModal from "../../../components/DeleteModal";
import SavedNotificationContainer from "../../../components/SavedNotification";

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
        (channel) => channel.id === selectedLink?.id
    );

    const [modalOpen, setModalOpen] = useState(false);

    const [showSaved, setShowSaved] = useState(false);

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

    // every time the ID changes, update the state
    useEffect(() => {
        setLinks(linkData);
        setSelectedLink(null);
    }, [id, linkData]);

    return (
        <>
            <form
                className="mt-6 space-y-8 divide-y divide-gray-200"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Links
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Edit the links for this server.
                            </p>
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
                        handleDelete={() => {
                            if (selectedLink) {
                                deleteMutation.mutate({
                                    dbId: selectedLink.dbId,
                                });
                            }
                            setSelectedLink(null);
                            setModalOpen(false);
                        }}
                    />

                    {selectedLink ? (
                        <div className="sm:items-start sm:gap-4 sm:border-b sm:border-gray-200 sm:pt-5">
                            <div className="mt-1 mb-4 flex flex-col gap-4 sm:mt-0">
                                <RoleSelectionBox
                                    title="Linked Roles"
                                    roles={roles ?? []}
                                    selected={
                                        roles?.filter((r) =>
                                            selectedLink.linkedRoles.includes(
                                                r.id
                                            )
                                        ) ?? []
                                    }
                                    setSelected={(selected) => {
                                        setSelectedLink({
                                            ...selectedLink,
                                            linkedRoles: selected.map(
                                                (r) => r.id
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
                                                r.id
                                            )
                                        ) ?? []
                                    }
                                    setSelected={(selected) => {
                                        setSelectedLink({
                                            ...selectedLink,
                                            reverseLinkedRoles: selected.map(
                                                (r) => r.id
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
                                                    r.id
                                                )
                                            ) ?? []
                                        }
                                        setSelected={(selected) => {
                                            setSelectedLink({
                                                ...selectedLink,
                                                speakerRoles: selected.map(
                                                    (r) => r.id
                                                ),
                                            });
                                        }}
                                    />
                                ) : null}
                                {/* conditional channel select for exclude channels if channel type is category or link type is all */}
                                {selectedChannel?.type === 4 ||
                                selectedLink.type === LinkType.ALL ||
                                selectedLink.type === LinkType.CATEGORY ? (
                                    <ChannelSelectionBox
                                        title="Exclude Channels"
                                        channels={
                                            channels?.filter(
                                                (c) =>
                                                    c.type === 2 ||
                                                    c.type === 13
                                            ) ?? []
                                        }
                                        selected={
                                            channels?.filter((c) =>
                                                selectedLink.excludeChannels.includes(
                                                    c.id
                                                )
                                            ) ?? []
                                        }
                                        setSelected={(selected) => {
                                            setSelectedLink({
                                                ...selectedLink,
                                                excludeChannels: selected.map(
                                                    (c) => c.id
                                                ),
                                            });
                                        }}
                                    />
                                ) : null}
                                <div className="flex justify-end">
                                    <button
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        onClick={() => {
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