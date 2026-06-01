export type ClipboardWriter = {
  writeText: (text: string) => Promise<void>
}

export const copyTextToClipboard = async (clipboard: ClipboardWriter | undefined, text: string) => {
  if (!clipboard) {
    return false
  }

  try {
    await clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
