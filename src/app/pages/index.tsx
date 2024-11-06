// pages/index.tsx
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Post, User } from "../types";
import Link from "next/link";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          axios.get("https://jsonplaceholder.typicode.com/posts"),
          axios.get("https://jsonplaceholder.typicode.com/users"),
        ]);

        setPosts(postsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleUserFilter = (userId: number | null) => {
    setSelectedUserId(userId);
  };
  // Filter posts based on selected userId
  const filteredPosts = useMemo(() => {
    if (selectedUserId) {
      return posts.filter((post) => post.userId === selectedUserId);
    }
    return posts; // Return all posts if no user is selected
  }, [posts, selectedUserId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <select
        className="mb-4 p-2 border border-gray-300 rounded"
        onChange={(e) => handleUserFilter(Number(e.target.value))}
        value={selectedUserId || ""}
      >
        <option value="">All Authors</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <a className="block p-4 border border-gray-300 rounded hover:bg-gray-100">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-600">{post.body.slice(0, 100)}...</p>
              </a>
            </Link>
          ))
        ) : (
          <p>No posts available for this user.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
