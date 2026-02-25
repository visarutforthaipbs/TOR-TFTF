import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminArticles() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">จัดการบทความ</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-dark transition-colors">
          <Plus className="w-5 h-5" />
          สร้างบทความใหม่
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="ค้นหาบทความ..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select className="border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50">
            <option>หมวดหมู่ทั้งหมด</option>
            <option>Long-form</option>
            <option>คลังความรู้</option>
            <option>วิดีโอ</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-sm bg-white">
              <th className="py-4 px-6 font-medium">หัวข้อบทความ</th>
              <th className="py-4 px-6 font-medium">หมวดหมู่</th>
              <th className="py-4 px-6 font-medium">ผู้เขียน</th>
              <th className="py-4 px-6 font-medium">วันที่เผยแพร่</th>
              <th className="py-4 px-6 font-medium text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, title: 'ทำความเข้าใจปรากฏการณ์เอลนีโญ...', category: 'Long-form', author: 'ทีมวิจัย', date: '12 มี.ค. 2568' },
              { id: 2, title: 'คู่มือการเลือกซื้อเครื่องฟอกอากาศ', category: 'คลังความรู้', author: 'Admin', date: '8 มี.ค. 2568' },
              { id: 3, title: 'สารคดีสั้น: ลมหายใจที่หายไป', category: 'วิดีโอ', author: 'สื่อสร้างสรรค์', date: '5 มี.ค. 2568' },
            ].map((article) => (
              <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-text-main">{article.title}</td>
                <td className="py-4 px-6">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500">{article.author}</td>
                <td className="py-4 px-6 text-gray-500">{article.date}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
