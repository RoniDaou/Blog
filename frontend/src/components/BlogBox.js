import React from "react";
import months from "../data/months";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { PopularBlogsContext } from "../context/PopularBlogsContext";
import { useNavigate } from "react-router-dom";

export default function BlogBox({ blog }) {
  const { title, author, category, datePublished } = blog;
  const date = new Date(datePublished);
  const { user } = useAuthContext();
  const { dispatch: latestBlogsDispatch } =
    React.useContext(LatestBlogsContext);
  const { dispatch: popularBlogsDispatch } =
    React.useContext(PopularBlogsContext);

  const year = date.getYear() + 1900;
  const month = date.getMonth();
  const day = date.getDate();

  const navigate = useNavigate();

  async function handleLike(event) {
    event.preventDefault();

    if (!user) {
      navigate("/signInUp");
      return;
    }

    try {
      const response = await axios.post(
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

      const updatedBlog = response.data.blog || response.data.Blog;
      const userId = user._id || user.id;

      latestBlogsDispatch({
        type: "UPDATE_LIKE",
        blog_id: updatedBlog._id,
        user_id: userId,
      });

      popularBlogsDispatch({
        type: "UPDATE_LIKE",
        blog_id: updatedBlog._id,
        user_id: userId,
      });
    } catch (error) {
      console.error("Like error:", error.response?.data || error.message);
    }
  }

  async function handleDislike(event) {
    event.preventDefault();

    if (!user) {
      navigate("/signInUp");
      return;
    }

    try {
      const response = await axios.post(
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

      const updatedBlog = response.data.blog || response.data.Blog;
      const userId = user._id || user.id;

      latestBlogsDispatch({
        type: "UPDATE_DISLIKE",
        blog_id: updatedBlog._id,
        user_id: userId,
      });

      popularBlogsDispatch({
        type: "UPDATE_DISLIKE",
        blog_id: updatedBlog._id,
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
            backgroundImage: `url(${blog.image.image})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="category-likes--container">
          <p className="blog-box-category">{category}</p>
          <div className="likes--container">
            <p>{blog.likedby.length}</p>
            <span
              className={`material-symbols-rounded thumb-up${user && blog.likedby.includes(user.id) ? " thumb--clicked" : ""}`}
              onClick={handleLike}
            >
              thumb_up
            </span>
            <p>{blog.dislikedby.length}</p>
            <span
              className={`material-symbols-rounded thumb-up${user && blog.dislikedby.includes(user.id) ? " thumb--clicked" : ""}`}
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
