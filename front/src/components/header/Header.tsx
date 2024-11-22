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
        <h1>Chess Puzzle Maker</h1>
      </Link>
    </header>
  );
};

export default Header;
