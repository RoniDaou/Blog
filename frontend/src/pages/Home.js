import { API_URL } from "../config";
import HomeBlogs from "../components/HomeBlogs";
import RevealOnScroll from "../components/RevealOnScroll";
import { LoadingContext } from "../context/LoadingContext";
import React from "react";
import { LatestBlogsContext } from "../context/LatestBlogsContext";
import { PopularBlogsContext } from "../context/PopularBlogsContext";
import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

export default function Home({ setDisplayFooter }) {
  const { dispatch } = React.useContext(LoadingContext);
  const { latestBlogs, dispatch: latestBlogsDispatch } =
    React.useContext(LatestBlogsContext);
  const { popularBlogs, dispatch: popularBlogsDispatch } =
    React.useContext(PopularBlogsContext);
  const { user } = useAuthContext();

  React.useEffect(() => {
    setDisplayFooter(true);
  }, [setDisplayFooter]);

  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        dispatch({ type: "LOAD" });
        const [latestResponse, popularResponse] = await Promise.all([
          fetch(`${API_URL}/blogs`),
          fetch(`${API_URL}/blogs/popularBlogs`),
        ]);

        const [latestData, popularData] = await Promise.all([
          latestResponse.json(),
          popularResponse.json(),
        ]);

        if (latestResponse.ok) {
          latestBlogsDispatch({ type: "SET_BLOGS", blogs: latestData });
        }
        if (popularResponse.ok) {
          popularBlogsDispatch({ type: "SET_BLOGS", blogs: popularData });
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "STOP_LOAD" });
      }
    };

    fetchHomeData();
  }, [dispatch, latestBlogsDispatch, popularBlogsDispatch]);

  const featuredBlog = latestBlogs[0] || popularBlogs[0];
  const featuredExcerpt = Array.isArray(featuredBlog?.content)
    ? featuredBlog.content
        .find((item, index) => index % 2 === 1 && item)
        ?.slice(0, 190)
    : "";

  return (
    <main className="home--container">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="material-symbols-rounded">auto_awesome</span>A
            smarter home for great stories
          </span>
          <h1>
            Discover ideas that make you <em>pause, think, and connect.</em>
          </h1>
          <p>
            DailyBlog brings thoughtful voices into one modern reading
            experience. Explore fresh perspectives or share a story of your own.
          </p>
          <div className="hero-actions">
            <Link to="/blogs" className="primary-button">
              Explore stories
              <span className="material-symbols-rounded">arrow_forward</span>
            </Link>
            <Link
              to={user ? "/write" : "/signInUp"}
              className="secondary-button"
            >
              <span className="material-symbols-rounded">edit_square</span>
              {user ? "Start writing" : "Join the community"}
            </Link>
          </div>
          <div className="hero-proof">
            <div>
              <strong>{latestBlogs.length || "New"}</strong>
              <span>fresh stories</span>
            </div>
            <div>
              <strong>{popularBlogs.length || "Top"}</strong>
              <span>community picks</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>reader focused</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orb hero-orb--one" />
          <div className="hero-orb hero-orb--two" />
          {featuredBlog ? (
            <Link
              className="featured-story"
              state={{ blog: featuredBlog }}
              to="/blog"
            >
              <div
                className="featured-story__image"
                style={
                  featuredBlog.image?.image
                    ? { backgroundImage: `url(${featuredBlog.image.image})` }
                    : undefined
                }
              >
                <span>Featured story</span>
              </div>
              <div className="featured-story__content">
                <span className="featured-story__category">
                  {featuredBlog.category}
                </span>
                <h2>{featuredBlog.title}</h2>
                {featuredExcerpt && (
                  <p>
                    {featuredExcerpt}
                    {featuredExcerpt.length === 190 ? "…" : ""}
                  </p>
                )}
                <div className="featured-story__meta">
                  <span className="author-avatar">
                    {(featuredBlog.author || "A").charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{featuredBlog.author}</strong>
                    <span>Read the full story</span>
                  </div>
                  <span className="material-symbols-rounded featured-arrow">
                    north_east
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="featured-story featured-story--placeholder">
              <span className="material-symbols-rounded">menu_book</span>
              <h2>Your next favorite story is coming soon.</h2>
            </div>
          )}
        </div>
      </section>

      <RevealOnScroll>
        <HomeBlogs
          title="Latest stories"
          subtitle="Fresh perspectives from voices across the community."
          blogs={latestBlogs}
        />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeBlogs
          title="Popular this week"
          subtitle="The stories readers are engaging with most."
          blogs={popularBlogs}
          addClass="popular-blogs"
        />
      </RevealOnScroll>
    </main>
  );
}
