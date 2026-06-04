'use client'

import {
  isSpeechSynthesisSupported,
  pickEnglishVoice,
  splitSpeechChunks,
} from '@/lib/article-speech'
import { useCallback, useEffect, useRef, useState } from 'react'

export type SpeechStatus = 'idle' | 'playing' | 'paused'

export function useArticleSpeech(text: string) {
  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [supported, setSupported] = useState(false)
  const chunksRef = useRef<string[]>([])
  const indexRef = useRef(0)
  const cancelledRef = useRef(false)

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported())
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return
    cancelledRef.current = true
    window.speechSynthesis.cancel()
    indexRef.current = 0
    setStatus('idle')
  }, [])

  const speakNextChunk = useCallback(() => {
    const synth = window.speechSynthesis
    if (!synth || indexRef.current >= chunksRef.current.length) {
      stop()
      return
    }

    const utterance = new SpeechSynthesisUtterance(
      chunksRef.current[indexRef.current],
    )
    utterance.lang = 'en-US'

    const voice = pickEnglishVoice(synth.getVoices())
    if (voice) utterance.voice = voice

    utterance.onend = () => {
      if (cancelledRef.current) return
      indexRef.current += 1
      speakNextChunk()
    }

    utterance.onerror = () => {
      stop()
    }

    synth.speak(utterance)
  }, [stop])

  const play = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || !isSpeechSynthesisSupported()) return

    const chunks = splitSpeechChunks(trimmed)
    if (chunks.length === 0) return

    chunksRef.current = chunks
    indexRef.current = 0
    cancelledRef.current = false
    window.speechSynthesis.cancel()
    setStatus('playing')
    speakNextChunk()
  }, [text, speakNextChunk])

  useEffect(() => {
    stop()
  }, [text, stop])

  const pause = useCallback(() => {
    const synth = window.speechSynthesis
    if (!synth?.speaking || synth.paused) return
    synth.pause()
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    const synth = window.speechSynthesis
    if (!synth?.paused) return
    synth.resume()
    setStatus('playing')
  }, [])

  const toggle = useCallback(() => {
    if (status === 'playing') {
      pause()
      return
    }
    if (status === 'paused') {
      resume()
      return
    }
    play()
  }, [status, play, pause, resume])

  useEffect(() => {
    if (!supported) return

    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    status,
    supported,
    toggle,
    stop,
    isPlaying: status === 'playing',
    isPaused: status === 'paused',
  }
}
