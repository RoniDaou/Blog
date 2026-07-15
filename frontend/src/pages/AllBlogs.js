import React from "react";
import { LoadingContext } from "../context/LoadingContext";
import SearchBar from "../components/SearchBar";
import BlogBoxAll from "../components/BlogBoxAll";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { API_URL } from "../config";

export default function AllBlogs({ setDisplayFooter }) {
  const { dispatch } = React.useContext(LoadingContext);
  const { latestBlogs, dispatch: blogsDispatch } = React.useContext(LatestBlogsContext);

  React.useEffect(() => {
    setDisplayFooter(true);
  }, [setDisplayFooter]);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        dispatch({ type: "LOAD" });
        const response = await fetch(`${API_URL}/blogs/`);
        const data = await response.json();
        if (response.ok) {
          blogsDispatch({ type: "SET_BLOGS", blogs: data });
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "STOP_LOAD" });
      }
    };

    fetchLatest();
  }, [dispatch, blogsDispatch]);

  return (
    <main className="all-blogs--container">
      <header className="page-intro">
        <span className="section-eyebrow">Explore BlogMix</span>
        <div className="page-intro__row">
          <div>
            <h1>Stories for every curiosity.</h1>
            <p>Search the full collection and find perspectives that match your interests.</p>
          </div>
          <div className="results-count">
            <strong>{latestBlogs.length}</strong>
            <span>{latestBlogs.length === 1 ? "story" : "stories"}</span>
          </div>
        </div>
      </header>

      <SearchBar />

      <section className="all-blogs" aria-live="polite">
        {latestBlogs.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-rounded">search_off</span>
            <h2>No matching stories</h2>
            <p>Try a different title or category to broaden your search.</p>
          </div>
        ) : (
          latestBlogs.map((blog) => <BlogBoxAll key={blog._id || blog.title} blog={blog} />)
        )}
      </section>
    </main>
  );
}
