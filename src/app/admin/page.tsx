"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import {
  collection,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import styles from "./admin.module.css";

type OrderDoc = {
  id: string;
  user: string;
  email: string;
  width: string;
  widthSrc: string;
  pattern: string;
  patternSrc: string;
  colours: string[];
  coloursSrc: string[];
  mostColour?: string;
  length: number | string;
  status: string;
  createdAt: Timestamp;
};

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDoc | null>(null);
  const router = useRouter();
  const user = auth.currentUser;

  // 1) Check admin rights
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return router.push("/");

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists() || !(snap.data() as any).isAdmin) {
        alert("Du har ikke tilgang til denne siden.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [user, router]);

  // 2) Subscribe to orders
  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          user: data.user,
          email: data.email,
          width: data.width,
          widthSrc: data.widthSrc,
          pattern: data.pattern,
          patternSrc: data.patternSrc,
          colours: data.colours || [],
          coloursSrc: data.coloursSrc || [],
          mostColour: data.mostColour || "",
          length: data.length,
          status: data.status,
          createdAt: data.createdAt,
        };
      });
      setOrders(fetched);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // 3) Change status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  if (!isAdmin) return null;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Admin – Bestillinger</h1>
      </section>
      <div className={styles.list}>
        {orders.map((o) => {
          const date = o.createdAt.toDate().toLocaleString("no-NB");
          return (
            <div
              key={o.id}
              className={styles.orderCard}
              onClick={() => setSelectedOrder(o)}
            >
              <p className={styles.orderText}>
                <strong>{o.user}</strong> – {o.email}
              </p>
              <p className={styles.orderText}>
                <em>Bestilt:</em> {date}
              </p>
              <p className={styles.orderText}>
                Status:&nbsp;
                <select
                  className={styles.statusSelect}
                  value={o.status}
                  onChange={(e) =>
                    handleStatusChange(o.id, e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="bestilt">Bestilt</option>
                  <option value="produksjon">Under produksjon</option>
                  <option value="ferdig">Ferdig</option>
                </select>
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal for detaljer */}
      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2>Ordredetaljer</h2>
            <p>
              <strong>Bestilt:</strong>{" "}
              {selectedOrder.createdAt
                .toDate()
                .toLocaleString("no-NB")}
            </p>

            {/* Bredde */}
            <section className={styles.detailSection}>
              <h3>Bredde</h3>
              <img
                src={selectedOrder.widthSrc}
                alt={selectedOrder.width}
                className={styles.detailImage}
              />
              <p>{selectedOrder.width}</p>
            </section>

            {/* Mønster */}
            <section className={styles.detailSection}>
              <h3>Mønster</h3>
              <img
                src={selectedOrder.patternSrc}
                alt={selectedOrder.pattern}
                className={styles.detailImage}
              />
              <p>{selectedOrder.pattern}</p>
            </section>

            {/* Farge(r) */}
            <section className={styles.detailSection}>
              <h3>Farge(r)</h3>
              <div className={styles.colourList}>
                {selectedOrder.coloursSrc.map((src, i) => (
                  <div key={i} className={styles.colourItem}>
                    <img
                      src={src}
                      alt={selectedOrder.colours[i]}
                      className={styles.detailImage}
                    />
                    <p>{selectedOrder.colours[i]}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mest av */}
            <section className={styles.detailSection}>
              <h3>Mest av</h3>
              <p>{selectedOrder.mostColour || "Ikke angitt"}</p>
            </section>

            {/* Lengde */}
            <section className={styles.detailSection}>
              <h3>Lengde</h3>
              <p>{selectedOrder.length} cm</p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
