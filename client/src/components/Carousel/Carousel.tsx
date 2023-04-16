import React, { useState, useRef } from "react";
import { FC } from "react";
import styles from "./Carousel.module.css";

type CarouselProps = {
  items: React.ReactNode[];
};

const Carousel: FC<CarouselProps> = ({ items }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const x = event.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 3;
      containerRef.current.scrollLeft = containerRef.current.scrollLeft - walk;
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setStartX(event.pageX - containerRef.current.offsetLeft);
      containerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  return (
    <div className={styles.carousel}>
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
        className={styles.slides}
      >
        {items.map((item, index) => (
          <div key={index} className={`${styles.slide}`}>
            {item}
          </div>
        ))}
      </div>
      <button className={styles.prev}>&#8249;</button>
      <button className={styles.next}>&#8250;</button>
    </div>
  );
};

export default Carousel;
