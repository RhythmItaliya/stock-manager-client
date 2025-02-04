import { createLazyFileRoute } from '@tanstack/react-router'
import LinkGenerator from '@/features/settings/upstox'

export const Route = createLazyFileRoute(
  '/_authenticated/settings/link-generator'
)({
  component: LinkGenerator,
})
