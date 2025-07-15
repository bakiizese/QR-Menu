import review from "../assets/icons/comment.svg";
import like from "../assets/icons/like-trans.svg";
import liked from "../assets/icons/like-black.svg";
import { useState } from "react";

const Review = ({ commentId, setComment, setComment_id }) => {
  const [likeNum, setLikeNum] = useState(0);
  const [likeButton, setLikeButton] = useState(like);
  const touchableOpacity = "active:opacity-75 transition-opacity duration-100";

  const handleLikeClick = () => {
    setLikeNum((prev) => (likeButton === like ? prev + 1 : prev - 1));
    setLikeButton(likeButton === like ? liked : like);
  };
  const commentSection = () => {
    setComment(true);
    setComment_id(commentId);
  };

  return (
    <div className="flex z-10 absolute bottom-1 w-full justify-between px-1 items-end ">
      <div
        onClick={commentSection}
        className={`flex justify-center items-center backdrop-blur-3xl rounded-3xl ${touchableOpacity}`}
      >
        <img
          src={review}
          alt="reviews"
          width={20}
          height={20}
          className=" invert"
        />
        <p className="top-0 left-0 text-xs text-white px-1 ">845</p>
      </div>

      <div
        onClick={handleLikeClick}
        className={`flex justify-center items-center backdrop-blur-3xl rounded-3xl ${touchableOpacity}`}
      >
        <img
          src={likeButton}
          alt="likes"
          width={20}
          height={20}
          className="invert"
        />
        <p className="top-0 left-0 text-xs text-white px-1 ">{likeNum}</p>
      </div>
    </div>
  );
};

export default Review;
