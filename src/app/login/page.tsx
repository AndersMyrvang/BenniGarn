"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import styles from "./login.module.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (!user.emailVerified) {
          alert("Du må bekrefte e-posten din før du kan bruke appen.");
          return;
        }
        router.push("/");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  const handleSignUpWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("Display name is required!");
      return;
    }

    if (password.length < 12 || !/[a-zA-Z]/.test(password)) {
      alert("Passordet må være minst 12 tegn og inneholde bokstaver.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName,
        email,
        isAdmin: false,
      });

      await sendEmailVerification(userCredential.user);
      alert("Bekreftelsesmail er sendt. Sjekk innboksen din.");
      router.push("/verify");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLoginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        alert("Du må bekrefte e-posten din før du kan bruke appen.");
        return;
      }

      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Skriv inn e-posten din først");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("En e-post for tilbakestilling av passord er sendt!");
    } catch (error: any) {
      alert(error.message);
    }
  };


  const handleSignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName || "",
          email: user.email,
          isAdmin: false,
        });
      }

      alert("Logget inn med Google!");
      router.push("/");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Bennigarn</h1>
        <h2 className={styles.subtitle}>{isSignup ? "Opprett bruker" : "Logg inn"}</h2>

        <form onSubmit={isSignup ? handleSignUpWithEmail : handleLoginWithEmail} className={styles.form}>
          {isSignup && (
            <div>
              <label htmlFor="displayName" className={styles.label}>
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="Your display name"
                className={styles.input}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@domain.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isSignup && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.linkButton}
              style={{ marginTop: "0.5rem" }}
            >
              Glemt passord?
            </button>
          )}


          <button type="submit" className={styles.button}>
            {isSignup ? "Opprett konto" : "Logg inn"}
          </button>
        </form>

        <div className={styles.hrContainer}>
          <hr className={styles.hr} />
          <span className={styles.hrText}>eller fortsett med</span>
          <hr className={styles.hr} />
        </div>

        <button onClick={handleSignUpWithGoogle} className={styles.googleButton}>
          <svg className={styles.googleIcon} viewBox="0 0 533.5 544.3">
            <path fill="#4285F4" d="M533.5 278.4c0-15.2-1.2-29.8-3.5-44.1H272v83.6h146.7c-6.4 34.8-25.2 64.1-53.6 83.6v69h86.9c50.6-46.6 81.5-115.3 81.5-192.1z" />
            <path fill="#34A853" d="M272 544.3c72.3 0 133-23.9 177.4-64.9l-86.9-69c-24.2 16.3-55.1 26-90.5 26-69 0-127.4-46.6-148.3-109.2H33.5v68.3C77.1 490.2 169.2 544.3 272 544.3z" />
            <path fill="#FBBC05" d="M123.7 326.5c-6.5-19.4-10.3-40.1-10.3-61.5 0-21.4 3.8-42.1 10.3-61.5V135h-90.2A271.8 271.8 0 0 0 0 265c0 44.2 10.5 86 29.2 123.5l94.5-62z" />
            <path fill="#EA4335" d="M272 124.1c37.4 0 71 12.9 97.5 38.2l73.1-73.1C412.4 50.1 351.6 27 272 27 169.2 27 77.1 81.1 33.5 194.9l94.5 62C144.6 194.3 203 147.7 272 147.7z" />
          </svg>
          Google
        </button>

        <p className={styles.text}>
          {isSignup ? "Har du allerede en bruker?" : "Har du ikke bruker?"}{" "}
          <button className={styles.linkButton} onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Logg inn her" : "Opprett en konto"}
          </button>
        </p>

        <p className={styles.terms}>
          Ved å fortsette godtar du våre{" "}
          <a href="#">Vilkår</a> og{" "}
          <a href="#">Personvernregler</a>
        </p>
      </div>
    </div>
  );
}
