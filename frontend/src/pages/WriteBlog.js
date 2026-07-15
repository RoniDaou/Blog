import React from "react";
import "../styles/write-blog.css";
import FormParagraph from "../components/FormParagraph";
import RevealOnScroll from "../components/RevealOnScroll";
import axios from "axios";
import { useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import Alert from "react-bootstrap/Alert";
import { API_URL } from "../config";

export default function WriteBlog({ setDisplayFooter }) {
  const location = useLocation();
  const prevBlog = location.state ? location.state.blog : null;
  const { user } = useAuthContext();

  React.useEffect(() => {
    setDisplayFooter(false);
  }, [setDisplayFooter]);

  const [categories, setCategories] = React.useState([]);
  const [formData, setFormData] = React.useState({ title: "", category: "" });
  const [content, setContent] = React.useState(["", ""]);
  const [paragraphs, setParagraphs] = React.useState([0]);
  const [paragraphsElement, setParagraphsElement] = React.useState([]);
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [error, setError] = React.useState("");

  const addBlog = async () => {
    try {
      await axios.post(
        `${API_URL}/blogs/createBlog`,
        { ...formData, content, image },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsUploaded(true);
      setFormData({ title: "", category: "" });
      setContent(["", ""]);
      setParagraphs([0]);
      setImage("");
      setTimeout(() => setIsUploaded(false), 2500);
    } catch (requestError) {
      setError("The cover image may be too large. Please choose a smaller file and try again.");
    }
  };

  const updateBlog = async () => {
    try {
      await axios.patch(
        `${API_URL}/blogs/updateBlog/${prevBlog._id}`,
        { ...formData, content },
        { headers: { Authorization: `Bearer ${user.token}` } },
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsUploaded(true);
      setTimeout(() => setIsUploaded(false), 2500);
    } catch (requestError) {
      setError("We could not save your changes. Please try again.");
    }
  };

  React.useEffect(() => {
    if (prevBlog) {
      setFormData({ title: prevBlog.title, category: prevBlog.category });
      setContent(prevBlog.content);
      setParagraphs(() => {
        const sections = [];
        for (let index = 0; index < prevBlog.content.length; index += 2) sections.push(index);
        return sections;
      });
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/`);
        const data = await response.json();
        setCategories(data);
      } catch (requestError) {
        console.log(requestError);
      }
    };

    fetchCategories();
  }, [prevBlog]);

  function handleChange(event) {
    setError("");
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function addParagraph() {
    setParagraphs((previous) => [...previous, previous[previous.length - 1] + 2]);
    setContent((previous) => [...previous, "", ""]);
  }

  function removeParagraph() {
    setParagraphsElement(() =>
      paragraphs.map((paragraph, index) => (
        <FormParagraph
          key={paragraph}
          id={paragraph}
          content={content}
          setContent={setContent}
          removeParagraph={removeParagraph}
          totalParagraphs={paragraphs[paragraphs.length - 1]}
          animation={index === paragraphs.length - 1 ? "fadeout" : "fadein"}
        />
      )),
    );

    setTimeout(() => {
      setParagraphs((previous) => previous.slice(0, -1));
      setContent((previous) => previous.slice(0, -2));
    }, 400);
  }

  React.useEffect(() => {
    setParagraphsElement(
      paragraphs.map((paragraph) => (
        <FormParagraph
          key={paragraph}
          id={paragraph}
          content={content}
          setContent={setContent}
          removeParagraph={removeParagraph}
          totalParagraphs={paragraphs[paragraphs.length - 1]}
          animation="fadein"
        />
      )),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paragraphs, content]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (prevBlog) {
      updateBlog();
      return;
    }

    if (!formData.title || !formData.category || !image) {
      setError("Please add a title, category, and cover image before publishing.");
      return;
    }

    addBlog();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result);
  };

  return (
    <main className="write-page">
      <RevealOnScroll>
        <header className="write-page__header">
          <div>
            <span className="section-eyebrow">Creator studio</span>
            <h1>{prevBlog ? "Edit your story" : "Create a new story"}</h1>
            <p>Shape your ideas into a polished article for the BlogMix community.</p>
          </div>
          <div className="editor-status">
            <span className="status-dot" />
            {prevBlog ? "Editing draft" : "New draft"}
          </div>
        </header>

        <div className="write-layout">
          <form className="form--container" onSubmit={handleSubmit}>
            {isUploaded && (
              <Alert className="editor-alert" variant="success">
                <span className="material-symbols-rounded">check_circle</span>
                {prevBlog ? "Your changes were saved successfully." : "Your story was published successfully."}
              </Alert>
            )}

            <section className="editor-card">
              <div className="editor-card__heading">
                <span className="editor-step">01</span>
                <div>
                  <h2>Story details</h2>
                  <p>Give readers a clear reason to open your story.</p>
                </div>
              </div>

              <div className="editor-field">
                <label htmlFor="title">Story title <span>*</span></label>
                <input
                  id="title"
                  type="text"
                  placeholder="Write a clear, engaging title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <small>{formData.title.length}/120 characters</small>
              </div>

              <div className="editor-field">
                <label htmlFor="category">Category <span>*</span></label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id || category.id || category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
            </section>

            {!prevBlog && (
              <section className="editor-card">
                <div className="editor-card__heading">
                  <span className="editor-step">02</span>
                  <div>
                    <h2>Cover image</h2>
                    <p>Choose a high-quality image that represents your story.</p>
                  </div>
                </div>

                <label className={`cover-upload${image ? " has-image" : ""}`}>
                  {image ? (
                    <img src={image} alt="Story cover preview" />
                  ) : (
                    <div className="cover-upload__empty">
                      <span className="material-symbols-rounded">add_photo_alternate</span>
                      <strong>Upload a cover image</strong>
                      <p>PNG or JPG. Use a wide image for the best result.</p>
                      <span className="secondary-button">Choose image</span>
                    </div>
                  )}
                  <input accept="image/*" type="file" onChange={handleFileChange} />
                  {image && <span className="cover-change-label"><span className="material-symbols-rounded">edit</span>Change image</span>}
                </label>
              </section>
            )}

            <section className="editor-card editor-card--content">
              <div className="editor-card__heading">
                <span className="editor-step">{prevBlog ? "02" : "03"}</span>
                <div>
                  <h2>Story content</h2>
                  <p>Build your story section by section for easy reading.</p>
                </div>
              </div>

              <div className="paragraphs-list">{paragraphsElement}</div>
              <button type="button" onClick={addParagraph} className="add-section-button">
                <span className="material-symbols-rounded">add</span>
                Add another section
              </button>
            </section>

            {error && <p className="form-error editor-error"><span className="material-symbols-rounded">error</span>{error}</p>}

            <div className="editor-submit-row">
              <p><span className="material-symbols-rounded">info</span>Your story will be visible to all readers after publishing.</p>
              <button className="primary-button publish-button" type="submit">
                <span className="material-symbols-rounded">{prevBlog ? "save" : "publish"}</span>
                {prevBlog ? "Save changes" : "Publish story"}
              </button>
            </div>
          </form>

          <aside className="editor-sidebar">
            <div className="editor-sidebar__card">
              <span className="material-symbols-rounded sidebar-icon">tips_and_updates</span>
              <h3>Publishing checklist</h3>
              <ul>
                <li><span className="material-symbols-rounded">check</span>Use a clear, specific title</li>
                <li><span className="material-symbols-rounded">check</span>Choose the most relevant category</li>
                <li><span className="material-symbols-rounded">check</span>Break long text into sections</li>
                <li><span className="material-symbols-rounded">check</span>Review spelling before publishing</li>
              </ul>
            </div>
            <div className="editor-sidebar__note">
              <span className="material-symbols-rounded">shield</span>
              <div>
                <strong>Your work stays yours.</strong>
                <p>You can edit or delete your published stories from your profile.</p>
              </div>
            </div>
          </aside>
        </div>
      </RevealOnScroll>
    </main>
  );
}
