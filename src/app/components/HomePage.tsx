// pages/index.tsx
"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Post, User, Comment } from "../types";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<{ name: string; body: string }>({
    name: "",
    body: "",
  });

  // Fetch posts and users on initial load
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => setPosts(res.data));
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data));
  }, []);

  // Fetch comments when a post is selected
  useEffect(() => {
    if (selectedPost) {
      axios
        .get(
          `https://jsonplaceholder.typicode.com/comments?postId=${selectedPost.id}`
        )
        .then((res) => setComments(res.data));
    }
  }, [selectedPost]);

  // Filter posts based on selected user
  const filteredPosts = selectedUserId
    ? posts.filter((post) => post.userId === selectedUserId)
    : posts;

  // Handle user selection to filter posts
  const handleUserFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(Number(e.target.value) || null);
  };

  // Handle selecting a post to view details
  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    const addedComment: Comment = {
      id: Date.now(), // Temporary ID for local state
      postId: selectedPost!.id,
      name: newComment.name,
      body: newComment.body,
    };
    setComments([addedComment, ...comments]);
    setNewComment({ name: "", body: "" });
  };

  // Handle deleting a comment
  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Blog Dashboard</h1>

      {/* User Filter */}
      <label htmlFor="userFilter">Filter by Author: </label>
      <select id="userFilter" onChange={handleUserFilter}>
        <option value="">All Authors</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Post List */}
      <div style={{ marginTop: "2rem" }}>
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
            onClick={() => handlePostSelect(post)}
          >
            <h3>{post.title}</h3>
            <p>{post.body.slice(0, 100)}...</p>
            <p>
              <strong>Author:</strong>{" "}
              {users.find((user) => user.id === post.userId)?.name}
            </p>
          </div>
        ))}
      </div>

      {/* Post Detail and Comments */}
      {selectedPost && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <button onClick={() => setSelectedPost(null)}>Back to Posts</button>
          <h2>{selectedPost.title}</h2>
          <p>{selectedPost.body}</p>
          <p>
            <strong>Author:</strong>{" "}
            {users.find((user) => user.id === selectedPost.userId)?.name}
          </p>

          {/* Comments Section */}
          <div style={{ marginTop: "2rem" }}>
            <h3>Comments</h3>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} style={{ marginBottom: "1rem" }}>
                  <p>
                    <strong>{comment.name}</strong>: {comment.body}
                  </p>
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {/* Add New Comment */}
            <div style={{ marginTop: "1rem" }}>
              <h4>Add a Comment</h4>
              <input
                type="text"
                placeholder="Your Name"
                value={newComment.name}
                onChange={(e) =>
                  setNewComment({ ...newComment, name: e.target.value })
                }
                style={{ display: "block", marginBottom: "0.5rem" }}
              />
              <textarea
                placeholder="Your Comment"
                value={newComment.body}
                onChange={(e) =>
                  setNewComment({ ...newComment, body: e.target.value })
                }
                style={{ display: "block", marginBottom: "0.5rem" }}
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
