import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../services/api";

const Documents = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [deletingFile, setDeletingFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Failed to load documents.");
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setSuccess("");
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [".pdf", ".txt", ".docx"];

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedTypes.includes(extension)) {
      setSelectedFile(null);
      setError("Only PDF, TXT, and DOCX files are supported.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setError("File size must be less than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a document first.");
      return;
    }

    setUploading(true);
    setSuccess("");
    setError("");

    try {
      const data = await uploadDocument(selectedFile);

      setSuccess(
        `${data.filename} uploaded successfully. ${data.chunks_created} chunks created.`
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Document upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId, filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingFile(filename);
    setSuccess("");
    setError("");

    try {
      await deleteDocument(documentId);

      setSuccess(`${filename} deleted successfully.`);

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Failed to delete document.");
    } finally {
      setDeletingFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-3xl font-bold">
              Study Documents
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Upload study material for your AI learning agents.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-12 text-center transition hover:border-cyan-400/50 hover:bg-slate-900"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <Upload size={30} />
            </div>

            <h2 className="text-xl font-semibold">
              Upload your study material
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Click here to select a PDF, TXT, or DOCX file
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Maximum file size: 10 MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                  <FileText size={22} />
                </div>

                <div>
                  <p className="max-w-[250px] truncate font-medium sm:max-w-md">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Processing..." : "Upload"}
              </button>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-300">
              <CheckCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm">
                {success}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-300">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Documents */}
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Your Documents
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Study materials available to your AI agents.
                </p>
              </div>

              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                {documents.length}{" "}
                {documents.length === 1 ? "document" : "documents"}
              </span>
            </div>

            {loadingDocuments ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <p className="text-sm text-slate-400">
                  Loading documents...
                </p>
              </div>
            ) : documents.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                <FileText
                  size={32}
                  className="mx-auto mb-3 text-slate-600"
                />

                <p className="text-slate-400">
                  No documents uploaded yet.
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Upload study material to start using your AI agents.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={ddocument.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.05] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {document.filename}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {(document.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(document.id, document.filename)
                      }
                      disabled={deletingFile === document.filename}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingFile === document.filename
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <FileText
                className="mb-3 text-cyan-400"
                size={22}
              />

              <h3 className="font-semibold">
                Supported Files
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                PDF, TXT and DOCX
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Upload
                className="mb-3 text-purple-400"
                size={22}
              />

              <h3 className="font-semibold">
                Automatic Processing
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Documents are split and embedded automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <CheckCircle
                className="mb-3 text-emerald-400"
                size={22}
              />

              <h3 className="font-semibold">
                Private RAG
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your documents are isolated by user account.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;