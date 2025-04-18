"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./width.module.css";
import { useOrder } from "@/context/orderContext";

export default function Home() {
  const router = useRouter();
  const { setOrder } = useOrder();
  const items = [
    { src: "../../../6tråder.jpg", text: "6 tråder" },
    { src: "../../../8tråder.jpg", text: "8 tråder" },
    { src: "../../../10tråder.jpg", text: "10 tråder" },
  ];

  const handleButtonClick =(item: { src: string; text: string }) => {
    setOrder((prev) => ({ ...prev, width: item }));
    router.push("/patterns");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Bredde</h1>
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
