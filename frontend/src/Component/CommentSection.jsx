import send from "../assets/icons/send-svgrepo-com.svg";
import remove from "../assets/icons/remove-svgrepo-com.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";

const CommentSection = ({ renderId, commentId, setComment }) => {
  const mockComment = [
    [
      "Bereket Zeselassie",
      "this is a great burgssssssssssssssssssssssssssssssssssssssssssssssssgger. I like it",
    ],
    ["Daniel", "This is good!! nice!!"],
    ["kb", "good!!"],
    ["sami", "harifti!!"],
  ];
  const [slide, setSlide] = useState(renderId);
  const touchableOpacity = "active:opacity-80 transition-opacity duration-100";
  const handleRemove = () => {
    setTimeout(() => {
      setComment(false);
    }, 1000);
    setSlide(false);
  };

  useGSAP(() => {
    if (renderId) {
      if (slide) {
        gsap.to(`#${renderId}`, {
          top: 0,
          duration: 1,
          ease: "power2.inOut",
        });
      } else if (slide === false) {
        gsap.to(`#${renderId}`, {
          top: "100%",
          duration: 1,
          ease: "power2.inOut",
        });
      }
    }
  }, [renderId, slide]);

  return (
    <div
      id={commentId}
      className="flex h-full w-full justify-center items-end absolute z-30"
    >
      <img
        onClick={handleRemove}
        src={remove}
        width={20}
        height={20}
        className={`absolute top-1 right-1 z-10 ${touchableOpacity}`}
      />
      <div className="h-full w-full overflow-y-auto p-2 backdrop-blur-3xl">
        <h2 className="flex-1 font-bold border-b-2 border-black w-full text-xs items-center">
          Comments <i className="text-[8px] pl-1">845</i>
        </h2>
        {mockComment.map((n, i) => (
          <div
            key={i}
            className="flex flex-col backdrop-blur-3xl shadow-md min-h-5 max-w-fit rounded-md mt-1"
          >
            <h3 className=" max-h-4 w-full flex-1 text-start text-xs text-zinc-400/80 mb-[1px]">
              @{n[0]} &middot; <i className="text-[8px]">3 days ago</i>
            </h3>
            <p className="shadow-md bg-zinc-400/50 h-full min-w-fit flex-1 rounded-md text-[10px] ml-3 p-[3px] break-all">
              {n[1]}
            </p>
          </div>
        ))}

        <p className="text-center text-[8px] p-2 pb-5">End of Comments</p>
      </div>
      <div className="absolute gap-1 flex flex-row px-2 h-7 p-1 w-full">
        <input className="bg-white rounded-md h-full w-full px-2 text-sm " />
        <img
          src={send}
          alt="send"
          className={`h-full w-6 ${touchableOpacity}`}
        />
      </div>
    </div>
  );
};

export default CommentSection;
