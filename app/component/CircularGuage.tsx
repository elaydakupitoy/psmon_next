type Props = {
  value: number | null
  color?: string
}

export default function CircularGauge({ value, color = "#e11d48" }: Props) {
  const radius = 45
  const stroke = 6
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI

  const percent = value ?? 0
  const strokeDashoffset =
    circumference - (percent / 100) * circumference

  return (
    <svg height={120} width={120}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={60}
        cy={60}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={60}
        cy={60}
        transform="rotate(-90 60 60)"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-xl font-semibold"
      >
        {value === null ? "NaN%" : `${value}%`}
      </text>
    </svg>
  )
}