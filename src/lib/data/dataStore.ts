import {
  User,
  UserUsage,
  BusinessDNA,
  Offer,
  Campaign,
  CreativeProject,
  ResultRecord,
  ActivityEvent,
  Subscription,
  ProcessedStripeEvent,
} from "../../types";
import { isFirebaseConfigured, db } from "./firebaseSetup";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const getProvider = () => {
  const provider = import.meta.env.DATABASE_PROVIDER || "local";
  const fallback = import.meta.env.DATABASE_FALLBACK_LOCAL === "true";
  const useFirebase = isFirebaseConfigured() && provider !== "local";

  return useFirebase ? "firebase" : fallback ? "local" : "disabled";
};

const getLocalKey = (type: string, userId: string) => `fm_${type}_${userId}`;

export const dataStore = {
  getProvider,
  // Profiles
  async getUserProfile(userId: string): Promise<User | null> {
    const provider = getProvider();
    if (provider === "firebase") {
      const snap = await getDoc(doc(db, "users", userId));
      return snap.exists() ? (snap.data() as User) : null;
    } else {
      const data = localStorage.getItem(`fm_user_${userId}`);
      return data ? JSON.parse(data) : null;
    }
  },

  async saveUserProfile(user: User): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await setDoc(doc(db, "users", user.id), user);
    } else {
      localStorage.setItem(`fm_user_${user.id}`, JSON.stringify(user));
    }
  },

  async updateUserProfile(
    userId: string,
    updates: Partial<User>,
  ): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await updateDoc(doc(db, "users", userId), updates);
    } else {
      const existing = await this.getUserProfile(userId);
      if (existing) {
        localStorage.setItem(
          `fm_user_${userId}`,
          JSON.stringify({ ...existing, ...updates }),
        );
      }
    }
  },

  // Usage
  async getUserUsage(userId: string): Promise<UserUsage | null> {
    const provider = getProvider();
    if (provider === "firebase") {
      const snap = await getDoc(doc(db, "users", userId, "usage", "current"));
      return snap.exists() ? (snap.data() as UserUsage) : null;
    } else {
      const data = localStorage.getItem(`fm_usage_${userId}`);
      return data ? JSON.parse(data) : null;
    }
  },

  async saveUserUsage(userId: string, usage: UserUsage): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await setDoc(doc(db, "users", userId, "usage", "current"), usage);
    } else {
      localStorage.setItem(`fm_usage_${userId}`, JSON.stringify(usage));
    }
  },

  // DNA
  async getBusinessDNA(userId: string): Promise<BusinessDNA | null> {
    const provider = getProvider();
    if (provider === "firebase") {
      const snap = await getDoc(
        doc(db, "users", userId, "businessDNA", "main"),
      );
      return snap.exists() ? (snap.data() as BusinessDNA) : null;
    } else {
      const data = localStorage.getItem(`fm_dna_${userId}`);
      return data ? JSON.parse(data) : null;
    }
  },

  async saveBusinessDNA(userId: string, dna: BusinessDNA): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await setDoc(doc(db, "users", userId, "businessDNA", "main"), dna);
    } else {
      localStorage.setItem(`fm_dna_${userId}`, JSON.stringify(dna));
    }
  },

  // Generic List/Save/Delete for Subcollections
  async _saveItem(
    userId: string,
    collectionName: string,
    id: string,
    data: any,
  ): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await setDoc(doc(db, "users", userId, collectionName, id), data);
    } else {
      const key = `fm_${collectionName}_${userId}`;
      const existingStr = localStorage.getItem(key);
      const existingItems = existingStr ? JSON.parse(existingStr) : [];
      const idx = existingItems.findIndex((item: any) => item.id === id);
      if (idx >= 0) existingItems[idx] = data;
      else existingItems.push(data);
      localStorage.setItem(key, JSON.stringify(existingItems));
    }
  },

  async _getItem(
    userId: string,
    collectionName: string,
    id: string,
  ): Promise<any> {
    const provider = getProvider();
    if (provider === "firebase") {
      const snap = await getDoc(doc(db, "users", userId, collectionName, id));
      return snap.exists() ? snap.data() : null;
    } else {
      const existingStr = localStorage.getItem(
        `fm_${collectionName}_${userId}`,
      );
      if (!existingStr) return null;
      const items = JSON.parse(existingStr);
      return items.find((item: any) => item.id === id) || null;
    }
  },

  async _listItems(userId: string, collectionName: string): Promise<any[]> {
    const provider = getProvider();
    if (provider === "firebase") {
      // requires an index if ordering is complex, we just get all for now
      const q = query(collection(db, "users", userId, collectionName));
      const snap = await getDocs(q);
      return snap.docs.map((doc) => doc.data());
    } else {
      const existingStr = localStorage.getItem(
        `fm_${collectionName}_${userId}`,
      );
      return existingStr ? JSON.parse(existingStr) : [];
    }
  },

  async _deleteItem(
    userId: string,
    collectionName: string,
    id: string,
  ): Promise<void> {
    const provider = getProvider();
    if (provider === "firebase") {
      await deleteDoc(doc(db, "users", userId, collectionName, id));
    } else {
      const key = `fm_${collectionName}_${userId}`;
      const existingStr = localStorage.getItem(key);
      if (!existingStr) return;
      const existingItems = JSON.parse(existingStr).filter(
        (i: any) => i.id !== id,
      );
      localStorage.setItem(key, JSON.stringify(existingItems));
    }
  },

  // Specific Models
  async listOffers(userId: string): Promise<Offer[]> {
    return this._listItems(userId, "offers");
  },
  async saveOffer(userId: string, offer: Offer): Promise<void> {
    return this._saveItem(userId, "offers", offer.id, offer);
  },
  async deleteOffer(userId: string, offerId: string): Promise<void> {
    return this._deleteItem(userId, "offers", offerId);
  },

  async listCampaigns(userId: string): Promise<Campaign[]> {
    return this._listItems(userId, "campaigns");
  },
  async saveCampaign(userId: string, campaign: Campaign): Promise<void> {
    return this._saveItem(userId, "campaigns", campaign.id, campaign);
  },
  async deleteCampaign(userId: string, campaignId: string): Promise<void> {
    return this._deleteItem(userId, "campaigns", campaignId);
  },

  async listZapMessages(userId: string): Promise<any[]> {
    return this._listItems(userId, "zapMessages");
  },
  async saveZapMessage(userId: string, msg: any): Promise<void> {
    return this._saveItem(userId, "zapMessages", msg.id, msg);
  },
  async deleteZapMessage(userId: string, msgId: string): Promise<void> {
    return this._deleteItem(userId, "zapMessages", msgId);
  },

  async listCreativeProjects(userId: string): Promise<CreativeProject[]> {
    return this._listItems(userId, "creativeProjects");
  },
  async saveCreativeProject(
    userId: string,
    proj: CreativeProject,
  ): Promise<void> {
    return this._saveItem(userId, "creativeProjects", proj.id, proj);
  },
  async deleteCreativeProject(userId: string, projId: string): Promise<void> {
    return this._deleteItem(userId, "creativeProjects", projId);
  },

  async listCustomers(userId: string): Promise<any[]> {
    return this._listItems(userId, "customers");
  },
  async saveCustomer(userId: string, cust: any): Promise<void> {
    return this._saveItem(userId, "customers", cust.id, cust);
  },
  async deleteCustomer(userId: string, custId: string): Promise<void> {
    return this._deleteItem(userId, "customers", custId);
  },

  async listResults(userId: string): Promise<ResultRecord[]> {
    return this._listItems(userId, "results");
  },
  async saveResult(userId: string, res: ResultRecord): Promise<void> {
    return this._saveItem(userId, "results", res.id, res);
  },

  async listCalendars(userId: string): Promise<any[]> {
    return this._listItems(userId, "calendars");
  },
  async saveCalendar(userId: string, cal: any): Promise<void> {
    return this._saveItem(userId, "calendars", cal.id, cal);
  },
  async deleteCalendar(userId: string, calId: string): Promise<void> {
    return this._deleteItem(userId, "calendars", calId);
  },

  async saveSubscription(userId: string, sub: Subscription): Promise<void> {
    return this._saveItem(userId, "subscriptions", "current", sub);
  },
  async getSubscription(userId: string): Promise<Subscription | null> {
    return this._getItem(userId, "subscriptions", "current");
  },
};
