import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import TabBar, { type PageKey } from "./components/layout/TabBar";
import { getProfile } from "./lib/db";
import Body from "./pages/Body";
import Onboarding from "./pages/Onboarding";
import Plan from "./pages/Plan";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Today from "./pages/Today";

export default function App() {
  const loaded = useLiveQuery(async () => ({ profile: await getProfile() }), []);
  const [page, setPage] = useState<PageKey>("today");

  if (loaded === undefined) {
    return <div className="flex flex-1 items-center justify-center text-neutral-400">載入中…</div>;
  }

  const profile = loaded.profile;
  if (!profile) {
    return <Onboarding />;
  }

  return (
    <>
      {page === "today" && <Today />}
      {page === "plan" && <Plan />}
      {page === "body" && <Body />}
      {page === "stats" && <Stats />}
      {page === "settings" && <Settings />}
      <TabBar active={page} onChange={setPage} />
    </>
  );
}
