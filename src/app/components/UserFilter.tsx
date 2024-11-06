// components/UserFilter.tsx
import { User } from "../types";

type UserFilterProps = {
  users: User[];
  onSelectUser: (userId: number | null) => void;
};

export const UserFilter = ({ users, onSelectUser }: UserFilterProps) => {
  return (
    <div className="p-4  rounded-lg shadow">
      <label className="block font-semibold mb-2">Filter by Author:</label>
      <select
        onChange={(e) => onSelectUser(Number(e.target.value) || null)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
      >
        <option value="">All Authors</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};
