import React from "react";
import BlogBoxUser from "../components/BlogBoxUser";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import { LoadingContext } from "../context/LoadingContext";
import { Alert } from "react-bootstrap";
import { UserBlogsContext } from "../context/UserBlogsContext";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

export default function Account({ setDisplayFooter }) {
  const { user } = useAuthContext();
  const { dispatch } = React.useContext(LoadingContext);
  const { userBlogs, dispatch: userBlogsDispatch } = React.useContext(UserBlogsContext);

  const [formData, setFormData] = React.useState(null);
  const [edit, setEdit] = React.useState([false, false]);
  const [fetched, setFetched] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isUpdated, setIsUpdated] = React.useState(false);
  const fileInputRef = React.useRef(null);
  const profileRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState("");
  const [currentProfile, setCurrentProfile] = React.useState("");
  const [invalidPic, setInvalidPic] = React.useState(false);

  React.useEffect(() => {
    setDisplayFooter(false);
  }, [setDisplayFooter]);

  const handleImageClick = () => {
    setInvalidPic(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result);
  };

  React.useEffect(() => {
    const getInfo = async () => {
      try {
        dispatch({ type: "LOAD" });
        const response = await fetch(`${API_URL}/user/info`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const json = await response.json();
        setFormData({ ...json, password: "", confirmPassword: "" });
      } catch (requestError) {
        console.log(requestError);
      } finally {
        dispatch({ type: "STOP_LOAD" });
      }
    };

    if (user) getInfo();
  }, [user, dispatch]);

  function handleChange(event) {
    setError("");
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  function handleEdit(section) {
    setError("");
    setEdit((previous) => previous.map((value, index) => (index === section ? !value : value)));
  }

  React.useEffect(() => {
    if (!fetched && formData) {
      setFetched(true);
      if (formData.profilePic) setCurrentProfile(formData.profilePic.image);
    }
  }, [formData, fetched]);

  React.useEffect(() => {
    if (formData) userBlogsDispatch({ type: "SET_BLOGS", blogs: formData.userBlogs || [] });
  }, [formData, userBlogsDispatch]);

  const uploadImage = async () => {
    try {
      await axios.post(
        "/user/uploadPic",
        { image: imageSrc },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } },
      );
      setIsUpdated(true);
      setCurrentProfile(imageSrc);
      setImageSrc("");
      setTimeout(() => setIsUpdated(false), 2500);
    } catch (requestError) {
      setInvalidPic(true);
    }
  };

  const updateInfo = async (event) => {
    const sectionName = event.currentTarget.name;
    let toSend;

    if (sectionName === "password") {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        setError(!formData.password ? "Enter a new password." : "The passwords do not match.");
        return;
      }
      toSend = { password: formData.password };
    } else {
      toSend = { first_name: formData.first_name, last_name: formData.last_name };
    }

    try {
      await axios.patch("/user/updateInfo", toSend, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      });
      setIsUpdated(true);
      setEdit([false, false]);
      profileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => setIsUpdated(false), 2500);
    } catch (requestError) {
      console.log(requestError);
    }
  };

  if (!fetched) return null;

  const displayedImage = imageSrc || currentProfile;
  const fullName = `${formData.first_name || ""} ${formData.last_name || ""}`.trim() || "BlogMix creator";

  return (
    <main className="account-page" ref={profileRef}>
      {isUpdated && (
        <Alert className="account-success" variant="success">
          <span className="material-symbols-rounded">check_circle</span>Profile updated successfully.
        </Alert>
      )}

      <section className="profile-hero">
        <div className="profile-hero__pattern" />
        <div className="profile-hero__content">
          <div className="profile-photo-wrap">
            <input accept="image/*" type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
            {displayedImage ? (
              <img src={displayedImage} alt={`${fullName} profile`} className="profile-img" />
            ) : (
              <span className="profile-placeholder">{fullName.charAt(0).toUpperCase()}</span>
            )}
            <button type="button" className="profile-photo-button" onClick={handleImageClick} aria-label="Change profile picture">
              <span className="material-symbols-rounded">photo_camera</span>
            </button>
          </div>

          <div className="profile-identity">
            <span className="section-eyebrow">Creator profile</span>
            <h1>{fullName}</h1>
            <p>{formData.email || user?.email || "Member of the BlogMix community"}</p>
            <div className="profile-stats">
              <div><strong>{userBlogs.length}</strong><span>Published</span></div>
              <div><strong>{userBlogs.reduce((sum, blog) => sum + (blog.likedby || []).length, 0)}</strong><span>Total likes</span></div>
            </div>
          </div>

          {imageSrc && (
            <div className="profile-image-actions">
              <button type="button" className="primary-button" onClick={uploadImage}>Save photo</button>
              <button type="button" className="text-button" onClick={() => setImageSrc("")}>Cancel</button>
            </div>
          )}
        </div>
        {invalidPic && <p className="form-error profile-image-error"><span className="material-symbols-rounded">error</span>Please choose a valid image.</p>}
      </section>

      <div className="account-layout">
        <section className="settings-card">
          <div className="settings-card__heading">
            <div>
              <span className="section-eyebrow">Account</span>
              <h2>Profile settings</h2>
              <p>Keep your public details and account security up to date.</p>
            </div>
            <span className="material-symbols-rounded settings-heading-icon">manage_accounts</span>
          </div>

          <div className="settings-section">
            <div className="settings-section__heading">
              <div>
                <h3>Personal information</h3>
                <p>This name appears on every story you publish.</p>
              </div>
              {!edit[0] ? (
                <button type="button" className="edit-section-button" onClick={() => handleEdit(0)}>
                  <span className="material-symbols-rounded">edit</span>Edit
                </button>
              ) : (
                <div className="settings-actions">
                  <button type="button" className="small-primary-button" onClick={updateInfo} name="name">Save</button>
                  <button type="button" className="small-secondary-button" onClick={() => handleEdit(0)}>Cancel</button>
                </div>
              )}
            </div>

            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="first_name">First name</label>
                {edit[0] ? (
                  <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                ) : (
                  <p>{formData.first_name}</p>
                )}
              </div>
              <div className="settings-field">
                <label htmlFor="last_name">Last name</label>
                {edit[0] ? (
                  <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                ) : (
                  <p>{formData.last_name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section__heading">
              <div>
                <h3>Password</h3>
                <p>Use a strong password you do not reuse elsewhere.</p>
              </div>
              {!edit[1] ? (
                <button type="button" className="edit-section-button" onClick={() => handleEdit(1)}>
                  <span className="material-symbols-rounded">lock_reset</span>Change
                </button>
              ) : (
                <div className="settings-actions">
                  <button type="button" className="small-primary-button" onClick={updateInfo} name="password">Save</button>
                  <button type="button" className="small-secondary-button" onClick={() => handleEdit(1)}>Cancel</button>
                </div>
              )}
            </div>

            <div className="settings-grid">
              <div className="settings-field">
                <label htmlFor="password">New password</label>
                {edit[1] ? (
                  <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter new password" />
                ) : (
                  <p>••••••••••••</p>
                )}
              </div>
              {edit[1] && (
                <div className="settings-field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat new password" />
                </div>
              )}
            </div>
            {edit[1] && error && <p className="form-error settings-error"><span className="material-symbols-rounded">error</span>{error}</p>}
          </div>
        </section>

        <section className="profile-stories-section">
          <div className="profile-stories-heading">
            <div>
              <span className="section-eyebrow">Your work</span>
              <h2>Published stories</h2>
              <p>Manage the content you have shared with the community.</p>
            </div>
            <Link className="primary-button" to="/write"><span className="material-symbols-rounded">add</span>New story</Link>
          </div>

          <div className="profile-stories-list">
            {userBlogs.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-rounded">edit_note</span>
                <h3>No published stories yet</h3>
                <p>Your stories will appear here after you publish them.</p>
              </div>
            ) : (
              userBlogs.map((blog) => <BlogBoxUser blog={blog} key={blog._id || blog.title} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
