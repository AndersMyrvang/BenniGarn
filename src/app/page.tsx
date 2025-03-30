"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/width");
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>BenniGarn</h1>
      </section>
      <section className={styles.content}>
        <h4 className={styles.subtitle}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos sequi ratione cum maxime dolore nobis quos dicta eos, ab cumque tenetur dolorum corrupti cupiditate debitis possimus assumenda, commodi autem nesciunt?
        </h4>
        <button className={styles.button} onClick={handleButtonClick}>
          Bestill armbånd
        </button>
      </section>
    </div>
  );
}
