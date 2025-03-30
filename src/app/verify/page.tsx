"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { sendEmailVerification } from "firebase/auth";
import styles from "./verify.module.css";

export default function VerifyPage() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.emailVerified) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResend = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        setEmailSent(true);
      } catch (error: any) {
        alert("Noe gikk galt: " + error.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bekreft e-posten din</h1>
      <p className={styles.text}>
        En bekreftelseslink er sendt til e-posten din. Klikk på linken i mailen for å aktivere kontoen din.
      </p>
      <p className={styles.text}>
        Du kan lukke dette vinduet og logge inn etterpå.
      </p>

      <button className={styles.button} onClick={handleResend}>
        Send bekreftelsesmail på nytt
      </button>

      {emailSent && <p className={styles.text}>Ny bekreftelsesmail sendt ✅</p>}
    </div>
  );
}
