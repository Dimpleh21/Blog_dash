// pages/post/[postId].tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Post, Comment } from "../../types";

const PostDetailPage = ({ postId }: { postId: number }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<{ name: string; body: string }>({
    name: "",
    body: "",
  });

  useEffect(() => {
    axios
      .get(`/api/posts/${postId}`)
      .then((response) => setPost(response.data));
    axios
      .get(`/api/comments?postId=${postId}`)
      .then((response) => setComments(response.data));
  }, [postId]);

  const handleAddComment = () => {
    const addedComment: Comment = {
      id: Date.now(), // Temporary ID
      postId,
      ...newComment,
    };
    setComments([addedComment, ...comments]);
    setNewComment({ name: "", body: "" });
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div>
      {post && (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <div>
            <h2>Comments</h2>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.name}</p>
                  <p>{comment.body}</p>
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <input
                value={newComment.name}
                onChange={(e) =>
                  setNewComment({ ...newComment, name: e.target.value })
                }
                placeholder="Your Name"
              />
              <textarea
                value={newComment.body}
                onChange={(e) =>
                  setNewComment({ ...newComment, body: e.target.value })
                }
                placeholder="Your Comment"
              />
              <button onClick={handleAddComment}>Add Comment</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetailPage;
