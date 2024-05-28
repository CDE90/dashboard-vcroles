import ChannelDropdown from "./ChannelDropdown";
import {
    XMarkIcon,
    HashtagIcon,
    FolderIcon,
    SpeakerWaveIcon,
    SignalIcon,
} from "@heroicons/react/20/solid";
import type { Channel } from "src/server/server-utils";

const ChannelSelectionBox: React.FC<{
    channels: Channel[];
    selected: Channel[];
    setSelected: (channel: Channel[]) => void;
    title: string;
}> = ({ channels, selected, setSelected, title }) => {
    channels.sort((a, b) => a.name.localeCompare(b.name));
    selected.sort((a, b) => a.name.localeCompare(b.name));
    return (
        <div>
            <h3 className="text-sm font-medium leading-6 text-gray-700">
                {title}
            </h3>
            <div className="flex min-h-[44px] flex-wrap rounded-md border-2 border-gray-200 bg-gray-50">
                {selected.map((channel) => (
                    <div
                        key={channel.id}
                        className="m-1 flex h-8 items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-900"
                    >
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
                        <span className="ml-2 cursor-default">
                            {channel.name}
                        </span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelected(
                                    selected.filter((r) => r.id !== channel.id),
                                );
                            }}
                            className="ml-2"
                            type="button"
                        >
                            <XMarkIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                ))}
            </div>
            <ChannelDropdown
                channels={channels.filter((channel) => {
                    return (
                        !selected.find((r) => r.id === channel.id) &&
                        channel.name !== "@everyone"
                    );
                })}
                disabled={false}
                selectedChannel={null}
                setSelectedChannel={(channel) => {
                    if (channel) {
                        setSelected([...selected, channel]);
                    }
                }}
            />
        </div>
    );
};

export default ChannelSelectionBox;
