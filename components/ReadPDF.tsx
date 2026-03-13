import React, { useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import mammoth from 'mammoth';
import pdfToText from 'react-pdftotext';

import { Input } from '@/components/ui/input';

const ReadPDF = ({ getFileText, clearFiles }) => {
  const [fileTexts, setFileTexts] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  async function extractText(event) {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);

    const extractPromises = files.map((file) => {
      if (file.type === 'application/pdf') {
        // Extract text from PDF
        return pdfToText(file)
          .then((text) => text)
          .catch((error) => {
            console.error('Failed to extract text from PDF:', error);
            return 'Error extracting text from PDF';
          });
      } else if (file.type === 'text/plain') {
        // Extract text from plain text file
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject('Error reading text file');
          reader.readAsText(file);
        });
      } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // Extract text from DOCX file
        return mammoth
          .extractRawText({ arrayBuffer: file.arrayBuffer() })
          .then((result) => result.value)
          .catch((error) => {
            console.error('Failed to extract text from DOCX:', error);
            return 'Error extracting text from DOCX';
          });
      } else {
        return Promise.resolve('Unsupported file type');
      }
    });

    const textsArray = await Promise.all(extractPromises);
    setFileTexts(textsArray);

    const combinedText = textsArray.join('\n\n'); // Combine all extracted text
    getFileText(combinedText);
  }

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFileTexts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label>
        <Input
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={extractText}
          multiple
          style={{ display: 'none' }}
        />
        <Paperclip style={{ cursor: 'pointer' }} />
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Files:</h3>
          <ul className="mt-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded mr-2" />
                <span className="text-sm flex-1">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReadPDF;
