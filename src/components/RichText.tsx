import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  data: SerializedEditorState
  className?: string
}

export function RichText({ data, className }: Props) {
  return (
    <LexicalRichText
      data={data}
      className={className ?? 'prose prose-zinc max-w-none dark:prose-invert'}
    />
  )
}
