import { useRouter } from "next/router";
import DashboardLayout from "../../../layouts/Dashboard";
import { trpc } from "../../../utils/trpc";
import type { NextPageWithLayout } from "../../_app";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type Query = {
    id: string;
};

const DashboardGeneratorsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id } = router.query as Query;

    const { data: channels } = trpc.discord.getGuildChannels.useQuery({
        guild: id,
    });

    const { data: roles } = trpc.discord.getGuildRoles.useQuery({
        guild: id,
    });

    const { data: generators } = trpc.discord.getGenerators.useQuery({
        guild: id,
    });

    return (
        <div className="mt-6 space-y-8 divide-y divide-gray-200">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                Generators
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                View the voice channel generators in this
                                server.
                            </p>
                        </div>
                        <Link
                            href="/docs/features/voice-channel-generators"
                            className="mt-2 text-base leading-7 text-indigo-600 sm:ml-auto sm:mt-0"
                        >
                            Learn More &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Channel
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Category
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Interface Channel
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Type
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Default Options
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Default User Limit
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Channel Limit
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Default Role
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Generated Name Template
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Restrict Role
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Hide at Limit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {generators?.length ? (
                                            generators?.map((generator) => (
                                                <tr key={generator.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {
                                                            channels?.find(
                                                                (channel) =>
                                                                    channel.id ===
                                                                    generator.generatorId,
                                                            )?.name
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            channels?.find(
                                                                (channel) =>
                                                                    channel.id ===
                                                                    generator.categoryId,
                                                            )?.name
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {channels?.find(
                                                            (channel) =>
                                                                channel.id ===
                                                                generator.interfaceChannel,
                                                        )?.name ?? "None"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {generator.type}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {generator.defaultOptions
                                                            ? generator.defaultOptions.map(
                                                                  (option) => (
                                                                      <span
                                                                          key={
                                                                              option
                                                                          }
                                                                          className="mr-1 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                                                      >
                                                                          {
                                                                              option
                                                                          }
                                                                      </span>
                                                                  ),
                                                              )
                                                            : "None"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {
                                                            generator.defaultUserLimit
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {generator.channelLimit}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {roles?.find(
                                                            (role) =>
                                                                role.id ===
                                                                generator.defaultRole,
                                                        )?.name ?? "None"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {generator.channelName ??
                                                            "None"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {roles?.find(
                                                            (role) =>
                                                                role.id ===
                                                                generator.restrictRole,
                                                        )?.name ?? "None"}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {generator.hideAtLimit ? (
                                                            <CheckIcon className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <XMarkIcon className="h-5 w-5 text-red-500" />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    No Generators
                                                </td>
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                                <td />
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

DashboardGeneratorsPage.getLayout = (page) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardGeneratorsPage;
