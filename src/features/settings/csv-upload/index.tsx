import ContentSection from '../components/content-section'
import { CSVUploadForm } from './csv-upload-form'

export default function CSVUpload() {
  return (
    <ContentSection
      title='CSV File Upload'
      desc='Upload a CSV file to customize and configure app settings. Ensure your file follows the correct format for seamless integration.'
    >
      <CSVUploadForm />
    </ContentSection>
  )
}
