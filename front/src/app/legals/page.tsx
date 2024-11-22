"use client";
import styles from "./legals.module.css";

import Header from "@/components/header/Header";
import { useRouter } from "next/navigation";

const Legals = () => {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section id="legals" className={styles.legals}>
          <div
            className={`section-container ${styles.sectionContainer}`}
          >
            <button
              onClick={() => router.push("/")}
              className={styles.backButton}
            >
              <span className={styles.backIcon}>←</span>
              Retour
            </button>

            <h2 className={styles.title}>
              Mentions Légales
            </h2>
            <div className={styles.legalContainer}>
              <h3 className={styles.sectionTitle}>
                Informations sur l'auto-entrepreneur
              </h3>
              <p>
                <strong>Nom de l'auto-entrepreneur:</strong>{" "}
                Baptiste LABAUNE
              </p>
              <p>
                <strong>Adresse e-mail:</strong>{" "}
                <a href="mailto:baptiste.labaune@gmail.com">
                  baptiste.labaune@gmail.com
                </a>
              </p>

              <h3 className={styles.sectionTitle}>
                Hébergement du site
              </h3>
              <p>
                <strong>Hébergeur:</strong> OVH
              </p>
              <p>
                <strong>Adresse:</strong> 2, rue Kellermann,
                59100 Roubaix, France
              </p>

              <h3 className={styles.sectionTitle}>
                Propriété intellectuelle
              </h3>
              <p>
                Le contenu de ce site, y compris mais sans
                s'y limiter, les textes, images, vidéos et
                éléments graphiques, est la propriété de
                Baptiste LABAUNE. Toute reproduction ou
                utilisation non autorisée est interdite.
              </p>

              <h3 className={styles.sectionTitle}>
                Collecte de données personnelles
              </h3>
              <p>
                Ce site ne fait l'objet d'aucune collecte de
                données personnelles.
              </p>

              <h3 className={styles.sectionTitle}>
                Cookies
              </h3>
              <p>
                Ce site ne fait l'usage d'aucun cookies.
              </p>

              <h3 className={styles.sectionTitle}>
                Liens externes
              </h3>
              <p>
                Ce site peut contenir des liens vers des
                sites externes pertinents pour les services
                proposés. Cependant, nous n'assumons aucune
                responsabilité quant au contenu de ces sites
                externes.
              </p>

              <h3 className={styles.sectionTitle}>
                Responsabilité
              </h3>
              <p>
                Nous nous efforçons de fournir des
                informations exactes et à jour sur ce site,
                mais nous ne pouvons garantir l'exactitude
                ou l'exhaustivité des informations fournies.
                En conséquence, nous déclinons toute
                responsabilité quant à l'utilisation qui
                pourrait être faite de ces informations.
              </p>

              <h3 className={styles.sectionTitle}>
                Modification des mentions légales
              </h3>
              <p>
                Nous nous réservons le droit de modifier ces
                mentions légales à tout moment. Les
                modifications prendront effet dès leur
                publication sur le site.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Legals;
