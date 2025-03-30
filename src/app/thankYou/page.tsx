"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./thankYou.module.css";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Takk for bestillingen!</h1>
      </section>

      <section className={styles.content}>
        <p className={styles.text}>Vi har mottatt bestillingen din og begynner å lage armbåndet ditt snart ✨</p>
        <button className={styles.button} onClick={() => router.push("/")}>
          Tilbake til forsiden
        </button>
      </section>
    </div>
  );
}
