import { FC, useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { Link } from "react-router-dom";

const NavBar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHamburger = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled && styles.scrolled} ${
          isOpen && styles.links
        }`}
      >
        <div
          onClick={handleHamburger}
          className={`${styles.hamburger} ${isOpen && styles.open} `}
        >
          <span
            className={`${isScrolled && styles.scrolled} ${
              styles.hamburgerTop
            }`}
          ></span>
          <span
            className={`${isScrolled && styles.scrolled} ${
              styles.hamburgerMid
            }`}
          ></span>
          <span
            className={`${isScrolled && styles.scrolled} ${
              styles.hamburgerBot
            }`}
          ></span>
        </div>
        <div className={styles.hack}>Hack Weekly Portal</div>
      </header>
      <div
        className={`${styles.hamburgerLinks} ${isOpen && styles.links}`}
      ></div>
    </>
  );
};

export default NavBar;
