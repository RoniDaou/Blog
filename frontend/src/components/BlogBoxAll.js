import React from "react";
import months from "../data/months";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { LatestBlogsContext } from "../context/LatestBlogsContext";

export default function BlogBoxAll({ blog }) {
  const { title, author, category, datePublished, image } = blog;
  const { user } = useAuthContext();
  const { dispatch } = React.useContext(LatestBlogsContext);
  const navigate = useNavigate();
  const date = new Date(datePublished);
  const userId = user?.id || user?._id;
  const likedBy = blog.likedby || [];
  const dislikedBy = blog.dislikedby || [];
  const userLiked = userId ? likedBy.some((id) => String(id) === String(userId)) : false;
  const userDisliked = userId ? dislikedBy.some((id) => String(id) === String(userId)) : false;
  const excerpt = Array.isArray(blog.content)
    ? blog.content.find((item, index) => index % 2 === 1 && item)?.slice(0, 180)
    : "";

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
      dispatch({ type: actionType, blog_id: blog._id, user_id: userId });
    } catch (error) {
      console.error("Reaction error:", error.response?.data || error.message);
    }
  }

  return (
    <article className="story-list-card">
      <Link className="story-list-card__image-link" state={{ blog }} to="/blog">
        <div
          className={`story-list-card__image${image?.image ? "" : " story-list-card__image--empty"}`}
          style={image?.image ? { backgroundImage: `url(${image.image})` } : undefined}
        />
      </Link>

      <div className="story-list-card__content">
        <Link className="story-list-card__main" state={{ blog }} to="/blog">
          <span className="story-list-card__category">{category}</span>
          <h2>{title}</h2>
          {excerpt && <p>{excerpt}{excerpt.length === 180 ? "…" : ""}</p>}
        </Link>

        <div className="story-list-card__footer">
          <div className="story-card__author">
            <span className="author-avatar">{(author || "A").charAt(0).toUpperCase()}</span>
            <div>
              <strong>{author}</strong>
              <span>{`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
            </div>
          </div>

          <div className="story-reactions">
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
      </div>
    </article>
  );
}
