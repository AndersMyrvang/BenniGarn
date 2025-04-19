// src/app/summary/page.tsx
"use client";

import React from "react";
import { useOrder } from "@/context/orderContext";
import { auth, db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import styles from "./summary.module.css";

export default function SummaryPage() {
  const { order } = useOrder();
  const user = auth.currentUser;
  const router = useRouter();

  const handleOrder = async () => {
    if (!user) {
      alert("Du må være logget inn for å bestille");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        user: user.displayName,
        email: user.email,
        width: order.width?.text,
        pattern: order.pattern?.text,
        colours: order.colours?.map((c) => c.text) || [],
        length: order.length,
        status: "bestilt",
        createdAt: serverTimestamp(),
      });
      alert("Bestilling sendt!");
      router.push("/thankYou");
    } catch (err: any) {
      alert("Noe gikk galt: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Sammendrag</h1>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          {/* Bredde */}
          <h2 className={styles.sectionTitle}>Bredde</h2>
          {order.width && (
            <>
              <img
                src={order.width.src}
                alt="Bredde"
                className={styles.image}
              />
              <p className={styles.text}>{order.width.text}</p>
            </>
          )}

          {/* Mønster */}
          <h2 className={styles.sectionTitle}>Mønster</h2>
          {order.pattern && (
            <>
              <img
                src={order.pattern.src}
                alt="Mønster"
                className={styles.image}
              />
              <p className={styles.text}>{order.pattern.text}</p>
            </>
          )}

          {/* Farge(r) */}
          <h2 className={styles.sectionTitle}>Farge(r)</h2>
          {order.colours && order.colours.length > 0 ? (
            <div className={styles.coloursContainer}>
              {order.colours.map((c, i) => (
                <div key={i} className={styles.colourItem}>
                  <img
                    src={c.src}
                    alt={c.text}
                    className={styles.colourImage}
                  />
                  <p className={styles.text}>{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.text}>Ingen farger valgt</p>
          )}

          {/* Lengde */}
          <h2 className={styles.sectionTitle}>Lengde</h2>
          <img
            src="/measure_illustration.png"
            alt="Mål håndledd"
            className={styles.image}
          />
          <p className={styles.text}>{order.length} cm</p>

          <button className={styles.button} onClick={handleOrder}>
            Bestill
          </button>
        </div>
      </section>
    </div>
  );
}
