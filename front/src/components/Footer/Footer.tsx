import Link from "next/link";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link
        href="/legals"
        className={styles.footerRedirect}
        data-new-text="Mentions légales"
      >
        <span>Mentions Légales</span>
      </Link>
    </footer>
  );
};

export default Footer;
