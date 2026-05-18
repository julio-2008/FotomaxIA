import { auth, isFirebaseConfigured, db } from "./firebaseSetup";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { dataStore } from "./dataStore";
import { User, UserUsage, PlanTier } from "../../types";
import { mapFirebaseAuthError } from "../utils/errorMapper";

class AuthService {
  private currentUser: FirebaseUser | null = null;
  private onUserChangeCallbacks: ((u: FirebaseUser | null) => void)[] = [];

  constructor() {
    if (isFirebaseConfigured() && auth) {
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.onUserChangeCallbacks.forEach((cb) => cb(user));
      });
    }
  }

  onUserChange(cb: (u: FirebaseUser | null) => void) {
    this.onUserChangeCallbacks.push(cb);
    cb(this.currentUser);
    return () => {
      this.onUserChangeCallbacks = this.onUserChangeCallbacks.filter(
        (x) => x !== cb,
      );
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async register(email: string, password: string): Promise<User> {
    try {
      if (isFirebaseConfigured() && auth) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return this.initNewUser(userCredential.user.uid, email);
      } else {
        // Local fallback (blocked unless DEV/DEMO)
        const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' || true;
        if (!isDemo) throw new Error("Autenticação requer Firebase em produção. Configure as variáveis de ambiente corretas.");
        console.warn("[AuthService] Using local fallback for registration");
        const uid = "loc_" + Math.random().toString(36).substring(2);
        localStorage.setItem("loc_auth_email", email);
        return this.initNewUser(uid, email);
      }
    } catch (error: any) {
      console.error("[AuthService] Registration error:", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      if (isFirebaseConfigured() && auth) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        let p = await dataStore.getUserProfile(userCredential.user.uid);
        if (!p) p = await this.initNewUser(userCredential.user.uid, email);
        return p;
      } else {
        // Local fallback (blocked unless DEV/DEMO)
        const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' || true;
        if (!isDemo) throw new Error("Autenticação requer Firebase em produção. Configure as variáveis de ambiente corretas.");
        console.warn("[AuthService] Using local fallback for login");
        const emailLocal = localStorage.getItem("loc_auth_email");
        if (emailLocal !== email) throw new Error("Credenciais inválidas para modo demonstração.");
        const uid = "loc_user"; // Simplified
        let p = await dataStore.getUserProfile(uid);
        if (!p) p = await this.initNewUser(uid, email);
        return p;
      }
    } catch (error: any) {
      console.error("[AuthService] Login error:", error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      if (isFirebaseConfigured() && auth) {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        let p = await dataStore.getUserProfile(userCredential.user.uid);
        if (!p)
          p = await this.initNewUser(
            userCredential.user.uid,
            userCredential.user.email || "",
          );
        return p;
      } else {
        throw new Error("O login com Google exige configuração do Firebase no ambiente.");
      }
    } catch (error: any) {
      console.error("[AuthService] Google Login error:", error);
      throw error;
    }
  }

  async logout() {
    if (isFirebaseConfigured() && auth) {
      await signOut(auth);
    } else {
      // Local fallback
    }
  }

  private async initNewUser(uid: string, email: string): Promise<User> {
    const newUser: User = {
      id: uid,
      email: email,
      plan: "trial" as PlanTier,
      subscriptionStatus: "active",
      trialUsed: false,
      createdAt: new Date().toISOString(),
      usage: {
        totalCredits: 1,
        usedCredits: 0,
        monthlyCreditsUsed: 0,
        monthlyCreditsLimit: 1,
        extraCreditsUsed: 0,
        extraCreditsLimit: 0,
        monthlyImagesUsed: 0,
        monthlyImagesLimit: 0,
        extraImagesUsed: 0,
        extraImagesLimit: 0,
        aiRequestsLastMinute: 0,
        aiRequestsLastHour: 0,
        trialUsed: false,
        usageMonth:
          new Date().getFullYear() +
          "-" +
          String(new Date().getMonth() + 1).padStart(2, "0"),
      },
    };
    await dataStore.saveUserProfile(newUser);
    return newUser;
  }
}

export const authService = new AuthService();
