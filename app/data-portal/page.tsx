'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/AuthContext';
import {
  fetchDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  DEFAULT_DATASETS,
  ICON_OPTIONS,
  type DatasetDoc,
  type DatasetInput,
} from '@/lib/datasets';
import {
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Flame,
  Wind,
  MapPin,
  Newspaper,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  Upload,
  RefreshCw,
  AlertTriangle,
  Users,
} from 'lucide-react';
import Link from 'next/link';

// ── Icon mapping ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Database,
  Newspaper,
  MapPin,
  Wind,
  Flame,
  Globe,
  FileSpreadsheet,
  BarChart3,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Database;
}

// ── Empty form state ─────────────────────────────────────────────────────────
const EMPTY_FORM: DatasetInput = {
  title: '',
  description: '',
  source: '',
  format: '',
  iconName: 'Database',
  category: 'local',
  url: '',
  isDownload: true,
};

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DataPortalPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [datasets, setDatasets] = useState<DatasetDoc[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DatasetInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<DatasetDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Redirect unauthenticated ───────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // ── Fetch datasets from Firestore ──────────────────────────────────────────
  const loadDatasets = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await fetchDatasets();
      setDatasets(data);
    } catch (err) {
      console.error('Error fetching datasets:', err);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const data = await fetchDatasets();
        if (!cancelled) setDatasets(data);
      } catch (err) {
        console.error('Error fetching datasets:', err);
      }
      if (!cancelled) setLoadingData(false);
    };
    fetchData();
    return () => { cancelled = true; };
  }, [user]);

  // ── Seed default datasets ──────────────────────────────────────────────────
  const handleSeed = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      for (const ds of DEFAULT_DATASETS) {
        await createDataset(ds, user.uid);
      }
      await loadDatasets();
    } catch (err) {
      console.error('Error seeding datasets:', err);
    }
    setSeeding(false);
  };

  // ── Form handlers ──────────────────────────────────────────────────────────
  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (ds: DatasetDoc) => {
    setEditingId(ds.id);
    setForm({
      title: ds.title,
      description: ds.description,
      source: ds.source,
      format: ds.format,
      iconName: ds.iconName,
      category: ds.category,
      url: ds.url,
      isDownload: ds.isDownload,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateDataset(editingId, form);
      } else {
        await createDataset(form, user.uid);
      }
      setShowForm(false);
      await loadDatasets();
    } catch (err) {
      console.error('Error saving dataset:', err);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDataset(deleteTarget.id);
      setDeleteTarget(null);
      await loadDatasets();
    } catch (err) {
      console.error('Error deleting dataset:', err);
    }
    setDeleting(false);
  };

  // ── Loading / auth guard ───────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="animate-pulse text-text-muted">กำลังโหลด...</div>
      </div>
    );
  }

  const localDatasets = datasets.filter(d => d.category === 'local');
  const externalDatasets = datasets.filter(d => d.category === 'external');

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">คลังข้อมูลเปิด</h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 bg-yellow-400/20 text-yellow-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-400/30">
                      <Shield className="w-3 h-3" />
                      ผู้ดูแลระบบ
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm sm:text-lg">
                  ดาวน์โหลดชุดข้อมูลด้าน PM2.5 จุดความร้อน และคุณภาพอากาศ
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 pr-5">
                {user.photoURL && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                )}
                <div className="text-sm">
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-white/70 text-xs">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              {[
                { label: 'ชุดข้อมูลทั้งหมด', value: datasets.length },
                { label: 'ดาวน์โหลดได้ทันที', value: localDatasets.length },
                { label: 'แหล่งข้อมูลภายนอก', value: externalDatasets.length },
                { label: 'รูปแบบข้อมูล', value: new Set(datasets.map(d => d.format)).size || '—' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admin toolbar */}
        {isAdmin && (
          <section className="max-w-6xl mx-auto px-4 pt-6">
            <div className="flex flex-wrap items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <span className="text-sm font-medium text-yellow-800">โหมดผู้ดูแล:</span>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                เพิ่มชุดข้อมูล
              </button>
              <Link
                href="/data-portal/manage-users"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text-main px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4" />
                จัดการผู้ใช้
              </Link>
              <button
                onClick={loadDatasets}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text-main px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                รีเฟรช
              </button>
            </div>
          </section>
        )}

        {/* Loading state */}
        {loadingData && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-text-muted">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Empty state — seed prompt (admin only) */}
        {!loadingData && datasets.length === 0 && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-main mb-2">ยังไม่มีชุดข้อมูล</h3>
              {isAdmin ? (
                <>
                  <p className="text-text-muted mb-6">คุณสามารถเพิ่มชุดข้อมูลเริ่มต้นหรือเพิ่มทีละรายการได้</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleSeed}
                      disabled={seeding}
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                      {seeding ? 'กำลังเพิ่ม...' : 'เพิ่มชุดข้อมูลเริ่มต้น (8 รายการ)'}
                    </button>
                    <button
                      onClick={openCreateForm}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 text-text-main px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      เพิ่มเอง
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-text-muted">ผู้ดูแลระบบยังไม่ได้เพิ่มชุดข้อมูล กรุณาลองใหม่ภายหลัง</p>
              )}
            </div>
          </section>
        )}

        {/* Local Datasets — Downloadable */}
        {!loadingData && localDatasets.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-main">ข้อมูลจากโครงการ</h2>
                <p className="text-sm text-text-muted">ดาวน์โหลดไฟล์ข้อมูลที่รวบรวมโดยทีมงาน</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localDatasets.map(ds => {
                const Icon = getIcon(ds.iconName);
                return (
                  <div key={ds.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow relative group">
                    {/* Admin controls */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditForm(ds)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors" title="แก้ไข">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(ds)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors" title="ลบ">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text-main mb-1">{ds.title}</h3>
                        <p className="text-sm text-text-muted mb-3 line-clamp-2">{ds.description}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">{ds.format}</span>
                          <span className="text-xs text-text-muted">โดย {ds.source}</span>
                        </div>
                        <a
                          href={ds.url}
                          download
                          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          ดาวน์โหลด
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* External Datasets */}
        {!loadingData && externalDatasets.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-8 sm:pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-main">แหล่งข้อมูลภายนอก</h2>
                <p className="text-sm text-text-muted">ลิงก์ไปยังแหล่งข้อมูลเปิดจากหน่วยงานต่าง ๆ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalDatasets.map(ds => {
                const Icon = getIcon(ds.iconName);
                return (
                  <div key={ds.id} className="relative group">
                    {/* Admin controls */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditForm(ds)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 transition-colors" title="แก้ไข">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(ds)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors" title="ลบ">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Icon className="w-5 h-5 text-blue-600 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-text-main text-sm group-hover:text-primary transition-colors">{ds.title}</h3>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                          <p className="text-xs text-text-muted mt-1 line-clamp-2">{ds.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">{ds.format}</span>
                            <span className="text-xs text-text-muted">{ds.source}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-text-main">
                {editingId ? 'แก้ไขชุดข้อมูล' : 'เพิ่มชุดข้อมูลใหม่'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">ชื่อชุดข้อมูล *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="เช่น ข้อมูล PM2.5 รายจังหวัด"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">คำอธิบาย *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  placeholder="อธิบายรายละเอียดของชุดข้อมูลนี้"
                />
              </div>

              {/* Two-column row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">แหล่งข้อมูล *</label>
                  <input
                    type="text"
                    required
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="เช่น GISTDA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">รูปแบบ *</label>
                  <input
                    type="text"
                    required
                    value={form.format}
                    onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="เช่น CSV, API, GeoJSON"
                  />
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">URL / ลิงก์ *</label>
                <input
                  type="text"
                  required
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="https://... หรือ /datas/filename.csv"
                />
              </div>

              {/* Two-column: icon + category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">ไอคอน</label>
                  <select
                    value={form.iconName}
                    onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">ประเภท</label>
                  <select
                    value={form.category}
                    onChange={e => {
                      const cat = e.target.value as 'local' | 'external';
                      setForm(f => ({ ...f, category: cat, isDownload: cat === 'local' }));
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  >
                    <option value="local">ข้อมูลโครงการ (ดาวน์โหลด)</option>
                    <option value="external">แหล่งข้อมูลภายนอก (ลิงก์)</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มชุดข้อมูล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-text-main">ยืนยันการลบ</h3>
            </div>
            <p className="text-sm text-text-muted mb-1">คุณต้องการลบชุดข้อมูลนี้หรือไม่?</p>
            <p className="text-sm font-medium text-text-main mb-6">&ldquo;{deleteTarget.title}&rdquo;</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'กำลังลบ...' : 'ลบชุดข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
