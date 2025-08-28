import Header from "@/components/Header";
import UploadHistory from "@/components/UploadHistory";
import UploadPdf from "@/components/UploadPdf";
import { useState } from "react";

const AdminPanel = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  return (
    <section className="flex flex-col pb-4 min-h-screen bg-[#0C0E16]  ">
      <div className="text-white p-5 mb-5 border-b border-gray-100">
        <Header />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4 p-4">
        <div className="text-white">
          <h2 className="text-lg font-semibold">Upload PDF</h2>
          <p className="text-sm text-gray-500 mb-4">Upload a PDF file</p>
          <UploadPdf file={pdfFile} onUpload={setPdfFile} />
        </div>
        <div className="text-white">
          <h2 className="text-lg font-semibold">Upload History</h2>
          <p className="text-sm text-gray-500 mb-4">Recently uploaded files</p>
          <UploadHistory />
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
