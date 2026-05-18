/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { NicheExamplePage } from './pages/NicheExamplePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { CampaignDashboard } from './pages/CampaignDashboard';
import { CampaignWizard } from './pages/CampaignWizard';
import { CampaignDiagnostic } from './pages/CampaignDiagnostic';
import { CampaignModels } from './pages/CampaignModels';
import { CampaignHistory } from './pages/CampaignHistory';
import { History } from './pages/History';
import { Library } from './pages/Library';
import { IdeasCalendar } from './pages/IdeasCalendar';
import { Settings } from './pages/Settings';
import { Billing } from './pages/Billing';
import { BillingSuccessPage } from './pages/BillingSuccessPage';
import { BillingCancelPage } from './pages/BillingCancelPage';
import { SuccessPage } from './pages/SuccessPage';
import { DNAOnboarding } from './pages/DNAOnboarding';
import { DNACenter } from './pages/DNACenter';
import { DNADiagnostico } from './pages/DNADiagnostico';
import { OfferDashboard } from './pages/OfferDashboard';
import { OfferWizard } from './pages/OfferWizard';
import { OfferHistory } from './pages/OfferHistory';
import { OfferModels } from './pages/OfferModels';
import { OfferDiagnostic } from './pages/OfferDiagnostic';
import { CalendarDashboard } from './pages/SalesCalendar/CalendarDashboard';
import { CalendarWizard } from './pages/SalesCalendar/CalendarWizard';
import { CalendarWeekly } from './pages/SalesCalendar/CalendarWeekly';
import { CalendarMonthly } from './pages/SalesCalendar/CalendarMonthly';
import { CalendarHistory } from './pages/SalesCalendar/CalendarHistory';
import { CreativeDashboard } from './pages/LaboratorioCriativos/CreativeDashboard';
import { CreativeWizard } from './pages/LaboratorioCriativos/CreativeWizard';
import { PhotoAnalysis } from './pages/LaboratorioCriativos/PhotoAnalysis';
import { CreativePrompts } from './pages/LaboratorioCriativos/CreativePrompts';
import { CreativeModels } from './pages/LaboratorioCriativos/CreativeModels';
import { CreativeHistory } from './pages/LaboratorioCriativos/CreativeHistory';
import { BrandKit } from './pages/LaboratorioCriativos/BrandKit';
import { LibraryDashboard } from './pages/Biblioteca/LibraryDashboard';
import { LibraryModels } from './pages/Biblioteca/LibraryModels';
import { LibraryCategories } from './pages/Biblioteca/LibraryCategories';
import { LibraryFavorites } from './pages/Biblioteca/LibraryFavorites';
import { LibraryCreate } from './pages/Biblioteca/LibraryCreate';
import { LibraryHistory } from './pages/Biblioteca/LibraryHistory';
import { LibraryPremium } from './pages/Biblioteca/LibraryPremium';
import { ConsultantDashboard } from './pages/Consultor/ConsultantDashboard';
import { ConsultantDiagnosis } from './pages/Consultor/ConsultantDiagnosis';
import { ConsultantAsk } from './pages/Consultor/ConsultantAsk';
import { ConsultantHistory } from './pages/Consultor/ConsultantHistory';
import { ConsultantProblems, ConsultantActionPlan } from './pages/Consultor/ConsultantProblems';
import { ResultsDashboard } from './pages/Resultados/ResultsDashboard';
import { ResultsRegister } from './pages/Resultados/ResultsRegister';
import { ResultsPlaceholder } from './pages/Resultados/ResultsPlaceholder';
import { OnboardingWelcome } from './pages/Onboarding/OnboardingWelcome';
import { FirstWinFlow } from './pages/Onboarding/FirstWinFlow';
import { FirstWinResult } from './pages/Onboarding/FirstWinResult';
import FirstVictory from './pages/FirstVictory';
import { NotFound } from './pages/NotFound';
import { Layout } from './components/Layout';
import { useStorage } from './hooks/useStorage';

