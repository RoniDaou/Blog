import React from "react";
import months from "../data/months";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { PopularBlogsContext } from "../context/PopularBlogsContext";

export default function BlogBox({ blog }) {
  const { title, author, category, datePublished } = blog;
  const { user } = useAuthContext();
  const { dispatch: latestBlogsDispatch } = React.useContext(LatestBlogsContext);
  const { dispatch: popularBlogsDispatch } = React.useContext(PopularBlogsContext);
  const navigate = useNavigate();

  const date = new Date(datePublished);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const likedBy = blog.likedby || [];
  const dislikedBy = blog.dislikedby || [];
  const userId = user?.id || user?._id;
  const userLiked = userId ? likedBy.some((id) => String(id) === String(userId)) : false;
  const userDisliked = userId ? dislikedBy.some((id) => String(id) === String(userId)) : false;
  const excerpt = Array.isArray(blog.content)
    ? blog.content.find((item, index) => index % 2 === 1 && item)?.slice(0, 120)
    : "";

  const dispatchReaction = (type) => {
    const action = { type, blog_id: blog._id, user_id: userId };
    latestBlogsDispatch(action);
    popularBlogsDispatch(action);
  };

  async function handleReaction(event, endpoint, actionType) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/signInUp");
      return;
    }

    try {
      await axios.post(
        endpoint,
        { _id: blog._id },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      dispatchReaction(actionType);
    } catch (error) {
      console.error("Reaction error:", error.response?.data || error.message);
    }
  }

  return (
    <article className="story-card">
      <Link className="story-card__main" state={{ blog }} to="/blog">
        <div
          className={`story-card__image${blog.image?.image ? "" : " story-card__image--empty"}`}
          style={blog.image?.image ? { backgroundImage: `url(${blog.image.image})` } : undefined}
        >
          <span className="story-card__category">{category}</span>
        </div>

        <div className="story-card__body">
          <h3 className="story-card__title">{title}</h3>
          {excerpt && <p className="story-card__excerpt">{excerpt}{excerpt.length === 120 ? "…" : ""}</p>}
        </div>
      </Link>

      <div className="story-card__footer">
        <div className="story-card__author">
          <span className="author-avatar">{(author || "A").charAt(0).toUpperCase()}</span>
          <div>
            <strong>{author}</strong>
            <span>{`${months[month]} ${day}, ${year}`}</span>
          </div>
        </div>

        <div className="story-reactions" aria-label="Story reactions">
          <button
            type="button"
            className={userLiked ? "is-active" : ""}
            onClick={(event) => handleReaction(event, "/blogs/like", "UPDATE_LIKE")}
            aria-label="Like story"
          >
            <span className="material-symbols-rounded">thumb_up</span>
            <span>{likedBy.length}</span>
          </button>
          <button
            type="button"
            className={userDisliked ? "is-active" : ""}
            onClick={(event) => handleReaction(event, "/blogs/dislike", "UPDATE_DISLIKE")}
            aria-label="Dislike story"
          >
            <span className="material-symbols-rounded">thumb_down</span>
            <span>{dislikedBy.length}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
