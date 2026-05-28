import { AppShell } from '../components/common/AppShell'
import { FileUpload } from '../components/upload/FileUpload'

export default function UploadPage() {
  return (
    <AppShell
      title="Upload"
      subtitle="Submit binaries and archives for malware scanning."
    >
      <FileUpload />
    </AppShell>
  )
}

