'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, type UserRole } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldX,
  ArrowLeft,
  RefreshCw,
  Search,
  Crown,
  User,
} from 'lucide-react';

interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: string;
}

export default function ManageUsersPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  // Gate: must be admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/data-portal');
    }
  }, [user, loading, isAdmin, router]);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserDoc)));
    } catch (err) {
      console.error('Error loading users:', err);
    }
    setLoadingUsers(false);
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let cancelled = false;
    (async () => {
      setLoadingUsers(true);
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!cancelled) setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserDoc)));
      } catch (err) {
        console.error('Error loading users:', err);
      }
      if (!cancelled) setLoadingUsers(false);
    })();
    return () => { cancelled = true; };
  }, [user, isAdmin]);

  const toggleRole = async (targetUid: string, currentRole: UserRole) => {
    // Can't demote yourself
    if (targetUid === user?.uid) return;
    const newRole: UserRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdating(targetUid);
    try {
      await updateDoc(doc(db, 'users', targetUid), { role: newRole });
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error updating role:', err);
    }
    setUpdating(null);
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="animate-pulse text-text-muted">กำลังโหลด...</div>
      </div>
    );
  }

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      <main className="flex-grow">
        <section className="max-w-4xl mx-auto px-4 py-8">
          {/* Back link */}
          <Link
            href="/data-portal"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปคลังข้อมูล
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-main">จัดการผู้ใช้</h1>
                <p className="text-sm text-text-muted">กำหนดสิทธิ์ admin หรือ user สำหรับผู้ใช้ในระบบ</p>
              </div>
            </div>
            <button
              onClick={loadUsers}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text-main px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors self-start"
            >
              <RefreshCw className="w-4 h-4" />
              รีเฟรช
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="text-2xl font-bold text-text-main">{users.length}</div>
              <div className="text-xs text-text-muted mt-1">ผู้ใช้ทั้งหมด</div>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{adminCount}</div>
              <div className="text-xs text-yellow-600 mt-1">ผู้ดูแลระบบ</div>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{userCount}</div>
              <div className="text-xs text-blue-600 mt-1">ผู้ใช้ทั่วไป</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Loading */}
          {loadingUsers && (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-text-muted">กำลังโหลดรายชื่อผู้ใช้...</p>
            </div>
          )}

          {/* User list */}
          {!loadingUsers && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>{searchQuery ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filtered.map(u => {
                    const isSelf = u.uid === user.uid;
                    return (
                      <li key={u.uid} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                        {/* Avatar */}
                        {u.photoURL ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full flex-shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-text-muted font-bold text-sm">
                            {(u.displayName || u.email || '?')[0].toUpperCase()}
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-text-main truncate text-sm">{u.displayName || '(ไม่มีชื่อ)'}</p>
                            {isSelf && (
                              <span className="text-[10px] bg-bg-light text-text-muted px-1.5 py-0.5 rounded-full">คุณ</span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted truncate">{u.email}</p>
                        </div>

                        {/* Role badge */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                              <Crown className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-bg-light text-text-muted text-xs font-semibold px-2.5 py-1 rounded-full">
                              <User className="w-3 h-3" />
                              User
                            </span>
                          )}

                          {/* Toggle button — can't change own role */}
                          {isSelf ? (
                            <div className="w-8 h-8" /> /* Spacer */
                          ) : (
                            <button
                              onClick={() => toggleRole(u.uid, u.role)}
                              disabled={updating === u.uid}
                              className={`p-2 rounded-lg transition-colors ${
                                u.role === 'admin'
                                  ? 'hover:bg-red-50 text-red-400 hover:text-red-600'
                                  : 'hover:bg-green-50 text-green-400 hover:text-green-600'
                              } disabled:opacity-50`}
                              title={u.role === 'admin' ? 'ลดเป็น User' : 'เลื่อนเป็น Admin'}
                            >
                              {updating === u.uid ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : u.role === 'admin' ? (
                                <ShieldX className="w-4 h-4" />
                              ) : (
                                <ShieldCheck className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Info box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">เกี่ยวกับสิทธิ์ผู้ใช้</p>
              <ul className="text-xs space-y-1 text-blue-700">
                <li><strong>Admin</strong> — เพิ่ม แก้ไข ลบชุดข้อมูล และจัดการสิทธิ์ผู้ใช้ในหน้าคลังข้อมูล</li>
                <li><strong>User</strong> — ดาวน์โหลดและเข้าถึงข้อมูลได้อย่างเดียว</li>
                <li>คุณไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
