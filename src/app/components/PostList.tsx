// components/PostList.tsx
import { Post, User } from "../types";

type PostListProps = {
  posts: Post[];
  users: User[];
  onPostSelect: (post: Post) => void;
};

export const PostList = ({ posts, users, onPostSelect }: PostListProps) => {
  return (
    <>
      <div className="text-white mb-6 text-3xl font-semibold">
        Blogs for you
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-8 border border-indigo-300 bg-gray-400 bg-opacity-15 rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow duration-200"
          >
            <h3 className="text-xl font-semibold text-indigo-300">
              {post.title}
            </h3>
            <p className="text-indigo-100 mt-2">
              {post.body.slice(0, 100)}...
              <span
                onClick={() => onPostSelect(post)}
                className="text-indigo-500 underline cursor-pointer"
              >
                Read more
              </span>
            </p>
            <p className="text-sm text-indigo-500 mt-4">
              <strong>Author:</strong>{" "}
              {users.find((user) => user.id === post.userId)?.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
