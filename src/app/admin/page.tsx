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
  orderBy
} from "firebase/firestore";
import styles from "./admin.module.css"; 

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return router.push("/");

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists() || !snap.data().isAdmin) {
        alert("Du har ikke tilgang til denne siden.");
        router.push("/");
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [user, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(fetched);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  if (!isAdmin) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin – Bestillinger</h1>
  
      <div>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <p className={styles.orderText}>
              <strong>{order.user}</strong> – {order.email}
            </p>
            <p className={styles.orderText}>
              Bredde: {order.width} | Mønster: {order.pattern} | Lengde: {order.length} cm
            </p>
            <p className={styles.orderText}>
              Status:
              <select
                className={styles.statusSelect}
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="bestilt">Bestilt</option>
                <option value="produksjon">Under produksjon</option>
                <option value="ferdig">Ferdig</option>
              </select>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  
}
