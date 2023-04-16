import { FC, useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { Link, Outlet } from "react-router-dom";
import Button from "../Button/Button";

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
        <Link to="/">
          <div className={styles.hack}>Hack Weekly Portal</div>
        </Link>
        <Link to="/login">
          <Button
            className={`${styles.getStarted} ${isScrolled && styles.scrolled}`}
          >
            Get Started
          </Button>
        </Link>
      </header>
      <div
        className={`${styles.hamburgerLinks} ${isOpen && styles.links}`}
      ></div>
      <Outlet />
    </>
  );
};

export default NavBar;
