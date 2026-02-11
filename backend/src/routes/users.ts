import express, { Request, Response } from 'express'
import multer from 'multer'
import { PrismaClient } from '@prisma/client'
import { updateUserProfileSchema } from '../validators/taskValidator'
import * as XLSX from 'xlsx'
import { PDFDocument, rgb, PDFPage } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

const router = express.Router()
const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() })

// 构建搜索条件
function buildSearchWhere(search: string) {
  if (!search) return undefined
  return {
    OR: [
      { email: { contains: search } },
      { name: { contains: search } },
      { phone: { contains: search } },
      { address: { contains: search } },
      { company: { contains: search } },
      { position: { contains: search } },
    ],
  }
}

// 分页获取所有用户列表（带搜索功能）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const where = buildSearchWhere(String(search))

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          company: true,
          position: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    res.json({
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// 获取单个用户详情
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        company: true,
        position: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// 更新用户信息
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const validation = updateUserProfileSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors })
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: validation.data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        company: true,
        position: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json(user)
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(500).json({ error: err.message })
  }
})

// 删除用户
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Don't allow deleting self (from auth context)
    const authUserId = (req as any).userId
    if (Number(id) === authUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    })

    res.json({ message: 'User deleted successfully' })
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(500).json({ error: err.message })
  }
})

// 从 Excel 导入用户
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    let imported = 0
    let updated = 0
    const errors: any[] = []

    for (const row of data) {
      try {
        const email = (row as any).email || (row as any).Email
        const name = (row as any).name || (row as any).Name || 'Unknown'

        if (!email) {
          errors.push({ row, error: 'Email is required' })
          continue
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          // 更新现有用户
          await prisma.user.update({
            where: { email },
            data: {
              name: (row as any).name || (row as any).Name || existingUser.name,
              phone: (row as any).phone || (row as any).Phone,
              address: (row as any).address || (row as any).Address,
              company: (row as any).company || (row as any).Company,
              position: (row as any).position || (row as any).Position,
              notes: (row as any).notes || (row as any).Notes,
            },
          })
          updated++
        } else {
          // 无法创建新用户（需要密码），跳过
          errors.push({
            row,
            error: 'New user creation requires password, only existing users can be updated',
          })
        }
      } catch (err: any) {
        errors.push({ row, error: err.message })
      }
    }

    res.json({
      message: 'Import completed',
      imported,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// 导出用户到 Excel
router.get('/export/excel', async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    const where = buildSearchWhere(String(search))

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        company: true,
        position: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const worksheet = XLSX.utils.json_to_sheet(users)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=users_export.xlsx')
    res.send(buffer)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// 导出用户到 PDF
router.get('/export/pdf', async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    const where = buildSearchWhere(String(search))

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        company: true,
        position: true,
        notes: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const pdfDoc = await PDFDocument.create()
    let page = await pdfDoc.addPage([612, 792]) // Letter size
    let yPosition = 750

    const fontSize = 10
    const lineHeight = 15
    const margin = 40
    const pageHeight = 792
    const footerPosition = 50

    // 标题
    page.drawText('用户列表报表', {
      x: margin,
      y: yPosition,
      size: 16,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    // 生成日期
    page.drawText(`生成日期: ${new Date().toLocaleDateString('zh-CN')}`, {
      x: margin,
      y: yPosition,
      size: 9,
      color: rgb(100, 100, 100),
    })
    yPosition -= 20

    // 表头
    const headers = ['ID', 'Email', 'Name', 'Phone', 'Company', 'Position']
    const colWidths = [40, 100, 80, 80, 100, 80]
    let xPosition = margin

    page.drawText('─'.repeat(80), {
      x: margin,
      y: yPosition,
      size: 8,
      color: rgb(150, 150, 150),
    })
    yPosition -= lineHeight

    for (let i = 0; i < headers.length; i++) {
      page.drawText(headers[i], {
        x: xPosition,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      })
      xPosition += colWidths[i]
    }
    yPosition -= lineHeight

    page.drawText('─'.repeat(80), {
      x: margin,
      y: yPosition,
      size: 8,
      color: rgb(150, 150, 150),
    })
    yPosition -= lineHeight

    // 数据行
    for (const user of users) {
      if (yPosition < footerPosition + 20) {
        page = await pdfDoc.addPage([612, 792])
        yPosition = 750
      }

      xPosition = margin
      const rowData = [
        String(user.id),
        user.email,
        user.name,
        user.phone || '-',
        user.company || '-',
        user.position || '-',
      ]

      for (let i = 0; i < rowData.length; i++) {
        const text = rowData[i].substring(0, Math.floor(colWidths[i] / 6))
        page.drawText(text, {
          x: xPosition,
          y: yPosition,
          size: fontSize - 1,
          color: rgb(50, 50, 50),
        })
        xPosition += colWidths[i]
      }
      yPosition -= lineHeight
    }

    // 页脚
    const totalPages = pdfDoc.getPageCount()
    pdfDoc.getPages().forEach((p, index) => {
      p.drawText(`第 ${index + 1} 页，共 ${totalPages} 页`, {
        x: margin,
        y: footerPosition,
        size: 8,
        color: rgb(150, 150, 150),
      })
    })

    const pdfBytes = await pdfDoc.save()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=users_export.pdf')
    res.send(Buffer.from(pdfBytes))
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
