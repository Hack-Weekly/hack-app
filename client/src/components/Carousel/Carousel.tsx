import React, { useState, useEffect } from "react";
import { FC } from "react";
import styles from "./Carousel.module.css";
import { CSSProperties } from "react";

type CarouselProps = {
  items: React.ReactNode[];
};

const Carousel: FC<CarouselProps> = ({ items }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [cardsPerScreen, setCardsPerScreen] = useState(() =>
    parseInt(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--cards-per-screen")
    )
  );
  const [progressBars, setProgressBars] = useState(() =>
    Math.ceil(items.length / cardsPerScreen)
  );

  // update variables in CSS file
  useEffect(() => {
    const handleResize = () => {
      setCardsPerScreen(
        parseInt(
          window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--cards-per-screen")
        )
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setProgressBars((prevState) => Math.ceil(items.length / cardsPerScreen));
  }, [cardsPerScreen, items]);

  // scroll buttons
  const handlePrev = () => {
    if (scrollIndex - 1 < 0) {
      setScrollIndex(progressBars - 1);
    } else {
      setScrollIndex((prevState) => prevState - 1);
    }
  };

  const handleNext = () => {
    if (scrollIndex + 1 > progressBars - 1) {
      setScrollIndex(0);
    } else {
      setScrollIndex((prevState) => prevState + 1);
    }
  };

  const createProgressBar = () => {
    const _progressBar = [];
    for (let i = 0; i < progressBars; i++) {
      _progressBar.push(i);
    }
    console.log("scrollIndex:", scrollIndex);
    console.log("_progressBar:", _progressBar);
    return _progressBar.map((el, index) => (
      <span
        key={index}
        className={scrollIndex === index ? styles.active : ""}
      ></span>
    ));
  };

  return (
    <div
      className={styles.carousel}
      style={{ "--scroll-index": scrollIndex } as CSSProperties}
    >
      <button
        onClick={handlePrev}
        className={`${styles.handle} ${styles.prev}`}
      >
        &#8249;
      </button>
      <div className={styles.slider}>
        {items.map((item, index) => (
          <div key={index} className={`${styles.slide}`}>
            {item}
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        className={`${styles.handle} ${styles.next}`}
      >
        &#8250;
      </button>
      <div className={styles.progressBar}>{createProgressBar()}</div>
    </div>
  );
};

export default Carousel;
