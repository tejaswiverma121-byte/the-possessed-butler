'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSentinel } from '../../context/SentinelContext';
import { EmailCenterView } from '../../components/sentinel/EmailCenterView';

export default function EmailPage() {
  const router = useRouter();
  const {
    emails,
    userAccount,
    openDrawerWithEmail,
    handleMarkEmailAsRead,
    handleMarkAllEmailsAsRead,
    handleSyncLiveImap,
    setShowAccountModal
  } = useSentinel();

  return (
    <div className="h-full overflow-hidden">
      <EmailCenterView
        emails={emails}
        userAccount={userAccount}
        onSelectEmailForInspector={(em) => openDrawerWithEmail(em)}
        onComposeEmail={(to, subject, body) => {
          router.push(`/?compose=${encodeURIComponent(JSON.stringify({ to, subject, body }))}`);
        }}
        onMarkAsRead={handleMarkEmailAsRead}
        onMarkAllAsRead={handleMarkAllEmailsAsRead}
        onSyncImap={handleSyncLiveImap}
        onOpenAccountModal={() => setShowAccountModal(true)}
      />
    </div>
  );
}
