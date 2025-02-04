import ContentSection from '../components/content-section'
import { UpstoxLinkGenerator } from './upstox-form'

export default function GenerateLink() {
  return (
    <ContentSection
      title='Link Generate'
      desc='This is how others will see you on the site.'
    >
      <UpstoxLinkGenerator />
    </ContentSection>
  )
}
