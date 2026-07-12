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

  const { dispatch: latestBlogsDispatch } =
    React.useContext(LatestBlogsContext);

  const { dispatch: popularBlogsDispatch } =
    React.useContext(PopularBlogsContext);

  const navigate = useNavigate();

  const date = new Date(datePublished);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const likedBy = blog.likedby || [];
  const dislikedBy = blog.dislikedby || [];

  const userId = user?.id || user?._id;

  const userLiked = userId
    ? likedBy.some((id) => String(id) === String(userId))
    : false;

  const userDisliked = userId
    ? dislikedBy.some((id) => String(id) === String(userId))
    : false;

  async function handleLike(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/signInUp");
      return;
    }

    try {
      await axios.post(
        "/blogs/like",
        {
          _id: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      latestBlogsDispatch({
        type: "UPDATE_LIKE",
        blog_id: blog._id,
        user_id: userId,
      });

      popularBlogsDispatch({
        type: "UPDATE_LIKE",
        blog_id: blog._id,
        user_id: userId,
      });
    } catch (error) {
      console.error("Like error:", error.response?.data || error.message);
    }
  }

  async function handleDislike(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      navigate("/signInUp");
      return;
    }

    try {
      await axios.post(
        "/blogs/dislike",
        {
          _id: blog._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      latestBlogsDispatch({
        type: "UPDATE_DISLIKE",
        blog_id: blog._id,
        user_id: userId,
      });

      popularBlogsDispatch({
        type: "UPDATE_DISLIKE",
        blog_id: blog._id,
        user_id: userId,
      });
    } catch (error) {
      console.error("Dislike error:", error.response?.data || error.message);
    }
  }

  return (
    <Link className="blog-box--container" state={{ blog }} to="/blog">
      <div className="blog-box--info-post">
        <div
          className="blog-box--img"
          style={{
            backgroundImage: `url(${blog.image?.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />

        <div className="category-likes--container">
          <p className="blog-box-category">{category}</p>

          <div className="likes--container">
            <p>{likedBy.length}</p>

            <span
              className={`material-symbols-rounded thumb-up${
                userLiked ? " thumb--clicked" : ""
              }`}
              onClick={handleLike}
            >
              thumb_up
            </span>

            <p>{dislikedBy.length}</p>

            <span
              className={`material-symbols-rounded thumb-up${
                userDisliked ? " thumb--clicked" : ""
              }`}
              onClick={handleDislike}
            >
              thumb_down
            </span>
          </div>
        </div>

        <h6 className="blog-box-title">{title}</h6>
      </div>

      <div className="blog-box--info">
        <p className="blog-box-author">{author}</p>

        <p className="blog-box-date">{`${months[month]} ${day}, ${year}`}</p>
      </div>
    </Link>
  );
}
