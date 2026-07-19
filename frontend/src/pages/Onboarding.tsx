import ProfileForm from "../components/forms/ProfileForm";
import { saveProfile } from "../lib/db";
import type { Profile } from "../types";

export default function Onboarding() {
  async function handleSave(profile: Profile) {
    await saveProfile(profile);
  }

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">歡迎使用訓練日誌</h1>
      <p className="mb-6 text-sm text-neutral-500">先填一下你的基本資料，才能幫你算熱量、排課表。</p>
      <ProfileForm submitLabel="開始使用" onSave={handleSave} />
    </div>
  );
}
