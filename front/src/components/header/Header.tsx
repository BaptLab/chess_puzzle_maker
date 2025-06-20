import Link from "next/link";
import styles from "./header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <Link
        href="/"
        className={styles.headerRedirect}
        data-new-text="Homepage"
      >
        <img
          className={styles.headerImg}
          alt="logo"
          src={
            "https://www.chesspuzzlemaker.com/favico-32x32.png"
          }
        />
        <h1>Chess Puzzle Maker</h1>
      </Link>
    </header>
  );
};

export default Header;
