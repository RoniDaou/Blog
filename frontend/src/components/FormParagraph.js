import React from "react";

export default function FormParagraph({ id, content, setContent, removeParagraph, totalParagraphs, animation }) {
  const paragraphNumber = id / 2 + 1;

  function handleContent(event) {
    const fieldIndex = Number(event.target.dataset.index);
    const { value } = event.target;
    setContent((previous) => {
      const next = [...previous];
      next[fieldIndex] = value;
      return next;
    });
  }

  return (
    <section className={`form-paragraph ${animation}`}>
      <div className="form-paragraph__header">
        <div>
          <span className="paragraph-number">{String(paragraphNumber).padStart(2, "0")}</span>
          <div>
            <h3>Story section</h3>
            <p>Organize your article with a clear subtitle and body.</p>
          </div>
        </div>
        {totalParagraphs === id && id > 0 && (
          <button type="button" className="remove-section-button" onClick={removeParagraph} name={id}>
            <span className="material-symbols-rounded">delete</span>
            Remove
          </button>
        )}
      </div>

      <div className="editor-field">
        <label htmlFor={`subtitle-${id}`}>Subtitle</label>
        <input
          id={`subtitle-${id}`}
          data-index={id}
          type="text"
          placeholder="Give this section a clear heading"
          name={`subtitle${id}`}
          onChange={handleContent}
          value={content[id]}
        />
      </div>

      <div className="editor-field">
        <label htmlFor={`content-${id}`}>Body</label>
        <textarea
          id={`content-${id}`}
          data-index={id + 1}
          placeholder="Write the main content for this section..."
          name={`content${id}`}
          onChange={handleContent}
          value={content[id + 1]}
          rows="7"
        />
      </div>
    </section>
  );
}
