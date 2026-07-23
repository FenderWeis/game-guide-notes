'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Plus, Minus, Trash2, Grid3X3, Square } from 'lucide-react'

interface CellData {
  value: string
  rowspan: number
  colspan: number
  isMerged: boolean
}

interface MergedCell {
  row: number
  col: number
  rowspan: number
  colspan: number
}

interface TableEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function TableEditor({ value, onChange }: TableEditorProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [cells, setCells] = useState<CellData[][]>([])
  const [hasHeader, setHasHeader] = useState(true)
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [mergedCells, setMergedCells] = useState<MergedCell[]>([])
  const [initialized, setInitialized] = useState(false)

  const onChangeRef = useRef(onChange)

  const cellsKey = useMemo(() => {
    return JSON.stringify(cells)
  }, [cells])

  const initCells = useCallback((r: number, c: number) => {
    const newCells: CellData[][] = []
    for (let i = 0; i < r; i++) {
      newCells[i] = []
      for (let j = 0; j < c; j++) {
        newCells[i][j] = {
          value: '',
          rowspan: 1,
          colspan: 1,
          isMerged: false,
        }
      }
    }
    return newCells
  }, [])

  useEffect(() => {
    if (value && value.includes('<table')) {
      parseTableHtml(value)
    } else {
      setCells(initCells(rows, cols))
    }
    setInitialized(true)
  }, [value])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (initialized) {
      onChangeRef.current(generateHtml())
    }
  }, [cellsKey, hasHeader, mergedCells, initialized])

  const parseTableHtml = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const table = doc.querySelector('table')
    if (!table) {
      setCells(initCells(rows, cols))
      return
    }

    const rowsArray = table.querySelectorAll('tr')
    const newRows = rowsArray.length
    const newCols = Math.max(...Array.from(rowsArray).map(tr => tr.querySelectorAll('td, th').length))

    const newCells: CellData[][] = []
    const newMerged: MergedCell[] = []

    rowsArray.forEach((tr, rowIndex) => {
      newCells[rowIndex] = []
      let colIndex = 0
      const cellsInRow = tr.querySelectorAll('td, th')

      cellsInRow.forEach((cell) => {
        while (colIndex < newCols && newCells[rowIndex][colIndex]?.isMerged) {
          colIndex++
        }

        if (colIndex < newCols) {
          const rowspan = parseInt(cell.getAttribute('rowspan') || '1')
          const colspan = parseInt(cell.getAttribute('colspan') || '1')
          const isHeader = cell.tagName === 'TH'

          newCells[rowIndex][colIndex] = {
            value: cell.textContent || '',
            rowspan,
            colspan,
            isMerged: false,
          }

          if (rowspan > 1 || colspan > 1) {
            newMerged.push({ row: rowIndex, col: colIndex, rowspan, colspan })

            for (let i = rowIndex; i < rowIndex + rowspan; i++) {
              if (!newCells[i]) newCells[i] = []
              for (let j = colIndex; j < colIndex + colspan; j++) {
                if (i !== rowIndex || j !== colIndex) {
                  newCells[i][j] = {
                    value: '',
                    rowspan: 1,
                    colspan: 1,
                    isMerged: true,
                  }
                }
              }
            }
          }

          colIndex += colspan
        }
      })

      while (colIndex < newCols) {
        newCells[rowIndex][colIndex] = {
          value: '',
          rowspan: 1,
          colspan: 1,
          isMerged: false,
        }
        colIndex++
      }
    })

    setRows(newRows)
    setCols(newCols)
    setCells(newCells)
    setMergedCells(newMerged)
    setHasHeader(table.querySelector('th') !== null)
  }

  const generateHtml = (): string => {
    if (!cells.length) return ''

    let html = '<table class="border-collapse w-full">'

    if (hasHeader) {
      html += '<thead><tr>'
      let colIndex = 0
      while (colIndex < cols) {
        const cell = cells[0][colIndex]
        if (cell && !cell.isMerged) {
          let attrs = 'class="border border-gray-300 px-4 py-2 bg-blue-50 font-semibold"'
          if (cell.rowspan > 1) attrs += ` rowspan="${cell.rowspan}"`
          if (cell.colspan > 1) attrs += ` colspan="${cell.colspan}"`
          html += `<th ${attrs}>${cell.value || '&nbsp;'}</th>`
          colIndex += cell.colspan
        } else {
          colIndex++
        }
      }
      html += '</tr></thead>'
    }

    html += '<tbody>'
    const startRow = hasHeader ? 1 : 0
    for (let rowIndex = startRow; rowIndex < cells.length; rowIndex++) {
      const row = cells[rowIndex]
      html += '<tr>'
      let colIndex = 0

      while (colIndex < cols) {
        const cell = row[colIndex]
        if (cell && !cell.isMerged) {
          let attrs = 'class="border border-gray-300 px-4 py-2"'
          if (cell.rowspan > 1) attrs += ` rowspan="${cell.rowspan}"`
          if (cell.colspan > 1) attrs += ` colspan="${cell.colspan}"`
          html += `<td ${attrs}>${cell.value || '&nbsp;'}</td>`
          colIndex += cell.colspan
        } else {
          colIndex++
        }
      }
      html += '</tr>'
    }

    html += '</tbody></table>'
    return html
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newCells = [...cells]
    newCells[rowIndex][colIndex] = { ...newCells[rowIndex][colIndex], value }
    setCells(newCells)
  }

  const addRow = () => {
    const newCells = [...cells]
    const newRow: CellData[] = []
    for (let j = 0; j < cols; j++) {
      newRow[j] = { value: '', rowspan: 1, colspan: 1, isMerged: false }
    }
    newCells.push(newRow)
    setCells(newCells)
    setRows(rows + 1)
  }

  const removeRow = () => {
    if (rows > 1) {
      const newCells = cells.slice(0, -1)
      setCells(newCells)
      setRows(rows - 1)
    }
  }

  const addCol = () => {
    const newCells = cells.map(row => {
      const newRow = [...row]
      newRow.push({ value: '', rowspan: 1, colspan: 1, isMerged: false })
      return newRow
    })
    setCells(newCells)
    setCols(cols + 1)
  }

  const removeCol = () => {
    if (cols > 1) {
      const newCells = cells.map(row => row.slice(0, -1))
      setCells(newCells)
      setCols(cols - 1)
    }
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (cells[rowIndex][colIndex]?.isMerged) return

    setSelectedCells([{ row: rowIndex, col: colIndex }])
  }

  const handleCellSelect = (rowIndex: number, colIndex: number) => {
    if (cells[rowIndex][colIndex]?.isMerged) return

    setSelectedCells(prev => {
      const exists = prev.find(c => c.row === rowIndex && c.col === colIndex)
      if (exists) {
        return prev.filter(c => !(c.row === rowIndex && c.col === colIndex))
      }
      return [...prev, { row: rowIndex, col: colIndex }].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row
        return a.col - b.col
      })
    })
  }

  const mergeSelectedCells = () => {
    if (selectedCells.length < 2) return

    const minRow = Math.min(...selectedCells.map(c => c.row))
    const maxRow = Math.max(...selectedCells.map(c => c.row))
    const minCol = Math.min(...selectedCells.map(c => c.col))
    const maxCol = Math.max(...selectedCells.map(c => c.col))

    const rowspan = maxRow - minRow + 1
    const colspan = maxCol - minCol + 1

    const newCells = cells.map(row => row.map(cell => ({ ...cell })))

    newCells[minRow][minCol] = {
      value: newCells[minRow][minCol].value,
      rowspan,
      colspan,
      isMerged: false,
    }

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        if (i !== minRow || j !== minCol) {
          newCells[i][j] = {
            value: '',
            rowspan: 1,
            colspan: 1,
            isMerged: true,
          }
        }
      }
    }

    setCells(newCells)
    setMergedCells([...mergedCells, { row: minRow, col: minCol, rowspan, colspan }])
    setSelectedCells([])
  }

  const splitSelectedCell = () => {
    if (selectedCells.length !== 1) return

    const { row, col } = selectedCells[0]
    const cell = cells[row][col]

    if (cell.rowspan <= 1 && cell.colspan <= 1) return

    const newCells = cells.map(r => r.map(c => ({ ...c })))

    for (let i = row; i < row + cell.rowspan; i++) {
      for (let j = col; j < col + cell.colspan; j++) {
        newCells[i][j] = {
          value: i === row && j === col ? cell.value : '',
          rowspan: 1,
          colspan: 1,
          isMerged: false,
        }
      }
    }

    setCells(newCells)
    setMergedCells(mergedCells.filter(m => !(m.row === row && m.col === col)))
    setSelectedCells([])
  }

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.some(c => c.row === rowIndex && c.col === colIndex)
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-300 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">行数:</span>
          <input
            type="number"
            min="1"
            max="20"
            value={rows}
            onChange={(e) => {
              const newRows = parseInt(e.target.value) || 1
              setRows(newRows)
              setCells(prev => {
                const result = [...prev]
                while (result.length < newRows) {
                  result.push(Array(cols).fill(null).map(() => ({ value: '', rowspan: 1, colspan: 1, isMerged: false })))
                }
                return result.slice(0, newRows)
              })
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">列数:</span>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) => {
              const newCols = parseInt(e.target.value) || 1
              setCols(newCols)
              setCells(prev => {
                return prev.map(row => {
                  const result = [...row]
                  while (result.length < newCols) {
                    result.push({ value: '', rowspan: 1, colspan: 1, isMerged: false })
                  }
                  return result.slice(0, newCols)
                })
              })
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            首行作为表头
          </label>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={addRow}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="添加行"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={removeRow}
            disabled={rows <= 1}
            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="删除行"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={addCol}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="添加列"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={removeCol}
            disabled={cols <= 1}
            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="删除列"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={mergeSelectedCells}
            disabled={selectedCells.length < 2}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="合并单元格"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={splitSelectedCell}
            disabled={selectedCells.length !== 1}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="拆分单元格"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCells(initCells(3, 3))
              setRows(3)
              setCols(3)
              setSelectedCells([])
              setMergedCells([])
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
            title="重置表格"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 overflow-auto">
        <table className="border-collapse w-full min-w-[400px]">
          {hasHeader && cells.length > 0 && (
            <thead>
              <tr>
                {cells[0].map((cell, colIndex) => {
                  if (!cell || cell.isMerged) return null
                  return (
                    <th
                      key={`header-${colIndex}`}
                      rowSpan={cell.rowspan}
                      colSpan={cell.colspan}
                      className={`border border-gray-300 px-4 py-2 text-left bg-blue-50 font-semibold ${isCellSelected(0, colIndex) ? 'ring-2 ring-blue-500 bg-blue-100' : ''}`}
                      onClick={() => handleCellClick(0, colIndex)}
                      onMouseEnter={() => handleCellSelect(0, colIndex)}
                    >
                      <input
                        type="text"
                        value={cell.value}
                        onChange={(e) => handleCellChange(0, colIndex, e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                        placeholder="表头"
                      />
                    </th>
                  )
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {cells.slice(hasHeader ? 1 : 0).map((row, rowIndexOffset) => {
              const rowIndex = hasHeader ? rowIndexOffset + 1 : rowIndexOffset
              return (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, colIndex) => {
                    if (!cell || cell.isMerged) return null
                    return (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        rowSpan={cell.rowspan}
                        colSpan={cell.colspan}
                        className={`border border-gray-300 px-4 py-2 ${isCellSelected(rowIndex, colIndex) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellSelect(rowIndex, colIndex)}
                      >
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                          placeholder="单元格"
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-300 text-xs text-gray-500">
        提示：按住鼠标拖拽选择多个单元格，点击合并按钮进行合并
      </div>
    </div>
  )
}