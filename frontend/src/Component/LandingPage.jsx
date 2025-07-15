import React, { useEffect, useRef, useState } from "react";
import menu from "../assets/icons/menu.svg";
import mode from "../assets/icons/moon.svg";
import globe from "../assets/icons/globe.svg";
import backgroundImg from "../assets/images/image.png";

const LandingPage = () => {
  const [langSelector, setLangSelector] = useState(false);
  const [primary, setPrimary] = useState("English");
  const [secondary, setSecondary] = useState("Tigrigna");
  const [tertiary, setTertiary] = useState("Amharic");
  const touchableOpacity =
    " active:bg-slate-500 transition-colors duration-100";
  const [modeInvert, setModeInvert] = useState("");
  const outBox = useRef();

  const handleOutSide = (event) => {
    if (outBox.current && !outBox.current.contains(event.target)) {
      setTimeout(() => {
        setLangSelector(false);
      }, 10);
    }
  };

  const handleMode = () => {
    setModeInvert(modeInvert ? "" : "invert-0");
  };

  useEffect(() => {
    if (!langSelector) return;
    document.addEventListener("touchstart", handleOutSide);

    return () => {
      document.removeEventListener("touchstart", handleOutSide);
    };
  }, [langSelector]);

  const handleLangSelector = () => {
    setTimeout(() => {
      setLangSelector(langSelector ? false : true);
    }, 200);
  };

  return (
    <div
      className="flex-1 rounded-b-[40px] shadow-[inset_0_-5px_10px_rgba(0,0,0,0.8)] z-50"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <nav className="flex justify-between p-2 sticky top-1 mx-2 -mb-2 z-10 bg-amber-900 shadow-md shadow-amber-950 rounded-xl">
        <img
          src={menu}
          width={28}
          height={28}
          alt="menu"
          className="active:opacity-50 transition-opacity duration-100"
        />
        <nav
          ref={outBox}
          onClick={handleLangSelector}
          className="flex flex-row gap-2"
        >
          <img
            src={globe}
            width={28}
            height={28}
            alt="globe"
            className="active:opacity-50 transition-opacity duration-100"
          />
          <div>
            <button className="text-xl text-center self-center z-20 active:opacity-50 transition-opacity duration-100">
              {primary}
            </button>
            {langSelector && (
              <div className="absolute bg-amber-700/80 rounded-md">
                <p
                  onClick={() => {
                    setPrimary(secondary), setSecondary(primary);
                  }}
                  className={`px-1 rounded-md ${touchableOpacity}`}
                >
                  {secondary}
                </p>
                <p
                  onClick={() => {
                    setPrimary(tertiary), setTertiary(primary);
                  }}
                  className={`px-1 rounded-md ${touchableOpacity} `}
                >
                  {tertiary}
                </p>
              </div>
            )}
          </div>
        </nav>
        <img
          onClick={handleMode}
          src={mode}
          width={28}
          height={28}
          alt="mode"
          className={`active:opacity-50 transition-opacity duration-100 invert opacity-90 ${modeInvert}`}
        />
      </nav>
      <div className="flex flex-col flex-1 justify-center items-center h-[250px] pb-5 top-0 ">
        <h2 className="text-5xl font-bold rounded-2xl backdrop-blur-md">
          Welcome
        </h2>
        <p className="text-2xl font-bold rounded-2xl backdrop-blur-md">to</p>
        <p className="text-5xl font-bold rounded-2xl backdrop-blur-md">3T</p>
      </div>
    </div>
  );
};

export default LandingPage;
