import { NextResponse } from "next/server"
import { prisma } from "~/lib/prisma"
import { saveFile } from "~/lib/upload"

// POST /api/screenshots
// Accepts multipart/form-data with fields: file (File), date (YYYY-MM-DD)
export async function POST(req: Request) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ success: false, error: "无法解析上传数据" }, { status: 400 })
  }

  const file = formData.get("file")
  const dateStr = formData.get("date")

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "缺少文件字段 file" }, { status: 400 })
  }
  if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ success: false, error: "缺少或格式错误的日期字段 date" }, { status: 400 })
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ success: false, error: "只支持图片文件（PNG/JPG/GIF/WebP）" }, { status: 400 })
  }

  try {
    const saved = await saveFile(file, dateStr)
    const sessionDate = new Date(`${dateStr}T00:00:00.000Z`)

    const screenshot = await prisma.screenshot.create({
      data: {
        filename: saved.filename,
        originalName: file.name,
        filePath: saved.filePath,
        fileSize: saved.fileSize,
        mimeType: saved.mimeType,
        sessionDate,
      },
    })

    return NextResponse.json({ success: true, data: screenshot }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/screenshots]", error)
    return NextResponse.json({ success: false, error: "上传失败，请重试" }, { status: 500 })
  }
}
