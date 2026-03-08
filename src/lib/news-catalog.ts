import { type NewsStrength } from "~/types"

export function newsStrengthBadgeClass(strength: NewsStrength): string {
  const map: Record<NewsStrength, string> = {
    STRONG: "bg-red-500/20 text-red-400 border-red-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    WEAK: "bg-muted/60 text-muted-foreground border-muted-foreground/20",
  }
  return map[strength]
}
