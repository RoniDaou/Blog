import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/single-blog.css";
import months from "../data/months";

export default function SingleBlog({ setDisplayFooter }) {
  const blog = useLocation().state.blog;
  const { title, content: contentArr, category, author, datePublished } = blog;
  const date = new Date(datePublished);
  const year = date.getYear() + 1900;
  const month = date.getMonth();
  const day = date.getDate();

  React.useEffect(() => {
    setDisplayFooter(true);
  }, []);

  const [content, setContent] = React.useState([]);

  // Display the content with respecting the subtitles and the bodies.
  React.useEffect(() => {
    setContent(() =>
      contentArr.map((c, idx) => {
        if (idx % 2 === 0) {
          // this is a subtitle
          return (
            <h3 key={idx} className="single-blog--subtitle">
              {c}
            </h3>
          );
        } else {
          return (
            <p key={idx} className="single-blog--p">
              {c}
            </p>
          );
        }
      }),
    );
  }, []);

  return (
    <div className="single-blog--container">
      <div className="single-blog--all-title">
        <p className="blog-box-category">{category}</p>
        <h1 className="single-blog--title">{title}</h1>
      </div>

      <div className="blog-box--info author-date-single-blog">
        <p className="blog-box-author">{author}</p>
        <p className="blog-box-date">{`${months[month]} ${day}, ${year}`}</p>
      </div>

      <img className="single-blog--img" src={blog.image.image} alt={title} />

      <div>{content}</div>
    </div>
  );
}
