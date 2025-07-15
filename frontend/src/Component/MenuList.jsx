import { use, useEffect, useRef, useState } from "react";
import filter from "../assets/icons/adjust-svgrepo-com.svg";
import search from "../assets/icons/search.svg";
import ListMeal from "./ListMeal";

import grid from "../assets/icons/view-grid-svgrepo-com.svg";
import list from "../assets/icons/list-svgrepo-com.svg";
import list_vid from "../assets/icons/list-button-svgrepo-com.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import backgroundImg from "../assets/images/image.png";

const gridDict = { list: list, grid: grid, list_vid: list_vid };

const MenuList = () => {
  const [inputVisible, setInputVisible] = useState(false);
  const [searchImgStyle, setSearchImgStyle] = useState("");
  const [gridType, setGridType] = useState("list");
  const gridTypes = ["grid", "list", "list_vid"];
  const [searchStr, setSearchStr] = useState("");
  const [changeSearch, setChangeSearch] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const touchableOpacity = "active:opacity-80 transition-opacity duration-100";
  const inputRef = useRef();
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = () => {
    if (!changeSearch) {
      setInputVisible(true);
      setSearchImgStyle("absolute right-0 p-1");
      setChangeSearch(true);
    } else {
      hideVis();
      setShowSearch(searchStr ? true : false);
    }
  };

  const hideVis = () => {
    setChangeSearch(false);
    setTimeout(() => {
      if (changeSearch) {
        setInputVisible(false);
        setSearchImgStyle("");
      }
    }, 550);
  };

  const outOfBox = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      hideVis();
    }
  };

  useEffect(() => {
    if (!inputVisible) return;

    document.addEventListener("touchstart", outOfBox);

    return () => {
      document.removeEventListener("touchstart", outOfBox);
    };
  }, [inputVisible]);

  const handleGrid = () => {
    setGridType(
      gridTypes.indexOf(gridType) + 1 >= gridTypes.length
        ? gridTypes[0]
        : gridTypes[gridTypes.indexOf(gridType) + 1]
    );
  };

  useGSAP(() => {
    if (inputVisible) {
      gsap.to("#searchAnim", {
        width: changeSearch ? "11rem" : "1.25rem",
        paddingLeft: 3,
        paddingRight: 6,
        duration: 0.7,
        ease: "power3.inout",
      });
    }
  }, [changeSearch]);

  useGSAP(() => {
    gsap.to("#filter", {
      height: showFilter ? "auto" : 0,
      duration: 1,
      ease: "power4",
    });
  }, [showFilter]);

  return (
    <div className="flex-1 py-1 bg-amber-800/40 backdrop-blur-3xl my-4 rounded-t-[30px]">
      <div className=" sticky top-2 mx-16 bg-amber-900 z-20 rounded-xl shadow-md shadow-amber-950">
        <nav className="flex justify-between py-2 px-2">
          <img
            onClick={() => {
              setShowFilter(showFilter ? false : true);
            }}
            src={filter}
            height={28}
            width={28}
            alt="filter"
            className={`${touchableOpacity}`}
          />
          <div ref={inputRef} className={`flex relative ${touchableOpacity}`}>
            {inputVisible && (
              <input
                id="searchAnim"
                className="w-7 h-full border-2 border-orange-500 text-center rounded-xl bg-zinc-400"
                type="text"
                autoFocus
                value={searchStr}
                onChange={(e) => setSearchStr(e.target.value)}
              />
            )}
            <img
              onClick={() => {
                handleSearch();
              }}
              src={search}
              height={28}
              width={28}
              alt="search"
              className={`${searchImgStyle} `}
            />
          </div>
          <img
            onClick={handleGrid}
            src={gridDict[gridType]}
            height={28}
            width={28}
            alt="gridlist"
            className={`${touchableOpacity}`}
          />
        </nav>
        {!inputVisible && showSearch && searchStr && (
          <p className="text-center -mt-3 py-1 ">Search: {searchStr}</p>
        )}
        <div
          id="filter"
          className="relative flex flex-col justify-center items-center overflow-hidden h-0"
        >
          <div className="flex flex-wrap min-h-fit justify-start bg-amber-950/60 p-2 mx-2 rounded-2xl ">
            {[1, 2, 3, 4, 5].map((n, i) => (
              <div key={i} className="mx-1">
                <input type="checkbox" id={n} />
                <label htmlFor={n} className="px-2">
                  breakfast
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setShowFilter(false);
            }}
            className="px-1 m-1  bg-amber-950/60 rounded-md active:opacity-80 transition-opacity duration-100"
          >
            search
          </button>
        </div>
      </div>
      <div className="pb-2 my-2 border-b-2 border-black px-2">
        <ListMeal gridType={gridType} />
      </div>
    </div>
  );
};

export default MenuList;
