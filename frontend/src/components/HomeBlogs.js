import React from "react";
import BlogBox from "./BlogBox";
import { Link } from "react-router-dom";

export default function HomeBlogs({ title, subtitle, blogs, addClass }) {
  const [showMore, setShowMore] = React.useState(false);
  const safeBlogs = Array.isArray(blogs) ? blogs : [];
  const visibleBlogs = showMore ? safeBlogs : safeBlogs.slice(0, 6);
  const noBlogs = safeBlogs.length === 0;

  return (
    <section className={`home-blogs--container${addClass ? ` ${addClass}` : ""}`}>
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Curated for you</span>
          <h2 className="home-blogs--title">{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {!noBlogs && (
          <Link className="secondary-button" to="/blogs">
            View all
            <span className="material-symbols-rounded">arrow_forward</span>
          </Link>
        )}
      </div>

      {noBlogs ? (
        <div className="empty-state">
          <span className="material-symbols-rounded">article</span>
          <h3>No stories yet</h3>
          <p>Fresh stories will appear here as soon as they are published.</p>
        </div>
      ) : (
        <div className="home-blogs">
          {visibleBlogs.map((blog) => <BlogBox key={blog._id || blog.title} blog={blog} />)}
        </div>
      )}

      {safeBlogs.length > 6 && (
        <button type="button" onClick={() => setShowMore((previous) => !previous)} className="text-button section-toggle">
          {showMore ? "Show fewer stories" : "Show more stories"}
          <span className="material-symbols-rounded">{showMore ? "expand_less" : "expand_more"}</span>
        </button>
      )}
    </section>
  );
}
