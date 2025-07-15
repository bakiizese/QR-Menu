import price from "../assets/icons/dollar-1189-svgrepo-com.svg";

import burgerImg from "../assets/images/foodiesfeed.com_juicy-cheeseburger.jpg";

import VideoTransform from "./VideoTransform";
import Review from "./Review";
import CommentSection from "./CommentSection";
import { useEffect, useState } from "react";

const ListMeal = ({ gridType }) => {
  const [comment, setComment] = useState(false);
  const [listWidth, setListWidth] = useState("w-full");
  const [comment_id, setComment_id] = useState();

  useEffect(() => {
    if (gridType === "grid") {
      setListWidth("[width:calc(50%-0.375rem)]");
    } else if (["list", "list_vid"].includes(gridType)) {
      setListWidth("w-full");
    }
    setComment(false);
    setComment_id("");
  }, [gridType]);

  return (
    <div className="flex flex-row gap-3 flex-wrap">
      {["list1", "list2", "list3", "list4", "list5", "list6", "list7"].map(
        (n, i) => (
          <div
            key={i}
            className={`flex flex-row relative ${listWidth} gap-3 mb-2`}
          >
            {["list"].includes(gridType) && (
              <>
                <div className="flex-1 relative active:opacity-80 transition-opacity duration-100 ">
                  <div
                    className="flex-[1] bg-center bg-cover h-36 w-full rounded-3xl flex items-center justify-center"
                    style={{ backgroundImage: `url(${burgerImg})` }}
                  >
                    <p className=" text-center max-w-32 break-words font-bold text-3xl text-white inline-block border-2 rounded backdrop-blur-[2px]">
                      {n}
                    </p>
                  </div>
                </div>
              </>
            )}

            {["list_vid", "list", "grid"].includes(gridType) && (
              <div className="flex-[1.5] h-36 relative rounded-2xl overflow-hidden">
                <div className="h-full w-full">
                  {["list_vid", "list"].includes(gridType) ? (
                    <VideoTransform comment={comment} />
                  ) : (
                    <div className="flex-1 relative active:opacity-80 transition-opacity duration-100">
                      <div
                        className="flex-[1] bg-center bg-cover h-36 w-full rounded-3xl flex items-center justify-center"
                        style={{ backgroundImage: `url(${burgerImg})` }}
                      >
                        <p className="text-center max-w-32 break-words font-bold text-3xl text-white inline-block border-2 rounded backdrop-blur-[2px]">
                          {n}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex">
                    <div className="absolute top-1 right-1 flex  backdrop-blur-3xl rounded-3xl ">
                      <img
                        src={price}
                        alt="price"
                        width={18}
                        height={18}
                        className="invert"
                      />
                      <p className="text-sm self-center text-white px-1">285</p>
                    </div>
                    <Review
                      commentId={n}
                      comment={comment}
                      setComment={setComment}
                      setComment_id={setComment_id}
                    />
                  </div>
                  {comment && n === comment_id && (
                    <CommentSection
                      renderId={comment_id}
                      commentId={n}
                      setComment={setComment}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ListMeal;
