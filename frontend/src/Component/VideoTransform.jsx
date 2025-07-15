import burger from "../assets/video/Burger.mp4";
import pizza from "../assets/video/Pizza.mp4";
import Club_Sandwich from "../assets/video/Club_Sandwich.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const VideoTransform = ({ comment }) => {
  const vidList = [pizza, Club_Sandwich, burger];
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const videoRef = useRef([]);
  videoRef.current = [];

  const handleVidEnd = () => {
    setCurrentIndex((prev) => {
      return prev + 1 < vidList.length ? prev + 1 : 0;
    });
  };

  // useEffect(() => {
  //   const currentVideo = videoRef.current[currentIndex];
  //   setTimeout(
  //     () => {
  //       if (currentVideo && document.contains(currentVideo)) {
  //         currentVideo.play().catch((e) => {
  //           console.warn("Playback failed:", e);
  //         });
  //       }
  //     },
  //     currentIndex === 0 ? 0 : 1800
  //   );
  // }, [currentIndex]);

  // useGSAP(() => {
  //   const num = gsap.to(slideRef.current, {
  //     x: `-${currentIndex * 105}%`, //109 for the smalls, 5 for bigs
  //     duration: 2,
  //     ease: "power2.inOut",
  //   });
  // }, [currentIndex]);

  // useEffect(() => {
  //   const currentVideo = videoRef.current[currentIndex];
  //   if (comment) {
  //     if (currentVideo && document.contains(currentVideo)) {
  //       currentVideo.pause();
  //     }
  //   } else {
  //     if (currentVideo && document.contains(currentVideo)) {
  //       currentVideo.play().catch((e) => {
  //         console.warn("Playback failed:", e);
  //       });
  //     }
  //   }
  // }, [comment]);

  return (
    <div
      ref={slideRef}
      className="flex flex-row w-full h-full gap-5 active:opacity-80 transition-opacity duration-100"
    >
      {vidList.map((list, i) => (
        <video
          ref={(el) => (videoRef.current[i] = el)}
          playsInline
          muted
          key={i}
          preload="auto"
          onEnded={handleVidEnd}
          className="min-w-full rounded-2xl object-cover h-full"
        >
          <source src={list} type="video/mp4" />
        </video>
      ))}
      <div className="absolute self-end mb-1 p-[2px] left-1/2 -translate-x-1/2 flex justify-center items-center backdrop-blur-3xl rounded-full">
        {vidList.map((i) => (
          <span
            key={i}
            className="mx-[2px] py-[3px] px-[3px] bg-gray-200 rounded-full relative cursor-pointer"
          ></span>
        ))}
      </div>
    </div>
  );
};

export default VideoTransform;
