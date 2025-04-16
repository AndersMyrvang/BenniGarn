"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./patterns.module.css";
import { useOrder } from "@/context/orderContext";

export default function Home() {
  const router = useRouter();
  const { setOrder } = useOrder();
  const items = [
    { src: "../../../test.png", text: "Photo 1" },
    { src: "../../../test.png", text: "Photo 2" },
    { src: "../../../test.png", text: "Photo 3" },
    { src: "../../../test.png", text: "Photo 4" },
    { src: "../../../test.png", text: "Photo 5" },
    { src: "../../../test.png", text: "Photo 6" },
  ];

  const handleButtonClick = (item: { src: string; text: string }) => {
    setOrder((prev) => ({ ...prev, pattern: item }));
    router.push("/colours");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Mønster</h1>
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
