import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import months from "../data/months";
import { UserBlogsContext } from "../context/UserBlogsContext";

export default function BlogBoxUser({ blog }) {
  const { user } = useAuthContext();
  const { dispatch: userBlogsDispatch } = React.useContext(UserBlogsContext);
  const date = new Date(blog.datePublished);

  const deleteBlog = async () => {
    try {
      await axios.delete(`/blogs/deleteBlog/${blog._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      userBlogsDispatch({ type: "DELETE_BLOG", id: blog._id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className="profile-story-card">
      <Link className="profile-story-card__main" state={{ blog }} to="/blog">
        <div
          className={`profile-story-card__image${blog.image?.image ? "" : " profile-story-card__image--empty"}`}
          style={blog.image?.image ? { backgroundImage: `url(${blog.image.image})` } : undefined}
        />
        <div className="profile-story-card__content">
          <span className="story-list-card__category">{blog.category}</span>
          <h3>{blog.title}</h3>
          <div className="profile-story-card__meta">
            <span>{`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</span>
            <span>{(blog.likedby || []).length} likes</span>
          </div>
        </div>
      </Link>

      <div className="profile-story-card__actions">
        <Link to="/write" state={{ blog }} className="icon-action" aria-label="Edit story">
          <span className="material-symbols-rounded">edit</span>
        </Link>
        <button type="button" className="icon-action danger" onClick={deleteBlog} aria-label="Delete story">
          <span className="material-symbols-rounded">delete</span>
        </button>
      </div>
    </article>
  );
}
