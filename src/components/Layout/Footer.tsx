export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-bold">游戏攻略笔记</span>
            <p className="text-gray-400 text-sm mt-1">分享游戏乐趣，记录攻略心得</p>
          </div>
          <div className="flex gap-6">
            <a href="/about" className="text-gray-400 hover:text-white">关于我们</a>
            <a href="/contact" className="text-gray-400 hover:text-white">联系我们</a>
            <a href="/privacy" className="text-gray-400 hover:text-white">隐私政策</a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2026 游戏攻略笔记. 保留所有权利.
        </div>
      </div>
    </footer>
  )
}