import { ZapRapido } from './pages/ZapRapido';
import { Usage } from './pages/Usage';
import { Admin } from './pages/Admin';
import { AdminMargin } from './pages/AdminMargin';
import { AdminReadiness } from './pages/AdminReadiness';
import { AdminBeta } from './pages/AdminBeta';
import { AdminNicheTest } from './pages/AdminNicheTest';
import { AITest } from './pages/AITest';
import { AdminAudit } from './pages/AdminAudit';
import { AdminUsage } from './pages/AdminUsage';
import { AdminBilling } from './pages/AdminBilling';
import { AdminConfig } from './pages/AdminConfig';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useStorage();
  const storedUser = localStorage.getItem('cp_user');
  
  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useStorage();
  const storedUser = localStorage.getItem('cp_user');
  const userObj = user || (storedUser ? JSON.parse(storedUser) : null);
  
  if (!userObj) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exemplos/:nicheId" element={<NicheExamplePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/uso" element={<ProtectedRoute><Usage /></ProtectedRoute>} />
        
        {/* Campanha Pronta Avançado */}
        <Route path="/campanha-pronta" element={<Navigate to="/campanhas" replace />} />
        <Route path="/campanhas" element={<ProtectedRoute><CampaignDashboard /></ProtectedRoute>} />
        <Route path="/campanhas/nova" element={<ProtectedRoute><CampaignWizard /></ProtectedRoute>} />
        <Route path="/campanhas/diagnostico" element={<ProtectedRoute><CampaignDiagnostic /></ProtectedRoute>} />
        <Route path="/campanhas/modelos" element={<ProtectedRoute><CampaignModels /></ProtectedRoute>} />
        <Route path="/campanhas/historico" element={<ProtectedRoute><CampaignHistory /></ProtectedRoute>} />
        <Route path="/campanhas/calendario" element={<Navigate to="/ideas" replace />} />

        <Route path="/zap-rapido" element={<ProtectedRoute><ZapRapido /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/margem" element={<AdminRoute><AdminMargin /></AdminRoute>} />
        <Route path="/admin/auditoria" element={<AdminRoute><AdminAudit /></AdminRoute>} />
        <Route path="/admin/usage" element={<AdminRoute><AdminUsage /></AdminRoute>} />
        <Route path="/admin/billing" element={<AdminRoute><AdminBilling /></AdminRoute>} />
        <Route path="/admin/config" element={<AdminRoute><AdminConfig /></AdminRoute>} />
        <Route path="/admin/ai-test" element={<AdminRoute><AITest /></AdminRoute>} />
        <Route path="/admin/prontidao" element={<AdminRoute><AdminReadiness /></AdminRoute>} />
        <Route path="/admin/beta" element={<AdminRoute><AdminBeta /></AdminRoute>} />
        <Route path="/admin/teste-nicho" element={<AdminRoute><AdminNicheTest /></AdminRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/ideas" element={<ProtectedRoute><IdeasCalendar /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/billing/success" element={<ProtectedRoute><BillingSuccessPage /></ProtectedRoute>} />
        <Route path="/billing/cancel" element={<ProtectedRoute><BillingCancelPage /></ProtectedRoute>} />
        
        {/* DNA Comercial */}
        <Route path="/dna-comercial" element={<ProtectedRoute><DNACenter /></ProtectedRoute>} />
        <Route path="/dna-comercial/onboarding" element={<ProtectedRoute><DNAOnboarding /></ProtectedRoute>} />
        <Route path="/dna-comercial/resumo" element={<ProtectedRoute><DNACenter /></ProtectedRoute>} />
        <Route path="/dna-comercial/diagnostico" element={<ProtectedRoute><DNADiagnostico /></ProtectedRoute>} />
        <Route path="/dna-comercial/editar" element={<ProtectedRoute><DNAOnboarding /></ProtectedRoute>} />
        <Route path="/perfil-comercial" element={<Navigate to="/dna-comercial" replace />} />
        
        {/* Calendário de Vendas */}
        <Route path="/calendario" element={<ProtectedRoute><CalendarDashboard /></ProtectedRoute>} />
        <Route path="/calendario/nova-ideia" element={<ProtectedRoute><CalendarWizard /></ProtectedRoute>} />
        <Route path="/calendario/semana" element={<ProtectedRoute><CalendarWeekly /></ProtectedRoute>} />
        <Route path="/calendario/mes" element={<ProtectedRoute><CalendarMonthly /></ProtectedRoute>} />
        <Route path="/calendario/historico" element={<ProtectedRoute><CalendarHistory /></ProtectedRoute>} />

        {/* Laboratório de Criativos */}
        <Route path="/criativos" element={<ProtectedRoute><CreativeDashboard /></ProtectedRoute>} />
        <Route path="/criativos/novo" element={<ProtectedRoute><CreativeWizard /></ProtectedRoute>} />
        <Route path="/criativos/analisar-foto" element={<ProtectedRoute><PhotoAnalysis /></ProtectedRoute>} />
        <Route path="/criativos/prompts" element={<ProtectedRoute><CreativePrompts /></ProtectedRoute>} />
        <Route path="/criativos/modelos" element={<ProtectedRoute><CreativeModels /></ProtectedRoute>} />
        <Route path="/criativos/historico" element={<ProtectedRoute><CreativeHistory /></ProtectedRoute>} />
        <Route path="/criativos/brand-kit" element={<ProtectedRoute><BrandKit /></ProtectedRoute>} />

        {/* Máquina de Ofertas */}
        <Route path="/ofertas" element={<ProtectedRoute><OfferDashboard /></ProtectedRoute>} />
        <Route path="/ofertas/nova" element={<ProtectedRoute><OfferWizard /></ProtectedRoute>} />
        <Route path="/ofertas/historico" element={<ProtectedRoute><OfferHistory /></ProtectedRoute>} />
        <Route path="/ofertas/modelos" element={<ProtectedRoute><OfferModels /></ProtectedRoute>} />
        <Route path="/ofertas/diagnostico" element={<ProtectedRoute><OfferDiagnostic /></ProtectedRoute>} />

        <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
        
        {/* Biblioteca Inteligente */}
        <Route path="/biblioteca" element={<ProtectedRoute><LibraryDashboard /></ProtectedRoute>} />
        <Route path="/biblioteca/modelos" element={<ProtectedRoute><LibraryModels /></ProtectedRoute>} />
        <Route path="/biblioteca/categorias" element={<ProtectedRoute><LibraryCategories /></ProtectedRoute>} />
        <Route path="/biblioteca/favoritos" element={<ProtectedRoute><LibraryFavorites /></ProtectedRoute>} />
        <Route path="/biblioteca/criar" element={<ProtectedRoute><LibraryCreate /></ProtectedRoute>} />
        <Route path="/biblioteca/historico" element={<ProtectedRoute><LibraryHistory /></ProtectedRoute>} />
        <Route path="/biblioteca/premium" element={<ProtectedRoute><LibraryPremium /></ProtectedRoute>} />

        {/* Consultor IA */}
        <Route path="/consultor" element={<ProtectedRoute><ConsultantDashboard /></ProtectedRoute>} />
        <Route path="/consultor/diagnostico" element={<ProtectedRoute><ConsultantDiagnosis /></ProtectedRoute>} />
        <Route path="/consultor/perguntar" element={<ProtectedRoute><ConsultantAsk /></ProtectedRoute>} />
        <Route path="/consultor/historico" element={<ProtectedRoute><ConsultantHistory /></ProtectedRoute>} />
        <Route path="/consultor/problemas" element={<ProtectedRoute><ConsultantProblems /></ProtectedRoute>} />
        <Route path="/consultor/plano-de-acao" element={<ProtectedRoute><ConsultantActionPlan /></ProtectedRoute>} />

        {/* Resultados */}
        <Route path="/resultados" element={<ProtectedRoute><ResultsDashboard /></ProtectedRoute>} />
        <Route path="/resultados/dashboard" element={<Navigate to="/resultados" replace />} />
        <Route path="/resultados/registrar" element={<ProtectedRoute><ResultsRegister /></ProtectedRoute>} />
        <Route path="/resultados/campanhas" element={<ProtectedRoute><ResultsPlaceholder title="Resultados: Campanhas" /></ProtectedRoute>} />
        <Route path="/resultados/ofertas" element={<ProtectedRoute><ResultsPlaceholder title="Resultados: Ofertas" /></ProtectedRoute>} />
        <Route path="/resultados/whatsapp" element={<ProtectedRoute><ResultsPlaceholder title="Resultados: WhatsApp" /></ProtectedRoute>} />
        <Route path="/resultados/clientes" element={<ProtectedRoute><ResultsPlaceholder title="Resultados: Clientes" /></ProtectedRoute>} />
        <Route path="/resultados/calendario" element={<ProtectedRoute><ResultsPlaceholder title="Resultados: Calendário" /></ProtectedRoute>} />
        <Route path="/resultados/relatorios" element={<ProtectedRoute><ResultsPlaceholder title="Relatório Semanal" /></ProtectedRoute>} />

        <Route path="/primeira-vitoria" element={<ProtectedRoute><FirstVictory /></ProtectedRoute>} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingWelcome /></ProtectedRoute>} />
        <Route path="/onboarding/primeira-vitoria" element={<ProtectedRoute><FirstWinFlow /></ProtectedRoute>} />
        <Route path="/onboarding/resultado" element={<ProtectedRoute><FirstWinResult /></ProtectedRoute>} />
        <Route path="/onboarding/pular" element={<Navigate to="/dashboard" replace />} />

        {/* Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}
