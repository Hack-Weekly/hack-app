import React, { FC, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { Link, Outlet } from "react-router-dom";

import styles from "./NavBar.module.css";

const links = [
  {
    name: "Hack Weekly Portal",
    href: "/",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Teams",
    href: "/teams",
  },
];
const NavBar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className={clsx(styles.header, isScrolled && styles.scrolled)}>
        <div className={styles.container}>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className={styles.hamburger} type={"button"} aria-label="Open menu">
                <span />
                <span />
                <span />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={styles.overlay} />
              <Dialog.Content className={styles.content}>
                <Dialog.Title className={styles.title}>Menu</Dialog.Title>
                <nav className={styles.drawerNav}>
                  {links.map((link) => (
                    <Link to={link.href} key={link.name} className={styles.navlink}>
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <Dialog.Close asChild>
                  <button className={styles.close} aria-label="Close">
                    <IconX />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <nav className={styles.nav}>
            <div className={styles.left}>
              {links.map((link) => (
                <Link to={link.href} key={link.name} className={styles.navlink}>
                  {link.name}
                </Link>
              ))}
            </div>
            <Link to="/login" className={styles.getStarted}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default NavBar;
