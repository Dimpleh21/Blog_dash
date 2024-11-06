import { Post } from "../types";
import { useState, useEffect } from "react";
import axios from "axios";

type PostDetailProps = {
  post: Post;
  onBack: () => void;
};

export const PostDetail = ({ post, onBack }: PostDetailProps) => {
  const [comments, setComments] = useState<
    { id: number; name: string; body: string }[]
  >([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    body: "",
  });

  useEffect(() => {
    // Fetch comments for the specific post
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
      .then((res) => setComments(res.data));
  }, [post.id]);

  const handleAddComment = async () => {
    if (newComment.name && newComment.body && newComment.email) {
      try {
        // Correct POST request to add a comment
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/comments",
          {
            postId: post.id, // Include postId in payload, not in URL
            name: newComment.name,
            email: newComment.email,
            body: newComment.body,
          }
        );

        // Add the new comment to the list
        setComments((prevComments) => [
          ...prevComments,
          {
            id: response.data.id,
            name: newComment.name,
            body: newComment.body,
          },
        ]);

        // Clear input fields after submission
        setNewComment({ name: "", email: "", body: "" });
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    }
  };

  return (
    <div className="p-4 rounded-lg shadow">
      <button onClick={onBack} className="text-indigo-500 hover:underline mb-4">
        Back to Posts
      </button>
      <h2 className="text-2xl font-bold text-indigo-300">{post.title}</h2>
      <p className="text-white mt-4">{post.body}</p>

      <div className="comments-section mt-8">
        <h3 className="text-xl font-semibold text-white">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.id} className="border-t border-gray-300 py-4">
            <p className="text-sm font-semibold text-indigo-200">
              {comment.name}
            </p>
            <p className="text-gray-100">{comment.body}</p>
          </div>
        ))}
        <div className="add-comment mt-6">
          <input
            type="text"
            placeholder="Your Name"
            value={newComment.name}
            onChange={(e) =>
              setNewComment({ ...newComment, name: e.target.value })
            }
            className="w-full mb-2 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Your Email"
            value={newComment.email}
            onChange={(e) =>
              setNewComment({ ...newComment, email: e.target.value })
            }
            className="w-full mb-2 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Your Comment"
            value={newComment.body}
            onChange={(e) =>
              setNewComment({ ...newComment, body: e.target.value })
            }
            className="w-full mb-2 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};
