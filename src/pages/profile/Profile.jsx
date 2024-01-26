import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import swal from "sweetalert";
import PostList from "../../components/posts/PostList";
// import { posts } from "../../dummyData";
import {
  getUserProfile,
  uploadUserProfilePhoto,
} from "../../redux/apiCalls/userProfileApiCall";
import { getUserLikedProducts } from "../../redux/apiCalls/postsApiCall";
import UpdateProfileModel from "./UpdateProfileModel";
import UpdateProfileAddressModel from "./UpdateAddressModel";
import { postActions } from "../../redux/slices/postSlice";

import "./profile.css";

const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postActions.hideSearchBar());
  }, []);

  const { userProfile } = useSelector((state) => state.userProfile);
  const { userLikeProducts } = useSelector((state) => state.post);

  const [file, setFile] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updateProfileAddress, setUpdateProfileAddress] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getUserProfile(id));
    dispatch(getUserLikedProducts());
    window.scrollTo(0, 0);
  }, []);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("There is no Image!");
    const formData = new FormData();
    formData.append("image", file);

    dispatch(uploadUserProfilePhoto(formData));
  };

  const deleteAccountHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Account has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Changes are not saved");
      }
    });
  };
  const test = new Date();
  test.toISOString();
  return (
    <main className="profile">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={
              file ? URL.createObjectURL(file) : userProfile?.profilePhoto?.url
            }
            alt="profile"
            className="profile-image"
          />
          <form onSubmit={formSubmitHandler} className="profile-photo-form">
            <abbr title="choose profile photo">
              <label
                htmlFor="file"
                className="btn btn-alt upload-profile-photo-label"
              >
                Change photo
              </label>
            </abbr>
            <input
              className="upload-profile-photo-input"
              type="file"
              name="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit" className="btn upload-profile-photo-btn">
              Upload
            </button>
          </form>
        </div>
        <h1 className="profile-username">{userProfile?.username}</h1>
        <p className="profile-bio">{userProfile?.bio}</p>
        <div className="user-joined-date">
          <strong>Joined Date:</strong>{" "}
          <span>{new Date(userProfile?.createdAt).toDateString()}</span>
        </div>
        <div id="update-profile-btns">
          <button
            onClick={() => {
              setUpdateProfile(true);
            }}
            className="btn btn-alt update-profile-btn"
          >
            Update your account
          </button>
          <button
            onClick={() => {
              setUpdateProfileAddress(true);
            }}
            className="btn btn-alt update-profile-btn"
          >
            Update your address
          </button>
        </div>
      </div>
      <div id="orders-wishlist-container">
        <div className="profile-posts-list">
          <h2>Wishlist</h2>
          {/* TODO user orderList instead */}
          <PostList posts={userLikeProducts} />
        </div>
      </div>
      <button onClick={deleteAccountHandler} className="delete-account-btn">
        Delete Your Account
      </button>
      {updateProfile && (
        <UpdateProfileModel
          userProfile={userProfile}
          setUpdateProfile={setUpdateProfile}
        />
      )}
      {updateProfileAddress && (
        <UpdateProfileAddressModel
          userProfile={userProfile}
          setUpdateProfile={setUpdateProfileAddress}
        />
      )}
    </main>
  );
};

export default Profile;
