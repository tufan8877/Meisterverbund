import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { PageLayout } from "@/components/Layout";
import { AdminLayout, RequireAdmin } from "@/pages/admin/AdminLayout";
import { HomePage } from "@/pages/HomePage";
import { BlogListPage } from "@/pages/BlogListPage";
import { BlogDetailPage } from "@/pages/BlogDetailPage";
import { NewsListPage } from "@/pages/NewsListPage";
import { NewsDetailPage } from "@/pages/NewsDetailPage";
import { AdsListPage } from "@/pages/AdsListPage";
import { AdDetailPage } from "@/pages/AdDetailPage";
import { BusinessListPage } from "@/pages/BusinessListPage";
import { BusinessDetailPage } from "@/pages/BusinessDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { UeberUnsPage, KontaktPage, ImpressumPage, DatenschutzPage, NotFoundPage } from "@/pages/StaticPages";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminBlog, AdminNews, AdminAds, AdminBusinesses } from "@/pages/admin/AdminContent";
import { AdminComments } from "@/pages/admin/AdminComments";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000,
    },
  },
});

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/blog">
        <BlogListPage />
      </Route>
      <Route path="/blog/:slug">
        {(params) => <BlogDetailPage slug={params.slug} />}
      </Route>
      <Route path="/news">
        <NewsListPage />
      </Route>
      <Route path="/news/:slug">
        {(params) => <NewsDetailPage slug={params.slug} />}
      </Route>
      <Route path="/angebote">
        <AdsListPage />
      </Route>
      <Route path="/angebote/:slug">
        {(params) => <AdDetailPage slug={params.slug} />}
      </Route>
      <Route path="/betriebe">
        <BusinessListPage />
      </Route>
      <Route path="/betriebe/:slug">
        {(params) => <BusinessDetailPage slug={params.slug} />}
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/register">
        <RegisterPage />
      </Route>
      <Route path="/profil">
        <ProfilePage />
      </Route>
      <Route path="/ueber-uns">
        <UeberUnsPage />
      </Route>
      <Route path="/kontakt">
        <KontaktPage />
      </Route>
      <Route path="/impressum">
        <ImpressumPage />
      </Route>
      <Route path="/datenschutz">
        <DatenschutzPage />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

function AdminRouter() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/benutzer" component={AdminUsers} />
          <Route path="/admin/blog/neu">
            <AdminBlog isNew />
          </Route>
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/news/neu">
            <AdminNews isNew />
          </Route>
          <Route path="/admin/news" component={AdminNews} />
          <Route path="/admin/angebote/neu">
            <AdminAds isNew />
          </Route>
          <Route path="/admin/angebote" component={AdminAds} />
          <Route path="/admin/betriebe/neu">
            <AdminBusinesses isNew />
          </Route>
          <Route path="/admin/betriebe" component={AdminBusinesses} />
          <Route path="/admin/kommentare" component={AdminComments} />
        </Switch>
      </AdminLayout>
    </RequireAdmin>
  );
}

function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/admin">
        <AdminRouter />
      </Route>
      <Route path="/admin/:rest*">
        <AdminRouter />
      </Route>
      <Route>
        <PageLayout>
          <PublicRouter />
        </PageLayout>
      </Route>
    </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRouter />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
