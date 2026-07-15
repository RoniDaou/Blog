import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/single-blog.css";
import months from "../data/months";

export default function SingleBlog({ setDisplayFooter }) {
  const location = useLocation();
  const blog = location.state?.blog;

  React.useEffect(() => {
    setDisplayFooter(true);
  }, [setDisplayFooter]);

  if (!blog) {
    return (
      <main className="single-blog--container single-blog--missing">
        <span className="material-symbols-rounded">article</span>
        <h1>This story is not available from a direct link.</h1>
        <p>Return to the story library and open it again.</p>
        <Link to="/blogs" className="primary-button">
          Browse stories
        </Link>
      </main>
    );
  }

  const {
    title,
    content: contentArr = [],
    category,
    author,
    datePublished,
  } = blog;
  const date = new Date(datePublished);
  const wordCount = contentArr
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="single-blog--container">
      <div className="article-breadcrumb">
        <Link to="/blogs">
          <span className="material-symbols-rounded">arrow_back</span>All
          stories
        </Link>
        <span>/</span>
        <span>{category}</span>
      </div>

      <article className="article-shell">
        <header className="single-blog--all-title">
          <span className="story-list-card__category">{category}</span>
          <h1 className="single-blog--title">{title}</h1>
          <p className="article-deck">
            A story shared with the DailyBlog community.
          </p>

          <div className="article-author-row">
            <span className="article-author-avatar">
              {(author || "A").charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{author}</strong>
              <span>
                {`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}{" "}
                · {readingTime} min read
              </span>
            </div>
          </div>
        </header>

        <div className="article-image-wrap">
          <img
            className="single-blog--img"
            src={blog.image?.image}
            alt={title}
          />
        </div>

        <div className="article-layout">
          <aside className="article-aside">
            <span>Story</span>
            <strong>{readingTime} min</strong>
            <span>{(blog.likedby || []).length} likes</span>
          </aside>

          <div className="article-content">
            {contentArr.map((item, index) =>
              index % 2 === 0 ? (
                <h2 key={index} className="single-blog--subtitle">
                  {item}
                </h2>
              ) : (
                <p key={index} className="single-blog--p">
                  {item}
                </p>
              ),
            )}
          </div>
        </div>

        <footer className="article-end">
          <span className="material-symbols-rounded">auto_stories</span>
          <div>
            <strong>Thanks for reading.</strong>
            <p>Keep exploring perspectives from the DailyBlog community.</p>
          </div>
          <Link to="/blogs" className="secondary-button">
            Explore more
          </Link>
        </footer>
      </article>
    </main>
  );
}
