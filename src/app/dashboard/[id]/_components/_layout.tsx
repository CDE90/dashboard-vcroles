"use client";

import { SeoHeaders } from "@/components/SeoHeaders";
import { Dialog, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    BoltIcon,
    Cog6ToothIcon,
    LinkIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { classNames } from "src/utils/utils";
import GuildDropdown from "@/components/GuildDropdown";
import Logo from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import type { Guild } from "src/server/server-utils";
import { usePathname } from "next/navigation";

export function ClientDashboardLayout({
    children,
    guilds,
    guildId,
    user,
}: {
    children: React.ReactNode;
    guilds: Guild[];
    guildId: string;
    user: { email: string; username: string };
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname() ?? "";
    const subPage = pathname.split("/")[3];

    const navigation = [
        {
            name: "Server Settings",
            href: `/dashboard/${guildId}`,
            icon: Cog6ToothIcon,
            current: pathname === `/dashboard/${guildId}`,
        },
        {
            name: "Linked Channels",
            href: `/dashboard/${guildId}/links`,
            icon: LinkIcon,
            current: pathname === `/dashboard/${guildId}/links`,
        },
        {
            name: "Voice Generators",
            href: `/dashboard/${guildId}/generators`,
            icon: BoltIcon,
            current: pathname === `/dashboard/${guildId}/generators`,
        },
    ];

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname, guildId]);

    return (
        <>
            <SeoHeaders
                title="VC Roles | Dashboard"
                description="View the dashboard for your server"
                url="https://www.vcroles.com/dashboard"
            />
            <div className="h-full">
                {/* Collapsible Sidebar */}
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 md:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute right-0 top-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close sidebar
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                                        <div className="flex flex-shrink-0 items-center px-4">
                                            <Link href="/dashboard">
                                                <Logo size={40} />
                                            </Link>
                                        </div>
                                        <nav className="mt-5 space-y-1 px-2">
                                            <GuildDropdown
                                                guilds={guilds}
                                                selectedID={guildId}
                                                subPage={subPage}
                                            />
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                                        "group flex items-center rounded-md px-2 py-2 text-base font-medium",
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? "text-gray-500"
                                                                : "text-gray-400 group-hover:text-gray-500",
                                                            "mr-4 h-6 w-6 flex-shrink-0",
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                                        <div className="group block flex-shrink-0">
                                            <div className="flex items-center">
                                                <UserButton />
                                                <div className="ml-3">
                                                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="w-14 flex-shrink-0">
                                {/* Force sidebar to shrink to fit close icon */}
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                        <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
                            <div className="flex flex-shrink-0 items-center px-4">
                                <Link href="/dashboard">
                                    <Logo size={40} />
                                </Link>
                            </div>
                            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                                <GuildDropdown
                                    guilds={guilds}
                                    selectedID={guildId}
                                    subPage={subPage}
                                />
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                            "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current
                                                    ? "text-gray-500"
                                                    : "text-gray-400 group-hover:text-gray-500",
                                                "mr-3 h-6 w-6 flex-shrink-0",
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                            <div className="group block w-full flex-shrink-0">
                                <div className="flex items-center">
                                    <UserButton />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {user.username}
                                        </p>
                                        <p className="overflow-clip text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-full flex-1 flex-col md:pl-64">
                    <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
                        <button
                            type="button"
                            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <main className="h-full min-h-screen flex-1 bg-gray-50">
                        <div className="py-6">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Dashboard
                                </h1>
                            </div>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                                {/* Replace with your content */}
                                <div className="py-4">{children}</div>
                                {/* /End replace */}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
