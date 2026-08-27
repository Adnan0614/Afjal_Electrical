import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "@/pages/Home";
import Owner from "@/pages/Owner";
import { I18nProvider } from "@/lib/i18n";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App(): React.JSX.Element {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/owner" element={<Owner />} />
      </Routes>
    </I18nProvider>
  );
}
