import { useLiveQuery } from "dexie-react-hooks";
import { useRef, useState } from "react";
import ProfileForm from "../components/forms/ProfileForm";
import Card from "../components/layout/Card";
import Shell from "../components/layout/Shell";
import { clearAllData, exportBackup, getProfile, importBackup, saveProfile, type BackupPayload } from "../lib/db";
import type { Profile } from "../types";

export default function Settings() {
  const profile = useLiveQuery(() => getProfile(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!profile) return null;

  async function handleSaveProfile(p: Profile) {
    await saveProfile(p);
    setMessage("已儲存個人資料");
  }

  async function handleExport() {
    const data = await exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fit-log-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as BackupPayload;
      await importBackup(data);
      setMessage("已匯入備份資料");
    } catch {
      setMessage("匯入失敗，檔案格式不正確");
    } finally {
      e.target.value = "";
    }
  }

  async function handleClear() {
    if (!window.confirm("確定要清除所有資料嗎？此動作無法復原，建議先匯出備份。")) return;
    await clearAllData();
    setMessage("已清除所有資料");
  }

  return (
    <Shell title="設定">
      <div className="flex flex-col gap-4">
        {message && <p className="rounded-lg bg-violet-500/10 px-3 py-2 text-sm text-violet-600">{message}</p>}

        <Card title="個人資料與目標">
          <ProfileForm initial={profile} onSave={handleSaveProfile} />
        </Card>

        <Card title="資料備份">
          <p className="mb-3 text-sm text-neutral-500">所有資料只存在這台裝置的瀏覽器裡，換手機或清瀏覽器資料前請先匯出備份。</p>
          <div className="flex gap-2">
            <button type="button" onClick={handleExport} className="flex-1 rounded-lg border border-black/15 py-2 text-sm">
              匯出 JSON
            </button>
            <button type="button" onClick={handleImportClick} className="flex-1 rounded-lg border border-black/15 py-2 text-sm">
              匯入 JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          </div>
        </Card>

        <Card title="危險操作">
          <button type="button" onClick={handleClear} className="w-full rounded-lg border border-red-500/40 py-2 text-sm text-red-500">
            清除所有資料
          </button>
        </Card>
      </div>
    </Shell>
  );
}
