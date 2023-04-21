import {FC, useState, useEffect, useRef} from "react";
import styles from "./NavBar.module.css";
import { Link, Outlet } from "react-router-dom";
import Button from "../Button/Button";
import clsx from "clsx";

const NavBar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
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

    // close hamburger menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
        document.removeEventListener("click", handleClickOutside);
    }
    }, []);

  const handleHamburger = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <header
        className={clsx(styles.header, isScrolled && styles.scrolled, {[styles.links]:isOpen})}
      >
        <div
          onClick={handleHamburger}
          className={clsx(styles.hamburger, isOpen && styles.open)}
        >
          <span
            className={clsx(isScrolled && styles.scrolled, styles.hamburgerTop)}
          ></span>
          <span
            className={clsx(isScrolled && styles.scrolled, styles.hamburgerMid)}
          ></span>
          <span
            className={clsx(isScrolled && styles.scrolled, styles.hamburgerBot)}
          ></span>
        </div>
        <Link to="/">
          <div className={styles.hack}>Hack Weekly Portal</div>
        </Link>
        <Link to="/login">
          <Button
            className={clsx(styles.getStarted, isScrolled && styles.scrolled)}
          >
            Get Started
          </Button>
        </Link>
      </header>
      <div ref={menuRef}
        className={clsx(styles.hamburgerLinks, isOpen && styles.links)}
      ></div>
      <Outlet />
    </>
  );
};

export default NavBar;
