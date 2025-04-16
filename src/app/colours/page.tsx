"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./colours.module.css";
import { useOrder } from "@/context/orderContext";

export default function Home() {
  const router = useRouter();
  const { setOrder } = useOrder();
  const items = [
    { src: "../../../brun.jpg", text: "Brun" },
    { src: "../../../fuchsia.jpg", text: "Fuchsia" },
    { src: "../../../gul.jpg", text: "Gul" },
    { src: "../../../hvit.jpg", text: "Hvit" },
    { src: "../../../lyseblå.jpg", text: "Lyseblå" },
    { src: "../../../lysegrønn.jpg", text: "Lysegrønn" },
    { src: "../../../lysegrå.jpg", text: "Lysegrå" },
    { src: "../../../lyselilla.jpg", text: "Lyselilla" },
    { src: "../../../lyserosa.jpg", text: "Lyserosa" },
    { src: "../../../mellomblå.jpg", text: "Mellomblå" },
    { src: "../../../mellomlilla.jpg", text: "Mellomlilla" },
    { src: "../../../mellomrosa.jpg", text: "Mellomrosa" },
    { src: "../../../mørkeblå.jpg", text: "Mørkeblå" },
    { src: "../../../mørkegrønn.jpg", text: "Mørkegrønn" },
    { src: "../../../neongrønn.jpg", text: "Neongrønn" },
    { src: "../../../oransje.jpg", text: "Oransje" },
    { src: "../../../rød.jpg", text: "Rød" },
    { src: "../../../sjøgrønn.jpg", text: "Sjøgrønn" },
    { src: "../../../sort.jpg", text: "Sort" },
    { src: "../../../turkis.jpg", text: "Turkis" },
    { src: "../../../vinrød.jpg", text: "Vinrød" },
    { src: "../../../makersChoice.jpg", text: "Makers Choice" },
  ];
  

  const handleButtonClick = (item: { src: string; text: string }) => {
    setOrder((prev) => ({ ...prev, pattern: item }));
    router.push("/size");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Farge</h1>
      </section>

      <section className={styles.grid}>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.gridItem}
            onClick={() => handleButtonClick(item)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.src}
              alt={item.text}
              className={styles.photo}
            />
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
