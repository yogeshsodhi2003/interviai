import ResumeUploader from '../components/ResumeUploader';

export default function InterviewPage() {
  function handleUploaded(res) {
    // Save res.secure_url, public_id, bytes, etc. to your DB if needed
    console.log('Cloudinary uploaded:', res);
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Start Interview</h1>
      <ResumeUploader/>
    </div>
  );
}
