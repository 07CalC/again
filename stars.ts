function generateLayer(
  count: number,
  minSize: number,
  maxSize: number,
  minOpacity: number,
  maxOpacity: number
) {
  const shadows = Array.from({ length: count }, () => {
    const x = (Math.random() * 100).toFixed(2)
    const y = (Math.random() * 100).toFixed(2)
    const blur = 0
    const spread = (
      Math.random() * (maxSize - minSize) +
      minSize
    ).toFixed(2)
    const opacity = (
      Math.random() * (maxOpacity - minOpacity) +
      minOpacity
    ).toFixed(2)

    return `${x}vw ${y}vh ${blur}px ${spread}px rgba(255,255,255,${opacity})`
  }).join(',\n    ')

  return shadows
}

const small = generateLayer(350, 0, 0.5, 0.3, 0.7)
const medium = generateLayer(120, 0.5, 1, 0.5, 0.8)
const large = generateLayer(25, 1, 2, 0.7, 1)

const css = `
.starfield {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.starfield::before,
.starfield::after,
.starfield .stars-large {
  content: "";
  position: absolute;
  inset: 0;
}

.starfield::before {
  width: 1px;
  height: 1px;
  box-shadow:
    ${small};
}

.starfield::after {
  width: 1px;
  height: 1px;
  box-shadow:
    ${medium};
}

.starfield .stars-large {
  width: 1px;
  height: 1px;
  box-shadow:
    ${large};
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.4));
}
`.trim()

console.log(css)
