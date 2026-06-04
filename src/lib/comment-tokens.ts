export const commentDeleteTokenKey = (commentId: number) =>
  `comment_delete_${commentId}`

export function saveCommentDeleteToken(commentId: number, token: string) {
  localStorage.setItem(commentDeleteTokenKey(commentId), token)
}

export function getCommentDeleteToken(commentId: number): string | null {
  return localStorage.getItem(commentDeleteTokenKey(commentId))
}

export function removeCommentDeleteToken(commentId: number) {
  localStorage.removeItem(commentDeleteTokenKey(commentId))
}

export function canDeleteComment(commentId: number): boolean {
  return Boolean(getCommentDeleteToken(commentId))
}
