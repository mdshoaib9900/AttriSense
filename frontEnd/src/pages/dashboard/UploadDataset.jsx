import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, UploadCloud, Trash2, RefreshCcw } from "lucide-react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function UploadDataset() {
  const token = useAuthStore((state) => state.token);

  // dataset states
  const [existingDataset, setExistingDataset] = useState(null);
  const [replacing, setReplacing] = useState(false);

  // file states
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // fetch my dataset
  const fetchDataset = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/datasets/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setExistingDataset(data.dataset || null);
      }
    } catch (err) {
      console.error("Fetch dataset error:", err);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  // file input handler
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    Papa.parse(selected, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setPreview({
          rows: results.data.length,
          columns: Object.keys(results.data[0] || {}).length,
        });
      },
    });
  };

  // upload logic
  const handleUpload = async () => {
    if (!file) return toast.error("No file selected");

    setIsUploading(true);

    try {
      const filePath = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("datasets")
        .upload(filePath, file);

      if (error) throw error;

      setUploadProgress(100);

      const { data: urlData } = supabase.storage
        .from("datasets")
        .getPublicUrl(filePath);

      const metadata = {
        fileName: file.name,
        firebaseURL: urlData.publicUrl,
        rows: preview?.rows,
        columns: preview?.columns,
      };

      const response = await fetch("http://localhost:5000/api/datasets/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(metadata),
      });

      const result = await response.json();

      if (!response.ok) return toast.error(result.message);

      toast.success(replacing ? "Dataset replaced!" : "Dataset uploaded!");
      setReplacing(false);
      setFile(null);
      setPreview(null);
      fetchDataset();

    } catch (err) {
      toast.error(err.message);
    }

    setIsUploading(false);
  };

  // delete dataset
  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/datasets/mine", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Dataset deleted");
        setExistingDataset(null);
      }
    } catch (err) {
      toast.error("Failed to delete dataset");
    }
  };

  // ---------------------------------------------------------
  //               UI FOR EXISTING DATASET
  // ---------------------------------------------------------

  if (existingDataset && !replacing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 px-6">
        <Card className="w-full max-w-xl bg-white/5 backdrop-blur-sm border border-teal-400/20 shadow-xl p-6 text-white">

          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Dataset Uploaded
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="p-5 bg-teal-400/10 rounded-xl border border-teal-500/30">
              <p className="text-xl font-semibold">{existingDataset.fileName}</p>
              <p className="text-slate-300 mt-2">Rows: <b>{existingDataset.rows}</b></p>
              <p className="text-slate-300">Columns: <b>{existingDataset.columns}</b></p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setReplacing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCcw className="h-5 w-5 mr-2" /> Replace Dataset
              </Button>

              <Button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-5 w-5 mr-2" /> Delete
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------
  //                  YOUR UPLOAD UI
  // ---------------------------------------------------------

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 px-4"> 
      <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-sm border border-teal-400/20 shadow-2xl shadow-teal-500/10">
        
        <CardHeader className="text-center pt-8 pb-4">
          <CardTitle className="text-4xl font-extrabold text-white">
            {replacing ? "Replace Dataset" : "Upload Your Dataset"}
          </CardTitle>
          <p className="text-slate-400 text-base mt-2">
            Supported formats: CSV (preferred), XLSX, XLS
          </p>
        </CardHeader>

        <CardContent className="space-y-8 p-8">

          {/* FILE INPUT AREA */}
          <div className="flex flex-col items-center">
            <label className="w-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-teal-500/50 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors duration-300">
              <div className="flex flex-col items-center">
                <UploadCloud className="h-12 w-12 text-teal-400" />
                <span className="text-white mt-3 font-semibold text-lg">
                  {file ? file.name : "Click or drag your dataset file here"}
                </span>
                <span className="text-slate-400 text-sm mt-1">
                  {file ? `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Max file size: 50MB"}
                </span>
              </div>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>

          {preview && (
            <div className="p-5 bg-teal-400/10 border border-teal-500/30 rounded-xl shadow-lg">
              <h4 className="font-semibold text-teal-300 text-xl mb-3">
                File Validation & Structure
              </h4>
              <div className="flex gap-10 text-white font-medium">
                <p>Rows: <b className="text-teal-400">{preview.rows}</b></p>
                <p>Columns: <b className="text-teal-400">{preview.columns}</b></p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-3">
              <Progress value={uploadProgress} className="w-full h-3 bg-white/20 [&>div]:bg-teal-500" />
              <p className="text-sm text-slate-400 text-center">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={`w-full py-7 text-xl font-bold transition duration-300 ${
              isUploading || !file
                ? "bg-gray-600/50 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-500/30"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6 mr-3" />
                Finalizing Upload...
              </>
            ) : (
              <>
                <UploadCloud className="h-6 w-6 mr-3" />
                {replacing ? "Replace Dataset" : "Confirm & Upload Dataset"}
              </>
            )}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
