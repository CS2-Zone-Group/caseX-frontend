'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import { useTranslations } from 'next-intl';
import ProfileSidebar from '@/components/ProfileSidebar';
import Loader from '@/components/Loader';

interface ReferralStats {
  code: string;
  totalReferred: number;
  qualifiedCount: number;
  claimedCount: number;
  requiredFriendsCount: number;
  completionCondition: string;
  currentMilestone: number;
  canClaim: boolean;
  progressInCurrentMilestone: number;
}

interface ReferredUser {
  id: string;
  username: string;
  conditionMet: boolean;
  conditionMetAt: string | null;
  createdAt: string;
}

interface RewardItem {
  id: string;
  skinId: string;
  name: string;
  imageUrl: string;
  rarity: string;
  exterior: string;
}

export default function ReferralPage() {
  const t = useTranslations('ReferralPage');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, referralsRes] = await Promise.all([
        api.get('/referral/my-stats'),
        api.get('/referral/my-referrals'),
      ]);
      setStats(statsRes.data);
      setReferrals(referralsRes.data.referrals || []);
    } catch {
      toast.error(t('loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const copyLink = () => {
    if (!stats?.code) return;
    const link = `${window.location.origin}/auth/register?ref=${stats.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openClaimModal = async () => {
    try {
      const { data } = await api.get('/referral/available-rewards');
      setRewards(data || []);
      setShowRewardModal(true);
    } catch {
      toast.error(t('loadError'));
    }
  };

  const claimReward = async (rewardItemId: string) => {
    setClaiming(true);
    try {
      const { data } = await api.post('/referral/claim-reward', { rewardItemId });
      toast.success(`${t('rewardClaimed')} - ${data.skinName}`);
      setShowRewardModal(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'NO_REWARD_AVAILABLE') toast.error(t('noRewardAvailable'));
      else toast.error(t('claimError'));
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  const progress = stats ? stats.progressInCurrentMilestone : 0;
  const required = stats?.requiredFriendsCount || 5;
  const progressPercent = (progress / required) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 max-w-6xl mx-auto">
      <ProfileSidebar activeTab="referral" />

      <div className="flex-1 space-y-6">
        {/* Referral Code Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('yourCode')}</h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 font-mono text-lg text-gray-900 dark:text-white tracking-wider">
              {stats?.code || '...'}
            </div>
            <button
              onClick={copyLink}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium whitespace-nowrap"
            >
              {copied ? t('copied') : t('copyLink')}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">{t('shareHint')}</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('progress')}</h2>
            {stats?.canClaim && (
              <button
                onClick={openClaimModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium animate-pulse"
              >
                {t('claimReward')}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {t('friendsQualified', { count: stats?.qualifiedCount || 0, required })}
              </span>
              <span className="text-gray-500">{stats?.claimedCount || 0} {t('rewardsClaimed')}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {progress}/{required} {t('currentProgress')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalReferred || 0}</p>
              <p className="text-xs text-gray-500">{t('totalReferred')}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-green-500">{stats?.qualifiedCount || 0}</p>
              <p className="text-xs text-gray-500">{t('qualified')}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-primary-500">{stats?.claimedCount || 0}</p>
              <p className="text-xs text-gray-500">{t('rewardsClaimed')}</p>
            </div>
          </div>
        </div>

        {/* Referred Users */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('referredUsers')}</h2>
          {referrals.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">{t('noReferrals')}</p>
          ) : (
            <div className="space-y-2">
              {referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${ref.conditionMet ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-gray-900 dark:text-white">{ref.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${ref.conditionMet ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {ref.conditionMet ? t('conditionMet') : t('pending')}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reward Claim Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRewardModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('selectReward')}</h3>
            {rewards.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t('noRewardsAvailable')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {rewards.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => claimReward(item.id)}
                    disabled={claiming}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition disabled:opacity-50"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded mb-2 flex items-center justify-center overflow-hidden">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-900 dark:text-white truncate font-medium">{item.name}</p>
                    {item.exterior && <p className="text-[10px] text-gray-500">{item.exterior}</p>}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
