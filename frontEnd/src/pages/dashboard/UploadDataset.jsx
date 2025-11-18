import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, UploadCloud } from "lucide-react";
import Papa from "papaparse";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/use-toast";

export default function UploadDataset() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const token = useAuthStore((state) => state.token);

  // When user selects a file
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (
      selected.type !== "text/csv" &&
      selected.type !== "application/vnd.ms-excel" &&
      selected.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast({ title: "Invalid file type", description: "Upload CSV or Excel only." });
      return;
    }

    setFile(selected);

    Papa.parse(selected, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        setPreview({
          rows: results.data.length,
          columns: Object.keys(results.data[0] || {}).length,
        });
      },
    });
  };

  // Main upload logic
  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected" });
      return;
    }

    setIsUploading(true);

    try {
      // 1️⃣ Upload to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `datasets/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed", (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      uploadTask.on("error", (error) => {
        console.error(error);
        toast({ title: "Upload failed", description: error.message });
        setIsUploading(false);
      });

      uploadTask.on("complete", async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // 2️⃣ Send metadata to backend
        const metadata = {
          fileName: file.name,
          firebaseURL: downloadURL,
          rows: preview?.rows,
          columns: preview?.columns,
        };

        const response = await fetch("/api/datasets/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(metadata),
        });

        const result = await response.json();

        if (!response.ok) {
          toast({ title: "Upload failed", description: result.message });
        } else {
          toast({ title: "Upload successful!", description: "Dataset saved." });
        }

        setIsUploading(false);
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error uploading", description: err.message });
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Dataset (CSV/Excel)</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* File input */}
          <Input 
            type="file" 
            accept=".csv, .xlsx, .xls" 
            onChange={handleFileChange}
            disabled={isUploading}
          />

          {/* Preview */}
          {preview && (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm">Rows: <b>{preview.rows}</b></p>
              <p className="text-sm">Columns: <b>{preview.columns}</b></p>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm mt-2 text-gray-600">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {/* Upload button */}
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="w-full flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="h-5 w-5" />
                Upload Dataset
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
