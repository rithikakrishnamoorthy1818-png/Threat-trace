import { Copy, Share2, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { cn } from '../../utils/cn'
import { useNotification } from '../../hooks/useNotification'

type Props = {
  type: 'file' | 'url' | 'pdf'
  explanation: string
  riskScore: number
  classification: string
}

function riskColor(classification: string, score: number) {
  const c = classification.toLowerCase()
  if (c === 'safe' || score <= 30) return '#00ff41'
  if (c === 'phishing') return '#ff9100'
  if (c === 'suspicious' || (score > 30 && score <= 60)) return '#ff9100'
  if (c === 'malicious' || c === 'critical' || score > 60) return '#ff1744'
  return '#ff9100'
}

function RiskIcon({ classification, score }: { classification: string; score: number }) {
  const c = classification.toLowerCase()
  if (c === 'safe' || score <= 30) return <ShieldCheck className="h-6 w-6" style={{ color: '#00ff41' }} />
  if (score > 60) return <ShieldAlert className="h-6 w-6" style={{ color: '#ff1744' }} />
  return <ShieldQuestion className="h-6 w-6" style={{ color: '#ff9100' }} />
}

function formatExplanation(text: string) {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return parts.map((p, i) => {
    const bold = p.replace(
      /\b(PROCESS INJECTION|PHISHING|PACKING|EXECUTE COMMANDS|RECOMMENDATION|CRITICAL THREAT|MALICIOUS|SUSPICIOUS|SAFE|URGENCY|CREDENTIAL HARVESTING|ASSESSMENT)\b/gi,
      '<strong>$1</strong>',
    )
    return (
      <p
        key={i}
        className="leading-relaxed"
        dangerouslySetInnerHTML={{ __html: bold }}
      />
    )
  })
}

export function ExplainabilityPanel({ type, explanation, riskScore, classification }: Props) {
  const notify = useNotification()
  const color = riskColor(classification, riskScore)

  return (
    <Card className="tt-noise border-cyan/40">
      <CardHeader>
        <div className="flex items-center gap-3">
          <RiskIcon classification={classification} score={riskScore} />
          <div>
            <CardTitle>What This Means (AI Explanation)</CardTitle>
            <div className="text-xs text-muted capitalize">
              {type} analysis · {classification} · {riskScore}/100
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              await navigator.clipboard.writeText(explanation)
              notify.success('Copied', 'Explanation copied.')
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => notify.info('Share', 'Share link copied (stub).')}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'space-y-3 rounded-2xl border bg-panel2/30 p-5 text-base leading-7',
          )}
          style={{ borderColor: `${color}55` }}
        >
          {formatExplanation(explanation)}
        </div>
      </CardContent>
    </Card>
  )
}
