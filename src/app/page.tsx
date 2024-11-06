// pages/index.tsx
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PostList } from "../app/components/PostList";
import { PostDetail } from "../app/components/PostDetail";
import { UserFilter } from "../app/components/UserFilter";
import { Post, User } from "./types";
import blog from "../assets/blog.png";
import Image from "next/image";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const [postRes, userRes] = await Promise.all([
        axios.get("https://jsonplaceholder.typicode.com/posts"),
        axios.get("https://jsonplaceholder.typicode.com/users"),
      ]);
      setPosts(postRes.data);
      setUsers(userRes.data);
    };
    fetchData();
  }, []);

  // Filter posts by selected user
  const filteredPosts = selectedUserId
    ? posts.filter((post) => post.userId === selectedUserId)
    : posts;

  // Calculate the paginated posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginatedPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Pagination controls
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-indigo-950 min-h-screen text-white pb-16">
      <header className="flex flex-col items-center mb-0 mx-auto w-full">
        <div className="relative w-full h-60">
          <Image
            src={blog}
            alt="blog"
            layout="fill"
            objectFit="cover"
            className="rounded-none"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center font-bold text-white bg-black bg-opacity-50">
            <h1 className="text-4xl">Blogify</h1>
            <h1 className="mt-5 text-xl">
              Discover, Read, and Share Insights.
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row mt-7 px-4">
        <aside className="md:w-1/4 md:mr-6">
          <UserFilter
            users={users}
            onSelectUser={(id) => {
              setSelectedUserId(id);
              setCurrentPage(1);
            }}
          />
        </aside>

        <main className="md:w-3/4">
          {selectedPost ? (
            <PostDetail
              post={selectedPost}
              onBack={() => setSelectedPost(null)}
            />
          ) : (
            <PostList
              posts={paginatedPosts}
              users={users}
              onPostSelect={setSelectedPost}
            />
          )}
        </main>
      </div>

      {/* Pagination bar fixed at the bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 bg-opacity-20 text-white py-3 flex justify-center space-x-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-indigo-900 disabled:bg-gray-500"
        >
          Previous
        </button>

        {/* {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-black text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-900"
            }`}
          >
            {index + 1}
          </button>
        ))} */}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-indigo-900 disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
