import { useState, useEffect, useCallback } from "react";
import {
  User,
  Campaign,
  BusinessSettings,
  PlanTier,
  UserUsage,
  BusinessProfile,
  AI_ACTION_COSTS,
  BusinessDNA,
  Offer,
  SalesCalendar,
  CreativeProject,
  LibraryTemplate,
  OnboardingProfile,
  ActivationChecklist,
  CreditLedgerEntry,
  UserFeedback,
  BetaLead
} from "../types";
import { PLAN_LIMITS, ADMIN_EMAILS } from "../constants";

export function useStorage() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("cp_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null; // fallback
      }
    }
    return null;
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [calendars, setCalendars] = useState<SalesCalendar[]>([]);
  const [creatives, setCreatives] = useState<CreativeProject[]>([]);
  const [libraryFavorites, setLibraryFavorites] = useState<string[]>([]);
  const [customTemplates, setCustomTemplates] = useState<LibraryTemplate[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [activityEvents, setActivityEvents] = useState<any[]>([]);
  const [resultRecords, setResultRecords] = useState<any[]>([]);
  const [creditLedger, setCreditLedger] = useState<CreditLedgerEntry[]>([]);
  const [learningProfile, setLearningProfile] = useState<any>(null);
  const [onboardingProfile, setOnboardingProfile] =
    useState<OnboardingProfile | null>(null);
  const [activationChecklist, setActivationChecklist] =
    useState<ActivationChecklist | null>(null);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [pendingActivations, setPendingActivations] = useState<any[]>([]);

  useEffect(() => {
    // Sincronizar com Stripe no backend ao carregar
    if (user) {
      // Dont sync the default mock user
      const syncSubscription = async () => {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || "";
          const res = await fetch(
            `${baseUrl}/api/stripe/user-subscription?userId=${user.id}`,
          );
          if (res.ok) {
            const data = await res.json();
            if (data.subscription) {
              const sub = data.subscription;
              setUser((prev) => {
                if (!prev) return prev;
                // If something changed, update
                if (
                  prev.plan !== sub.plan ||
                  prev.subscriptionStatus !== sub.status
                ) {
                  const updated = {
                    ...prev,
                    plan: sub.plan as PlanTier,
                    subscriptionStatus: sub.status as any,
                    stripeCustomerId: sub.stripeCustomerId,
                    stripeSubscriptionId: sub.stripeSubscriptionId,
                    stripePriceId: sub.stripePriceId,
                    currentPeriodEnd: sub.currentPeriodEnd,
                    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
                  };
                  localStorage.setItem("cp_user", JSON.stringify(updated));
                  import("../lib/data/dataStore").then(({ dataStore }) => {
                    dataStore.saveUserProfile(updated).catch(console.error);
                  });
                  return updated;
                }
                return prev;
              });
            }
          }
        } catch (e) {
          console.error("Failed to sync sub", e);
        }
      };
      syncSubscription();
    }
  }, [user?.id]); // Only re-run if ID changes

  const isAdmin = useCallback(() => {
    if (!user) return false;
    return ADMIN_EMAILS.includes(user.email);
  }, [user]);

  const getCurrentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const getInitialUsage = (): UserUsage => ({
    currentMonthCampaigns: 0,
    monthlyCreditsUsed: 0,
    monthlyCreditsLimit: 1,
    extraCreditsUsed: 0,
    extraCreditsLimit: 0,
    monthlyImagesUsed: 0,
    monthlyImagesLimit: 0,
    extraImagesUsed: 0,
    extraImagesLimit: 0,
    usageMonth: getCurrentMonth(),
    totalCredits: 1,
    usedCredits: 0,
    aiRequestsLastMinute: 0,
    aiRequestsLastHour: 0,
    trialUsed: false,
  });

  const checkAndResetUsage = useCallback((u: User): User => {
    const currentMonth = getCurrentMonth();
    if (u.usage.usageMonth !== currentMonth) {
      return {
        ...u,
        usage: {
          ...u.usage,
          currentMonthCampaigns: 0,
          usageMonth: currentMonth,
          usedCredits: 0,
          aiRequestsLastMinute: 0,
          aiRequestsLastHour: 0,
        },
      };
    }
    return u;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      // Carregar user localmente primeiro se houver, ou verificar auth
      // Precisamos da lib dataStore
      const { dataStore } = await import("../lib/data/dataStore");
      const savedUserStr = localStorage.getItem("cp_user"); // just to get userId for now, next we do FirebaseAuth
      let currentUser = null;
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr) as User;
        const fromDb = await dataStore.getUserProfile(u.id);
        if (fromDb) {
          currentUser = fromDb;
        } else {
          currentUser = u;
        }
      }

      const uid = currentUser?.id;
      if (uid) {
        try {
          // Basic migration of leftover local-only data if dataStore is firebase and empty
          const migrateIfNeeded = async () => {
            const { dataStore } = await import("../lib/data/dataStore");
            if (dataStore.getProvider() !== "firebase") return;

            // Check if we already migrated
            if (localStorage.getItem(`cp_migrated_${uid}`)) return;

            const locCamp = localStorage.getItem("cp_campaigns");
            if (locCamp) {
              const parsed = JSON.parse(locCamp);
              for (const c of parsed) await dataStore.saveCampaign(uid, c);
            }

            const locOff = localStorage.getItem("cp_offers");
            if (locOff) {
              const parsed = JSON.parse(locOff);
              for (const o of parsed) await dataStore.saveOffer(uid, o);
            }

            const locCrea = localStorage.getItem("cp_creatives");
            if (locCrea) {
              const parsed = JSON.parse(locCrea);
              for (const c of parsed)
                await dataStore.saveCreativeProject(uid, c);
            }

            const locResults = localStorage.getItem("cp_result_records");
            if (locResults) {
              const parsed = JSON.parse(locResults);
              for (const r of parsed) await dataStore.saveResult(uid, r);
            }

            const locCalendars = localStorage.getItem("cp_calendars");
            if (locCalendars) {
              const parsed = JSON.parse(locCalendars);
              for (const c of parsed) await dataStore.saveCalendar(uid, c);
            }

            localStorage.setItem(`cp_migrated_${uid}`, "true");
          };

          await migrateIfNeeded();

          const [
            dbCampaigns,
            dbOffers,
            dbCalendars,
            dbCreatives,
            dbResults,
            dbActivities,
          ] = await Promise.all([
            dataStore.listCampaigns(uid),
            dataStore.listOffers(uid),
            dataStore.listCalendars(uid),
            dataStore.listCreativeProjects(uid),
            dataStore.listResults(uid),
            Promise.resolve([]), // activity events
          ]);

          if (isMounted) {
            setCampaigns(dbCampaigns || []);
            setOffers(dbOffers || []);
            setCalendars(dbCalendars || []);
            setCreatives(dbCreatives || []);
            setResultRecords(dbResults || []);
            // activities...
          }
        } catch (e) {
          console.error("Failed to load real data", e);
        }
      }

      // Load other things from local just to not break immediately
      const savedFavs = localStorage.getItem("cp_library_favorites");
      const savedCustomTemplates = localStorage.getItem("cp_custom_templates");
      const savedDiagnoses = localStorage.getItem("cp_diagnoses");
      const savedLearningProfile = localStorage.getItem("cp_learning_profile");
      const savedOnboarding = localStorage.getItem("cp_onboarding");
      const savedChecklist = localStorage.getItem("cp_checklist");
      const savedSettings = localStorage.getItem("cp_settings");
      const savedPending = localStorage.getItem("cp_pending_activations");
      const savedCalendars = localStorage.getItem("cp_calendars");
      const savedLedger = localStorage.getItem("fotomax_ledger");
      const savedFeedbacks = localStorage.getItem("fotomax_feedbacks");

      if (isMounted) {
        if (savedFavs) setLibraryFavorites(JSON.parse(savedFavs));
        if (savedCustomTemplates)
          setCustomTemplates(JSON.parse(savedCustomTemplates));
        if (savedDiagnoses) setDiagnoses(JSON.parse(savedDiagnoses));
        if (savedLearningProfile)
          setLearningProfile(JSON.parse(savedLearningProfile));
        if (savedOnboarding) setOnboardingProfile(JSON.parse(savedOnboarding));
        if (savedChecklist) setActivationChecklist(JSON.parse(savedChecklist));
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedPending) setPendingActivations(JSON.parse(savedPending));
        if (savedCalendars) setCalendars(JSON.parse(savedCalendars));
        if (savedLedger) setCreditLedger(JSON.parse(savedLedger));
        if (savedFeedbacks) setFeedbacks(JSON.parse(savedFeedbacks));
      }

      if (currentUser && isMounted) {
        if (!currentUser.usage) currentUser.usage = getInitialUsage();
        const refreshedUser = checkAndResetUsage(currentUser);
        if (refreshedUser !== currentUser) {
          await dataStore.saveUserProfile(refreshedUser);
        }
        setUser(refreshedUser);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [checkAndResetUsage]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cp_user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("fotomax_ledger", JSON.stringify(creditLedger));
  }, [creditLedger]);

  useEffect(() => {
    localStorage.setItem("fotomax_feedbacks", JSON.stringify(feedbacks));
  }, [feedbacks]);

  const saveUser = (u: User | null) => {
    if (u) {
      const refreshed = checkAndResetUsage(u);
      localStorage.setItem("cp_user", JSON.stringify(refreshed));
      setUser(refreshed);
      // Fire-and-forget save to dataStore
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveUserProfile(refreshed).catch(console.error);
      });
    } else {
      localStorage.removeItem("cp_user");
      setUser(null);
    }
  };

  const saveCampaign = (c: Campaign) => {
    const existingIndex = campaigns.findIndex((x) => x.id === c.id);
    let newList;
    if (existingIndex >= 0) {
      newList = [...campaigns];
      newList[existingIndex] = c;
    } else {
      newList = [c, ...campaigns];
    }
    localStorage.setItem("cp_campaigns", JSON.stringify(newList));
    setCampaigns(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveCampaign(user.id, c).catch(console.error);
      });
    }
  };

  const deleteCampaign = (id: string) => {
    const newList = campaigns.filter((c) => c.id !== id);
    localStorage.setItem("cp_campaigns", JSON.stringify(newList));
    setCampaigns(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.deleteCampaign(user.id, id).catch(console.error);
      });
    }
  };

  const saveOffer = (o: Offer) => {
    const existingIndex = offers.findIndex((x) => x.id === o.id);
    let newList;
    if (existingIndex >= 0) {
      newList = [...offers];
      newList[existingIndex] = o;
    } else {
      newList = [o, ...offers];
    }
    localStorage.setItem("cp_offers", JSON.stringify(newList));
    setOffers(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveOffer(user.id, o).catch(console.error);
      });
    }
  };

  const deleteOffer = (id: string) => {
    const newList = offers.filter((o) => o.id !== id);
    localStorage.setItem("cp_offers", JSON.stringify(newList));
    setOffers(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.deleteOffer(user.id, id).catch(console.error);
      });
    }
  };

  const saveCreative = (c: CreativeProject) => {
    const existingIndex = creatives.findIndex((x) => x.id === c.id);
    let newList;
    if (existingIndex >= 0) {
      newList = [...creatives];
      newList[existingIndex] = c;
    } else {
      newList = [c, ...creatives];
    }
    localStorage.setItem("cp_creatives", JSON.stringify(newList));
    setCreatives(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveCreativeProject(user.id, c).catch(console.error);
      });
    }
  };

  const deleteCreative = (id: string) => {
    const newList = creatives.filter((c) => c.id !== id);
    localStorage.setItem("cp_creatives", JSON.stringify(newList));
    setCreatives(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.deleteCreativeProject(user.id, id).catch(console.error);
      });
    }
  };

  const saveCalendar = (cal: SalesCalendar) => {
    const existingIndex = calendars.findIndex((x) => x.id === cal.id);
    let newList;
    if (existingIndex >= 0) {
      newList = [...calendars];
      newList[existingIndex] = cal;
    } else {
      newList = [cal, ...calendars];
    }
    localStorage.setItem("cp_calendars", JSON.stringify(newList));
    setCalendars(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveCalendar(user.id, cal).catch(console.error);
      });
    }
  };

  const deleteCalendar = (id: string) => {
    const newList = calendars.filter((c) => c.id !== id);
    localStorage.setItem("cp_calendars", JSON.stringify(newList));
    setCalendars(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.deleteCalendar(user.id, id).catch(console.error);
      });
    }
  };

  const toggleLibraryFavorite = (id: string) => {
    let newList;
    if (libraryFavorites.includes(id)) {
      newList = libraryFavorites.filter((favId) => favId !== id);
    } else {
      newList = [...libraryFavorites, id];
    }
    localStorage.setItem("cp_library_favorites", JSON.stringify(newList));
    setLibraryFavorites(newList);
  };

  const saveCustomTemplate = (template: LibraryTemplate) => {
    const existingIndex = customTemplates.findIndex(
      (x) => x.id === template.id,
    );
    let newList;
    if (existingIndex >= 0) {
      newList = [...customTemplates];
      newList[existingIndex] = template;
    } else {
      newList = [template, ...customTemplates];
    }
    localStorage.setItem("cp_custom_templates", JSON.stringify(newList));
    setCustomTemplates(newList);
  };

  const deleteCustomTemplate = (id: string) => {
    const newList = customTemplates.filter((c) => c.id !== id);
    localStorage.setItem("cp_custom_templates", JSON.stringify(newList));
    setCustomTemplates(newList);
  };

  const saveDiagnosis = (d: any) => {
    const existingIndex = diagnoses.findIndex((x) => x.id === d.id);
    let newList;
    if (existingIndex >= 0) {
      newList = [...diagnoses];
      newList[existingIndex] = d;
    } else {
      newList = [d, ...diagnoses];
    }
    localStorage.setItem("cp_diagnoses", JSON.stringify(newList));
    setDiagnoses(newList);
  };

  const deleteDiagnosis = (id: string) => {
    const newList = diagnoses.filter((d) => d.id !== id);
    localStorage.setItem("cp_diagnoses", JSON.stringify(newList));
    setDiagnoses(newList);
  };

  const saveActivityEvent = (e: any) => {
    const newList = [e, ...activityEvents];
    localStorage.setItem("cp_activity_events", JSON.stringify(newList));
    setActivityEvents(newList);
  };

  const saveResultRecord = (r: any) => {
    const newList = [r, ...resultRecords];
    localStorage.setItem("cp_result_records", JSON.stringify(newList));
    setResultRecords(newList);
    if (user?.id) {
      import("../lib/data/dataStore").then(({ dataStore }) => {
        dataStore.saveResult(user.id, r).catch(console.error);
      });
    }
  };

  const canGenerateCampaign = (): boolean => {
    if (!user) return false;
    const { usageGuard } = require("../services/usageGuard");
    return usageGuard.canUseAI(user, "campaign_generation").can;
  };

  const saveLearningProfile = (p: any) => {
    localStorage.setItem("cp_learning_profile", JSON.stringify(p));
    setLearningProfile(p);
  };

  const saveOnboardingProfile = (p: any) => {
    localStorage.setItem("cp_onboarding", JSON.stringify(p));
    setOnboardingProfile(p);
  };

  const saveActivationChecklist = (c: any) => {
    localStorage.setItem("cp_checklist", JSON.stringify(c));
    setActivationChecklist(c);
  };

  const saveFeedback = (f: UserFeedback) => {
    setFeedbacks((prev) => [f, ...prev]);
  };

  const saveBetaLead = (lead: BetaLead) => {
    const savedLeads = JSON.parse(localStorage.getItem("fotomax_beta_leads") || "[]");
    localStorage.setItem("fotomax_beta_leads", JSON.stringify([lead, ...savedLeads]));
  };

  const getBetaLeads = () => {
    return JSON.parse(localStorage.getItem("fotomax_beta_leads") || "[]") as BetaLead[];
  };

  const incrementUsage = (
    actionType: keyof typeof AI_ACTION_COSTS,
    outputId?: string,
  ) => {
    if (!user) return;
    const { usageGuard } = require("../services/usageGuard");
    const updatedUser = usageGuard.consumeCredits(user, actionType, outputId);
    saveUser(updatedUser);
  };

  const getRemainingCredits = (): number => {
    if (!user) return 0;
    if (user.plan === "trial") return user.usage.trialUsed ? 0 : 1;
    const { usageGuard } = require("../services/usageGuard");
    const limits = usageGuard.getPlanLimits(user.plan);
    return Math.max(
      0,
      limits.totalCredits -
        (user.usage.monthlyCreditsUsed || user.usage.usedCredits || 0),
    );
  };

  const checkPlanReset = (currentUser: User) => {
    const { usageGuard } = require("../services/usageGuard");
    return usageGuard.resetMonthlyUsageIfNeeded(currentUser);
  };

  const simulateActiveSubscription = (plan: PlanTier) => {
    if (!user) return;
    saveUser({
      ...user,
      plan,
      subscriptionStatus: "active",
      trialUsed: plan === "trial" ? user.trialUsed : true,
    });
  };

  const updateSettings = (s: BusinessSettings) => {
    localStorage.setItem("cp_settings", JSON.stringify(s));
    setSettings(s);
  };

  const requestActivation = (req: any) => {
    const newPending = [req, ...pendingActivations];
    localStorage.setItem("cp_pending_activations", JSON.stringify(newPending));
    setPendingActivations(newPending);

    if (user) {
      const updatedUser = { ...user, pendingActivation: req };
      saveUser(updatedUser);
    }
  };

  const clearPendingActivations = () => {
    localStorage.removeItem("cp_pending_activations");
    setPendingActivations([]);
  };

  const addLedgerEntry = (entry: CreditLedgerEntry) => {
    setCreditLedger((prev) => [entry, ...prev]);
  };

  const adminUpdateUserPlan = (userId: string, newPlan: PlanTier) => {
    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        plan: newPlan,
        pendingActivation: undefined,
      };
      saveUser(updatedUser);
    }
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      businessName: profile.businessName, // Update the display name too
      businessProfile: profile,
    };
    saveUser(updatedUser);
  };

  const saveBusinessDNA = (dna: BusinessDNA) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      businessDNA: dna,
    };
    saveUser(updatedUser);
  };

  const exportBusinessDNA = () => {
    if (!user?.businessDNA) return null;
    const dataStr = JSON.stringify(user.businessDNA, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dna-${(user.businessDNA.basics?.businessName || "empresa").toLowerCase().replace(/\s+/g, "-")}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importBusinessDNA = (jsonString: string) => {
    try {
      const dna = JSON.parse(jsonString);
      // Basic validation
      if (dna.basics && dna.products && dna.audience) {
        saveBusinessDNA(dna);
        return true;
      }
    } catch (e) {
      console.error("Erro ao importar DNA:", e);
    }
    return false;
  };

  const exportBusinessProfile = () => {
    if (!user?.businessProfile) return null;
    const dataStr = JSON.stringify(user.businessProfile, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "dna-comercial.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importBusinessProfile = (jsonString: string) => {
    try {
      const profile = JSON.parse(jsonString);
      // Basic validation
      if (profile.businessName && profile.businessType) {
        updateBusinessProfile(profile);
        return true;
      }
    } catch (e) {
      console.error("Erro ao importar perfil:", e);
    }
    return false;
  };

  return {
    user,
    campaigns,
    offers,
    calendars,
    creatives,
    libraryFavorites,
    customTemplates,
    diagnoses,
    activityEvents,
    resultRecords,
    learningProfile,
    onboardingProfile,
    activationChecklist,
    settings,
    pendingActivations,
    saveUser,
    saveCampaign,
    deleteCampaign,
    saveOffer,
    deleteOffer,
    saveCalendar,
    deleteCalendar,
    saveCreative,
    deleteCreative,
    toggleLibraryFavorite,
    saveCustomTemplate,
    deleteCustomTemplate,
    saveDiagnosis,
    deleteDiagnosis,
    saveActivityEvent,
    saveResultRecord,
    saveLearningProfile,
    saveOnboardingProfile,
    saveActivationChecklist,
    saveFeedback,
    saveBetaLead,
    getBetaLeads,
    addLedgerEntry,
    updateSettings,
    canGenerateCampaign,
    incrementUsage,
    getRemainingCredits,
    checkPlanReset,
    simulateActiveSubscription,
    requestActivation,
    clearPendingActivations,
    feedbacks,
    adminUpdateUserPlan,
    updateBusinessProfile,
    saveBusinessDNA,
    exportBusinessDNA,
    importBusinessDNA,
    exportBusinessProfile,
    importBusinessProfile,
    isAdmin,
  };
}
