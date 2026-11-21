export function powerShellExcerpt(markdown = '') {
  let opening: RegExpMatchArray | null = null
  let lines: string[] = []
  let firstExcerpt = ''

  for (const line of markdown.split(/\r?\n/)) {
    if (!opening) {
      opening = line.match(/^ {0,3}(`{3,}|~{3,})\s*([^\s`~]*)/)
      continue
    }

    const closing = line.match(/^ {0,3}(`{3,}|~{3,})\s*$/)
    const marker = opening[1]
    if (!closing || closing[1][0] !== marker[0] || closing[1].length < marker.length) {
      if (opening[2].toLowerCase() === 'powershell') lines.push(line)
      continue
    }

    const firstContent = lines.findIndex((value) => value.trim())
    const content = firstContent < 0 ? [] : lines.slice(firstContent)
    const excerpt = content.join('\n').trimEnd()
    if (excerpt.trim()) {
      if (content.filter((value) => value.trim()).length > 1) {
        return content.slice(0, 4).join('\n').trimEnd()
      }
      firstExcerpt ||= excerpt
    }
    opening = null
    lines = []
  }

  return firstExcerpt
}
