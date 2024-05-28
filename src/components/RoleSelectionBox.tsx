import RoleDropdown from "./RoleDropdown";
import { XMarkIcon } from "@heroicons/react/20/solid";
import type { Role } from "src/server/server-utils";

const RoleSelectionBox: React.FC<{
    roles: Role[];
    selected: Role[];
    setSelected: (role: Role[]) => void;
    title: string;
}> = ({ roles, selected, setSelected, title }) => {
    roles.sort((a, b) => a.name.localeCompare(b.name));
    selected.sort((a, b) => a.name.localeCompare(b.name));
    return (
        <div>
            <h3 className="text-sm font-medium leading-6 text-gray-700">
                {title}
            </h3>
            <div className="flex min-h-[44px] flex-wrap rounded-md border-2 border-gray-200 bg-gray-50">
                {selected.map((role) => (
                    <div
                        key={role.id}
                        className="m-1 flex h-8 items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-900"
                    >
                        <span
                            className={`block h-4 w-4 rounded-full`}
                            style={{
                                backgroundColor:
                                    `#${role.color.toString(16)}` === "#0"
                                        ? "#99AAb5"
                                        : `#${role.color.toString(16)}`,
                            }}
                        />
                        <span className="ml-2 cursor-default">{role.name}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setSelected(
                                    selected.filter((r) => r.id !== role.id),
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
            <RoleDropdown
                roles={roles.filter((role) => {
                    return (
                        !selected.find((r) => r.id === role.id) &&
                        role.name !== "@everyone"
                    );
                })}
                disabled={false}
                selectedRole={null}
                setSelectedRole={(role) => {
                    if (role) {
                        setSelected([...selected, role]);
                    }
                }}
            />
        </div>
    );
};

export default RoleSelectionBox;
