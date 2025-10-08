// client/InterviewIngest.jsx
import { useRef, useState } from 'react';
import axios from 'axios'

export default function ResumeUploader() {
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  async function handlePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Add file validation
    if (file.size > 10 * 1024 * 1024) {
      setErr('File size must be less than 10MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setErr('File type not supported. Please upload PDF or Word document.');
      return;
    }

    setErr('');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('resume', file);
      const res = await axios.post('http://localhost:3000/api/resumeupload', form)
      console.log(res.data)
      setResult(res.data);
    } catch (e) {
      setErr(e.message || 'Upload failed');
    } finally {
      setLoading(false);
      if (ref.current) ref.current.value = '';
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input 
          ref={ref} 
          type="file" 
          accept=".pdf,.doc,.docx" 
          onChange={handlePick}
          disabled={loading} 
          className="w-full"
        />
        {loading && (
          <div className="mt-4 text-blue-600">
            <p>Uploading resume...</p>
            <div className="h-1 w-full bg-blue-200 rounded-full mt-2">
              <div className="h-1 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {err && <p className="mt-4 text-red-600 bg-red-50 p-3 rounded">{err}</p>}
        {result && (
          <div className="mt-4">
            <h3 className="font-medium">Upload Success!</h3>
            <pre className="bg-gray-50 p-3 rounded mt-2 text-sm">
              {/* {JSON.stringify(result, null, 2)} */}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

