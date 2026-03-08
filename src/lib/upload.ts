import fs from "fs/promises"
import path from "path"

/**
 * Saves an uploaded file to public/uploads/YYYY/MM/DD/ and returns its metadata.
 * filePath is relative to public/ (e.g. /uploads/2026/02/27/uuid.png).
 */
export async function saveFile(
  file: File,
  dateStr: string, // YYYY-MM-DD
): Promise<{
  filename: string
  filePath: string
  fileSize: number
  mimeType: string
}> {
  const [year, month, day] = dateStr.split("-")
  const ext = path.extname(file.name) || ".png"
  const filename = `${crypto.randomUUID()}${ext}`

  const dirPath = path.join(process.cwd(), "public", "uploads", year!, month!, day!)
  await fs.mkdir(dirPath, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(path.join(dirPath, filename), buffer)

  return {
    filename,
    filePath: `/uploads/${year}/${month}/${day}/${filename}`,
    fileSize: buffer.length,
    mimeType: file.type || "image/png",
  }
}

/**
 * Deletes a file from the public/ directory given its relative filePath.
 * Silently ignores missing files.
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath)
    await fs.unlink(fullPath)
  } catch {
    // File may already be gone; that's fine
  }
}
