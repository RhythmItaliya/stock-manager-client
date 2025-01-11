import { createLazyFileRoute } from '@tanstack/react-router'
import CSVUpload from '@/features/settings/csv-upload'

export const Route = createLazyFileRoute('/_authenticated/settings/csv-upload')(
  { component: CSVUpload }
)
