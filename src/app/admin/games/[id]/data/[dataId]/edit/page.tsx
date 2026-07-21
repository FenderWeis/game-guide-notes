'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ArrowLeft, Upload, FileText, Table, Plus, Edit3, Trash2, Save, X, Image as ImageIcon } from 'lucide-react'
import TableEditor from '@/components/TableEditor/TableEditor'

interface EditGameDataPageProps {
  params: { id: string; dataId: string }
}

interface ContentBlock {
  id: string | null
  moduleId: string | null
  title: string
  content: string
  image: string | null
  contentType: 'text' | 'table' | 'image'
  sortOrder: number
}

interface Module {
  id: string | null
  title: string
  sortOrder: number
  contentBlocks: ContentBlock[]
}

export default function EditGameDataPage({ params }: EditGameDataPageProps) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [game, setGame] = useState<{ name: string } | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [modules, setModules] = useState<Module[]>([])
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null)
  const [editingModuleTitle, setEditingModuleTitle] = useState('')

  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchData()
  }, [supabase, params.id, params.dataId])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    setCategories(data || [])
  }

  const fetchData = async () => {
    const [{ data: gameData }, { data: dataData }, { data: modulesData }, { data: blocksData }] = await Promise.all([
      supabase.from('games').select('name').eq('id', params.id).single(),
      supabase.from('game_data').select('title, category_id').eq('id', params.dataId).single(),
      supabase.from('game_data_modules').select('id, title, sort_order').eq('game_data_id', params.dataId).order('sort_order'),
      supabase.from('game_data_content_blocks').select('id, module_id, title, content, image, content_type, sort_order').eq('game_data_id', params.dataId).order('sort_order')
    ])

    setGame(gameData)
    if (dataData) {
      setTitle(dataData.title)
      setCategoryId(dataData.category_id)
    }

    if (modulesData) {
      const modulesWithBlocks: Module[] = modulesData.map((m: any) => ({
        id: m.id,
        title: m.title,
        sortOrder: m.sort_order,
        contentBlocks: (blocksData || []).filter((b: any) => b.module_id === m.id).map((b: any) => ({
          id: b.id,
          moduleId: b.module_id,
          title: b.title || '',
          content: b.content || '',
          image: b.image || null,
          contentType: b.content_type as 'text' | 'table' | 'image',
          sortOrder: b.sort_order
        }))
      }))
      setModules(modulesWithBlocks)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setMessage({ type: 'error', text: '请输入类型名称' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    const { error } = await supabase.from('categories').insert({ name: newCategoryName.trim() }).select()
    if (error) {
      setMessage({ type: 'error', text: '添加类型失败: ' + error.message })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '类型添加成功！' })
      setTimeout(() => setMessage(null), 3000)
      setNewCategoryName('')
      fetchCategories()
    }
  }

  const handleEditCategory = (category: { id: string; name: string }) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
  }

  const handleSaveCategory = async () => {
    if (!editingCategoryId || !editingCategoryName.trim()) {
      setMessage({ type: 'error', text: '请输入类型名称' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    const { error } = await supabase.from('categories').update({ name: editingCategoryName.trim() }).eq('id', editingCategoryId).select()
    if (error) {
      setMessage({ type: 'error', text: '修改类型失败: ' + error.message })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '类型修改成功！' })
      setTimeout(() => setMessage(null), 3000)
      setEditingCategoryId(null)
      setEditingCategoryName('')
      fetchCategories()
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`确定删除类型「${name}」吗？该类型下的所有资料也将被删除。`)) return
    const { error } = await supabase.from('categories').delete().eq('id', id).select()
    if (error) {
      setMessage({ type: 'error', text: '删除类型失败: ' + error.message })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '类型删除成功！' })
      setTimeout(() => setMessage(null), 3000)
      fetchCategories()
    }
  }

  const addModule = () => {
    setModules([...modules, {
      id: null,
      title: '',
      sortOrder: modules.length,
      contentBlocks: []
    }])
    setTimeout(() => {
      setEditingModuleIndex(modules.length)
    }, 0)
  }

  const editModule = (index: number) => {
    setEditingModuleIndex(index)
    setEditingModuleTitle(modules[index].title)
  }

  const saveModule = (index: number) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], title: editingModuleTitle }
    setModules(newModules)
    setEditingModuleIndex(null)
    setEditingModuleTitle('')
  }

  const cancelEditModule = () => {
    setEditingModuleIndex(null)
    setEditingModuleTitle('')
  }

  const deleteModule = async (index: number) => {
    if (!confirm('确定删除这个模块吗？该模块下的所有内容块也将被删除。')) return
    const module = modules[index]
    if (module.id) {
      const { error } = await supabase.from('game_data_modules').delete().eq('id', module.id)
      if (error) {
        setMessage({ type: 'error', text: '删除模块失败: ' + error.message })
        setTimeout(() => setMessage(null), 3000)
        return
      }
    }
    const newModules = modules.filter((_, i) => i !== index)
    setModules(newModules.map((m, i) => ({ ...m, sortOrder: i })))
    setMessage({ type: 'success', text: '模块删除成功！' })
    setTimeout(() => setMessage(null), 3000)
  }

  const addContentBlock = (moduleIndex: number) => {
    const newModules = [...modules]
    const blockCount = newModules[moduleIndex].contentBlocks.length
    newModules[moduleIndex].contentBlocks.push({
      id: null,
      moduleId: null,
      title: `内容块 ${blockCount + 1}`,
      content: '',
      image: null,
      contentType: 'text',
      sortOrder: blockCount
    })
    setModules(newModules)
  }

  const updateContentBlock = useCallback((moduleIndex: number, blockIndex: number, field: 'title' | 'content' | 'image' | 'contentType', value: string | null) => {
    setModules(prevModules => {
      const newModules = prevModules.map(m => ({
        ...m,
        contentBlocks: m.contentBlocks.map(b => ({ ...b }))
      }))
      const block = newModules[moduleIndex].contentBlocks[blockIndex]
      if (field === 'title') {
        block.title = value as string
      } else if (field === 'content') {
        block.content = value as string
      } else if (field === 'image') {
        block.image = value
      } else if (field === 'contentType') {
        block.contentType = value as 'text' | 'table' | 'image'
      }
      return newModules
    })
  }, [])

  const deleteContentBlock = async (moduleIndex: number, blockIndex: number) => {
    if (!confirm('确定删除这个内容块吗？')) return
    const block = modules[moduleIndex].contentBlocks[blockIndex]
    if (block.id) {
      const { error } = await supabase.from('game_data_content_blocks').delete().eq('id', block.id)
      if (error) {
        setMessage({ type: 'error', text: '删除内容块失败: ' + error.message })
        setTimeout(() => setMessage(null), 3000)
        return
      }
    }
    const newModules = [...modules]
    newModules[moduleIndex].contentBlocks = newModules[moduleIndex].contentBlocks.filter((_, i) => i !== blockIndex)
    newModules[moduleIndex].contentBlocks = newModules[moduleIndex].contentBlocks.map((b, i) => ({ ...b, sortOrder: i }))
    setModules(newModules)
    setMessage({ type: 'success', text: '内容块删除成功！' })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImageUpload = async (moduleIndex: number, blockIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`game_data/${Date.now()}-${file.name}`, file)
    if (!error && data) {
      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)
      updateContentBlock(moduleIndex, blockIndex, 'image', publicUrl.publicUrl)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (isSaving) return
    setIsSaving(true)

    if (!title || !categoryId) {
      setMessage({ type: 'error', text: '请填写标题和选择资料类型' })
      setTimeout(() => setMessage(null), 3000)
      setIsSaving(false)
      return
    }

    const hasValidModule = modules.some(m => m.title.trim())
    if (!hasValidModule) {
      setMessage({ type: 'error', text: '请至少添加一个模块' })
      setTimeout(() => setMessage(null), 3000)
      setIsSaving(false)
      return
    }

    try {
      console.log('Step 1: Updating game_data...')
      const { error: updateError } = await supabase.from('game_data').update({
        title,
        content: '',
        category_id: categoryId,
      }).eq('id', params.dataId)

      if (updateError) {
        console.error('Update game_data error:', updateError)
        throw updateError
      }
      console.log('Step 1 done: game_data updated')

      for (let i = 0; i < modules.length; i++) {
        const module = modules[i]
        if (!module.title.trim()) continue

        if (module.id) {
          console.log(`Step 2: Updating module ${i}...`)
          const { error: moduleError } = await supabase.from('game_data_modules').update({
            title: module.title,
            sort_order: i,
          }).eq('id', module.id)

          if (moduleError) {
            console.error('Update module error:', moduleError)
            throw moduleError
          }
          console.log(`Step 2 done: module ${i} updated`)
        } else {
          console.log(`Step 2: Inserting module ${i}...`)
          const { data: moduleData, error: moduleError } = await supabase.from('game_data_modules').insert({
            game_data_id: params.dataId,
            title: module.title,
            sort_order: i,
          }).select().single()

          if (moduleError) {
            console.error('Insert module error:', moduleError)
            throw moduleError
          }
          module.id = moduleData.id
          console.log(`Step 2 done: module ${i} inserted with id:`, moduleData.id)
        }

        for (let j = 0; j < module.contentBlocks.length; j++) {
          const block = module.contentBlocks[j]
          if (!block.content && !block.image) continue

          if (block.id) {
            console.log(`Step 3: Updating block ${j} for module ${i}...`)
            console.log('Block data:', {
              title: block.title,
              contentLength: block.content?.length,
              image: block.image,
              contentType: block.contentType,
            })
            const { error: blockError } = await supabase.from('game_data_content_blocks').update({
              title: block.title,
              content: block.content,
              image: block.image,
              content_type: block.contentType,
              sort_order: j,
            }).eq('id', block.id)

            if (blockError) {
              console.error('Update block error:', blockError)
              throw blockError
            }
            console.log(`Step 3 done: block ${j} updated`)
          } else {
            console.log(`Step 3: Inserting block ${j} for module ${i}...`)
            console.log('Block data:', {
              title: block.title,
              contentLength: block.content?.length,
              image: block.image,
              contentType: block.contentType,
            })
            const { data: blockData, error: blockError } = await supabase.from('game_data_content_blocks').insert({
              game_data_id: params.dataId,
              module_id: module.id!,
              title: block.title,
              content: block.content,
              image: block.image,
              content_type: block.contentType,
              sort_order: j,
            }).select().single()

            if (blockError) {
              console.error('Insert block error:', blockError)
              throw blockError
            }
            block.id = blockData.id
            console.log(`Step 3 done: block ${j} inserted`)
          }
        }
      }

      console.log('All steps completed successfully!')
      setMessage({ type: 'success', text: '修改成功！' })
      setTimeout(() => {
        window.location.href = `/games/${params.id}/data/${params.dataId}`
      }, 1500)
    } catch (error: any) {
      console.error('Save failed:', error)
      const errorMessage = error.message || '保存失败，请检查控制台获取详细信息'
      setMessage({ type: 'error', text: errorMessage })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      console.log('Finally: Setting isSaving to false')
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这条资料吗？')) return
    const { error } = await supabase.from('game_data').delete().eq('id', params.dataId)
    if (error) {
      setMessage({ type: 'error', text: '删除失败，请重试' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '删除成功！' })
      setTimeout(() => {
        window.location.href = `/games/${params.id}`
      }, 1500)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">编辑游戏资料</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {game && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">所属游戏：<span className="font-medium">{game.name}</span></p>
        </div>
      )}

      <div className="mb-6 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">管理资料类型</h3>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入新类型名称"
          />
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加类型
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2"
            >
              {editingCategoryId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory()}
                    className="px-2 py-1 border border-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button onClick={handleSaveCategory} className="text-green-600 hover:text-green-700">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingCategoryId(null); setEditingCategoryName('') }} className="text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={`${categoryId === category.id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                  >
                    {category.name}
                  </button>
                  <button onClick={() => handleEditCategory(category)} className="text-gray-400 hover:text-blue-600" title="编辑">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id, category.name)} className="text-gray-400 hover:text-red-600" title="删除">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            资料条目标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入资料条目标题"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">管理模块</h3>
            <button
              type="button"
              onClick={addModule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              添加模块
            </button>
          </div>

          {modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无模块，点击上方按钮添加</p>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-4 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                  {editingModuleIndex === moduleIndex ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingModuleTitle}
                        onChange={(e) => setEditingModuleTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveModule(moduleIndex)}
                        className="flex-1 px-3 py-1 border border-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="输入模块标题"
                        autoFocus
                      />
                      <button onClick={() => saveModule(moduleIndex)} className="text-green-600 hover:text-green-700">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEditModule} className="text-gray-500 hover:text-gray-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-blue-600 font-medium">#{moduleIndex + 1}</span>
                        <span className="text-gray-700">{module.title || '未命名模块'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => addContentBlock(moduleIndex)} className="text-gray-400 hover:text-blue-600" title="添加内容块">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editModule(moduleIndex)} className="text-gray-400 hover:text-blue-600" title="编辑模块">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => deleteModule(moduleIndex)} className="text-gray-400 hover:text-red-600" title="删除模块">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {module.contentBlocks.map((block, blockIndex) => (
                    <div key={blockIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => updateContentBlock(moduleIndex, blockIndex, 'title', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="内容块标题"
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => updateContentBlock(moduleIndex, blockIndex, 'contentType', 'text')}
                              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${block.contentType === 'text' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <FileText className="w-3 h-3" />
                              文字
                            </button>
                            <button
                              type="button"
                              onClick={() => updateContentBlock(moduleIndex, blockIndex, 'contentType', 'table')}
                              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${block.contentType === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <Table className="w-3 h-3" />
                              表格
                            </button>
                            <button
                              type="button"
                              onClick={() => updateContentBlock(moduleIndex, blockIndex, 'contentType', 'image')}
                              className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${block.contentType === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                            >
                              <ImageIcon className="w-3 h-3" />
                              图片
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteContentBlock(moduleIndex, blockIndex)}
                            className="text-gray-400 hover:text-red-600"
                            title="删除内容块"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {(block.contentType === 'text' || block.contentType === 'table') && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            内容
                          </label>
                          {block.contentType === 'text' ? (
                            <textarea
                              value={block.content}
                              onChange={(e) => updateContentBlock(moduleIndex, blockIndex, 'content', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="输入内容"
                              rows={4}
                            />
                          ) : (
                            <TableEditor value={block.content} onChange={(val) => updateContentBlock(moduleIndex, blockIndex, 'content', val)} />
                          )}
                        </div>
                      )}

                      {(block.contentType === 'image' || block.contentType === 'text') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            图片（可选）
                          </label>
                          <div className="border border-gray-300 rounded-lg p-4 text-center">
                            {block.image ? (
                              <div>
                                <img src={block.image} alt="内容图片" className="max-h-32 mx-auto mb-2 rounded-lg" />
                                <button
                                  type="button"
                                  onClick={() => updateContentBlock(moduleIndex, blockIndex, 'image', null)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  删除图片
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-gray-500 text-sm">点击上传图片</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(moduleIndex, blockIndex, e)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {module.contentBlocks.length === 0 && (
                    <button
                      type="button"
                      onClick={() => addContentBlock(moduleIndex)}
                      className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      + 添加内容块
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '保存中...' : '保存资料'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            删除资料
          </button>
        </div>
      </form>
    </div>
  )
}