interface ColorsProps {
  hex: string | null | undefined
  percent: number
}

export function colors(props: ColorsProps): string {
  if (props.hex === null || props.hex === undefined) {
    return '#E0DEF7'
  }
  const num = parseInt(props.hex.slice(1), 16)
  const r = Math.min(
    255,
    (num >> 16) + Math.round((255 - (num >> 16)) * (props.percent / 100))
  )
  const g = Math.min(
    255,
    ((num >> 8) & 0x00ff) +
      Math.round((255 - ((num >> 8) & 0x00ff)) * (props.percent / 100))
  )
  const b = Math.min(
    255,
    (num & 0x0000ff) +
      Math.round((255 - (num & 0x0000ff)) * (props.percent / 100))
  )
  return `rgb(${r}, ${g}, ${b})`
}
