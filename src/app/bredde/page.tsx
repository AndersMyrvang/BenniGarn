"use client";

import React from "react";
import styles from "./bredde.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Bredde</h1>
        </section>

        <section className={styles.grid}>
            {[
            { src: "../../../test.png", text: "Photo 1", link: "/page1" },
            { src: "../../../test.png", text: "Photo 2", link: "/page2" },
            { src: "../../../test.png", text: "Photo 3", link: "/page3" },
            { src: "../../../test.png", text: "Photo 4", link: "/page4" },
            { src: "../../../test.png", text: "Photo 5", link: "/page5" },
            { src: "../../../test.png", text: "Photo 6", link: "/page6" },
            ].map((item, index) => (
            <a key={index} href={item.link} className={styles.gridItem}>
                <img src={item.src} alt={item.text} className={styles.photo} />
                <p className={styles.text}>{item.text}</p>
            </a>
            ))}
        </section>
        
    </div>
  );
}
