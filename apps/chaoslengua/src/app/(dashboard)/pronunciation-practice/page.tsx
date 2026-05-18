"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@chaos/ui"
import { Button } from "@chaos/ui"
import {
  Volume2,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Mic2,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

type Variant = { stress: string; meaning: string; example: string }
type DrillRound = {
  word: string
  variants: Variant[]
  targetVariant: Variant
  shuffledOptions: Variant[]
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function buildDrillQueue(pairs: Record<string, Variant[]>, weakWords: string[] = []): DrillRound[] {
  const words = Object.keys(pairs).filter((w) => pairs[w].length >= 2)
  const weakSet = new Set(weakWords)

  // Weak words first, then shuffle the rest
  const ordered = [
    ...weakWords.filter((w) => words.includes(w)),
    ...shuffle(words.filter((w) => !weakSet.has(w))),
  ]

  return ordered.map((word) => {
    const variants = pairs[word]
    const targetVariant = variants[Math.floor(Math.random() * variants.length)]
    return {
      word,
      variants,
      targetVariant,
      shuffledOptions: shuffle(variants),
    }
  })
}

export default function PronunciationPracticePage() {
  const [pairsData, setPairsData] = useState<Record<string, Variant[]> | null>(null)
  const [weakWords, setWeakWords] = useState<string[]>([])
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [contentError, setContentError] = useState<string | null>(null)

  // Drill state
  const [queue, setQueue] = useState<DrillRound[]>([])
  const [index, setIndex] = useState(0)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [selected, setSelected] = useState<Variant | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [usage, setUsage] = useState<{ used: number; remaining: number; dailyLimit: number } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCacheRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    Promise.all([fetchContent(), fetchWeakWords(), fetchUsage()])
    return () => {
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  async function fetchContent() {
    try {
      const res = await fetch("/api/pronunciation/suggested-words")
      if (!res.ok) throw new Error("Failed to load")
      const data = await res.json()
      setPairsData(data.pairs)
      setWeakWords((prev) => {
        setQueue(buildDrillQueue(data.pairs, prev))
        return prev
      })
    } catch {
      setContentError("No se pudieron cargar los ejercicios.")
    } finally {
      setIsLoadingContent(false)
    }
  }

  async function fetchWeakWords() {
    try {
      const res = await fetch("/api/pronunciation/weak-words")
      if (res.ok) {
        const data = await res.json()
        const words: string[] = (data.weakWords ?? []).map((w: { word: string }) => w.word)
        setWeakWords(words)
        // Re-build queue if pairs data already loaded
        setPairsData((prev) => {
          if (prev) setQueue(buildDrillQueue(prev, words))
          return prev
        })
      }
    } catch {
      // Non-critical — fall back to random order
    }
  }

  async function fetchUsage() {
    try {
      const res = await fetch("/api/tts")
      if (res.ok) {
        const data = await res.json()
        setUsage(data)
      }
    } catch {
      // Non-critical
    }
  }

  const playExample = useCallback(
    async (text: string) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setAudioError(null)

      const cacheKey = `${text}:1.0`
      const cached = audioCacheRef.current.get(cacheKey)
      if (cached) {
        const audio = new Audio(cached)
        audioRef.current = audio
        audio.onplay = () => setIsPlaying(true)
        audio.onended = () => setIsPlaying(false)
        audio.onpause = () => setIsPlaying(false)
        audio.play()
        setHasPlayed(true)
        return
      }

      if (usage && usage.remaining <= 0) {
        setAudioError("Límite diario alcanzado. ¡Vuelve mañana!")
        return
      }

      setIsLoadingAudio(true)
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, speed: 1.0 }),
        })

        if (res.status === 429) {
          const data = await res.json()
          setUsage({ used: data.used, remaining: data.remaining, dailyLimit: data.dailyLimit })
          setAudioError("Límite diario alcanzado. ¡Vuelve mañana!")
          return
        }
        if (!res.ok) throw new Error(await res.text())

        const used = res.headers.get("X-TTS-Characters-Used")
        const remaining = res.headers.get("X-TTS-Characters-Remaining")
        const limit = res.headers.get("X-TTS-Daily-Limit")
        if (used && remaining && limit) {
          setUsage({ used: Number(used), remaining: Number(remaining), dailyLimit: Number(limit) })
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        audioCacheRef.current.set(cacheKey, url)

        const audio = new Audio(url)
        audioRef.current = audio
        audio.onplay = () => setIsPlaying(true)
        audio.onended = () => setIsPlaying(false)
        audio.onpause = () => setIsPlaying(false)
        audio.onerror = () => { setIsPlaying(false); setAudioError("Error de reproducción") }
        audio.play()
        setHasPlayed(true)
      } catch {
        setAudioError("No se pudo generar el audio.")
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [usage]
  )

  const currentRound = queue[index]
  const isRevealed = selected !== null
  const isDone = index >= queue.length && queue.length > 0

  async function logDrillError(word: string, selected: string, correct: string) {
    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          errorType: "pronunciation",
          category: "stress_contrast",
          context: word,
          correction: correct,
          source: "pronunciation_practice",
          modality: "speech",
        }),
      })
    } catch {
      // Non-critical — don't interrupt the drill
    }
  }

  function handleSelect(variant: Variant) {
    if (isRevealed) return
    const isCorrect = variant.stress === currentRound.targetVariant.stress
    setSelected(variant)
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }))
    if (!isCorrect) {
      logDrillError(currentRound.word, variant.stress, currentRound.targetVariant.stress)
    }
  }

  function handleNext() {
    setIndex((i) => i + 1)
    setSelected(null)
    setHasPlayed(false)
    setAudioError(null)
  }

  function handleRestart() {
    if (!pairsData) return
    setQueue(buildDrillQueue(pairsData, weakWords))
    setIndex(0)
    setSelected(null)
    setHasPlayed(false)
    setScore({ correct: 0, total: 0 })
    setAudioError(null)
  }

  // ─── Loading ───

  if (isLoadingContent) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (contentError) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <p className="text-muted-foreground">{contentError}</p>
        <Button onClick={fetchContent}>Reintentar</Button>
      </div>
    )
  }

  // ─── Done state ───

  if (isDone) {
    const pct = Math.round((score.correct / score.total) * 100)
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic2 className="h-7 w-7 text-primary" />
            Práctica de Pronunciación
          </h1>
          <p className="text-muted-foreground">Pares mínimos — acento de sílaba</p>
        </div>

        <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-5xl font-bold">{pct}%</p>
            <p className="text-lg text-muted-foreground">
              {score.correct} de {score.total} correctas
            </p>
            <p className="text-sm text-muted-foreground">
              {pct >= 80
                ? "¡Excelente oído! Tus oídos están calibrados."
                : pct >= 50
                ? "Buen comienzo. El acento llega con la práctica."
                : "El acento es difícil — sigue practicando."}
            </p>
            <Button onClick={handleRestart} className="mt-4 gap-2">
              <RotateCcw className="h-4 w-4" />
              Practicar de nuevo
            </Button>
          </CardContent>
        </Card>

        {usage && (
          <p className="text-center text-xs text-muted-foreground">
            {usage.used.toLocaleString()} / {usage.dailyLimit.toLocaleString()} caracteres usados hoy
          </p>
        )}
      </div>
    )
  }

  // ─── Drill ───

  const limitReached = usage ? usage.remaining <= 0 : false

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic2 className="h-7 w-7 text-primary" />
            Práctica de Pronunciación
          </h1>
          <p className="text-muted-foreground">Pares mínimos — acento de sílaba</p>
        </div>
        {score.total > 0 && (
          <div className="text-right text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{score.correct}/{score.total}</p>
            <p>correctas</p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(index / queue.length) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground -mt-4">
        {index + 1} de {queue.length}
      </p>

      {/* Challenge card */}
      <Card className="rounded-2xl border-border/40 bg-gradient-to-br from-accent/5 via-background to-primary/5 border-l-4 border-l-primary">
        <CardContent className="p-6 space-y-6">

          {/* Prompt */}
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              ¿Qué escuchaste?
            </p>
            <p className="text-xs text-muted-foreground/60">
              Escucha y elige la forma correcta
            </p>
          </div>

          {/* Play button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => playExample(currentRound.targetVariant.example)}
              disabled={isLoadingAudio || limitReached}
              className="gap-2 rounded-full px-8 shadow-lg shadow-primary/20"
              aria-label="Escuchar el ejemplo"
            >
              {isLoadingAudio ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Volume2 className="h-5 w-5 animate-pulse" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
              {hasPlayed ? "Escuchar de nuevo" : "Escuchar"}
            </Button>
          </div>

          {audioError && (
            <div className="flex items-center gap-2 text-destructive text-sm justify-center">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {audioError}
            </div>
          )}

          {/* Options */}
          {hasPlayed && (
            <div className="space-y-2">
              {currentRound.shuffledOptions.map((variant) => {
                const isSelected = selected?.stress === variant.stress
                const isCorrectAnswer = variant.stress === currentRound.targetVariant.stress
                let optionStyle = "border-border/40 bg-card/50 hover:border-primary/40 hover:bg-primary/5"
                if (isRevealed) {
                  if (isCorrectAnswer) {
                    optionStyle = "border-green-500/60 bg-green-500/10"
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle = "border-destructive/60 bg-destructive/10"
                  } else {
                    optionStyle = "border-border/20 bg-muted/30 opacity-50"
                  }
                } else if (isSelected) {
                  optionStyle = "border-primary/60 bg-primary/10"
                }

                return (
                  <button
                    key={variant.stress}
                    onClick={() => handleSelect(variant)}
                    disabled={isRevealed}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${optionStyle} disabled:cursor-default`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="font-mono font-bold text-sm tracking-wide">{variant.stress}</p>
                        <p className="text-xs text-muted-foreground">{variant.meaning}</p>
                      </div>
                      {isRevealed && isCorrectAnswer && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      )}
                      {isRevealed && isSelected && !isCorrectAnswer && (
                        <XCircle className="h-5 w-5 text-destructive shrink-0" />
                      )}
                    </div>

                    {/* Example sentence shown on reveal for the correct answer */}
                    {isRevealed && isCorrectAnswer && (
                      <p className="mt-2 text-xs text-muted-foreground italic border-t border-border/30 pt-2">
                        {variant.example}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Reveal feedback + next */}
          {isRevealed && (
            <div className="flex items-center justify-between pt-2">
              <p className={`text-sm font-medium ${selected?.stress === currentRound.targetVariant.stress ? "text-green-500" : "text-destructive"}`}>
                {selected?.stress === currentRound.targetVariant.stress ? "¡Correcto!" : "Incorrecto"}
              </p>
              <Button onClick={handleNext} size="sm" className="gap-1.5">
                {index + 1 < queue.length ? (
                  <>Siguiente <ChevronRight className="h-4 w-4" /></>
                ) : (
                  <>Ver resultado <ChevronRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      {usage && (
        <p className="text-center text-xs text-muted-foreground">
          {usage.used.toLocaleString()} / {usage.dailyLimit.toLocaleString()} caracteres usados hoy
          {limitReached && <span className="text-destructive ml-1">(límite alcanzado)</span>}
        </p>
      )}
    </div>
  )
}
