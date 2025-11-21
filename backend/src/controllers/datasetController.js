const Dataset = require("../models/Datasets.js"); // Ensure extension is correct for your project
const supabase = require("../supabaseClient");
const axios = require("axios");
const XLSX = require("xlsx");
const Papa = require("papaparse");



// Helper function to extract storage path from URL
// Fixes the bug where spaces (%20) prevented deletion
const getStoragePathFromUrl = (fullUrl) => {
  try {
    // 1. Split by the bucket name to find the relative path
    // format: https://xyz.supabase.co/.../public/datasets/1234-file.csv
    const pathPart = fullUrl.split("/datasets/")[1];
    
    if (!pathPart) return null;

    // 2. CRITICAL FIX: Decode the URL (e.g., turns "my%20file.csv" back into "my file.csv")
    return decodeURIComponent(pathPart);
  } catch (err) {
    console.error("Error parsing URL:", err);
    return null;
  }
};

// Upload or Replace Dataset
const uploadDataset = async (req, res) => {
  try {
    // Ensure req.user exists (middleware should handle this)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { fileName, firebaseURL, rows, columns } = req.body; // Note: variable is named firebaseURL but holds Supabase URL

    if (!fileName || !firebaseURL || !rows || !columns) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if this user already has a dataset
    const existing = await Dataset.findOne({ userId });

    if (existing) {
      // --- BUG FIX START ---
      const oldFilePath = getStoragePathFromUrl(existing.firebaseURL);

      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from("datasets")
          .remove([oldFilePath]); // Now passing the decoded, correct path

        if (deleteError) {
          console.error("Supabase delete warning (old file):", deleteError);
          // We don't return 500 here; we allow the new upload to proceed even if old delete failed
          // but logging it is important.
        } else {
          console.log("Old file deleted from storage:", oldFilePath);
        }
      }
      // --- BUG FIX END ---

      // Delete old metadata from MongoDB
      await Dataset.deleteOne({ userId });
    }

    // Create new record
    const dataset = await Dataset.create({
      userId,
      fileName,
      firebaseURL,
      rows,
      columns,
    });

    return res.status(201).json({
      message: existing
        ? "Dataset replaced successfully"
        : "Dataset uploaded successfully",
      dataset,
    });

  } catch (error) {
    console.error("Dataset upload error:", error);
    return res.status(500).json({ message: "Server error during upload" });
  }
};

// Get the logged-in user's dataset
const getMyDataset = async (req, res) => {
  try {
    const userId = req.user.id;

    const dataset = await Dataset.findOne({ userId });
    
    if (!dataset) {
      return res.status(200).json({ dataset: null }); 
    }

    return res.status(200).json({ dataset }); 

  } catch (error) {
    console.error("Get dataset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete the logged-in user's dataset
const deleteMyDataset = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Dataset.findOne({ userId });
    if (!existing) {
      return res.status(404).json({ message: "No dataset to delete" });
    }

    // --- BUG FIX START ---
    const filePath = getStoragePathFromUrl(existing.firebaseURL);

    if (filePath) {
      const { error } = await supabase.storage
        .from("datasets")
        .remove([filePath]);

      if (error) {
        console.error("Supabase delete failed:", error);
        return res.status(500).json({ message: "Failed to delete file from storage" });
      }
    } else {
      console.warn("Could not parse file path from URL, deleting metadata only.");
    }
    // --- BUG FIX END ---

    // Delete from MongoDB
    await Dataset.deleteOne({ userId });

    return res.status(200).json({ message: "Dataset deleted successfully" });

  } catch (error) {
    console.error("Delete dataset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// // Analyze Dataset (fetch from Supabase & parse)
// const analyzeDataset = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // 1. Fetch dataset record
//     const dataset = await Dataset.findOne({ userId });
//     if (!dataset) {
//       return res.status(404).json({ message: "No dataset found" });
//     }

//     // 2. Download from Supabase (public URL)
//     const fileResponse = await axios.get(dataset.firebaseURL, {
//       responseType: "arraybuffer",
//     });

//     const buffer = fileResponse.data;
//     let jsonData = [];

//     // 3. Detect file extension (CSV or Excel)
//     if (dataset.fileName.endsWith(".csv")) {
//       const text = Buffer.from(buffer).toString("utf-8");
//       jsonData = Papa.parse(text, { header: true }).data;
//     } else {
//       const workbook = XLSX.read(buffer, { type: "buffer" });
//       const sheet = workbook.SheetNames[0];
//       jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
//     }

//     if (!jsonData || jsonData.length === 0) {
//       return res.status(400).json({ message: "Dataset is empty" });
//     }

//     // 4. Extract column names
//     const columns = Object.keys(jsonData[0]);

//     // 5. Return summary
//     return res.status(200).json({
//       message: "Dataset analyzed successfully",
//       analysis: {
//         columns,
//         totalRows: jsonData.length,
//         totalColumns: columns.length,
//         sample: jsonData.slice(0, 10),
//       },
//     });

//   } catch (error) {
//     console.error("Analyze dataset error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// helper to compute basic stats
function computeSummary(rows) {
  const total = rows.length;
  const attritionCount = rows.filter(r => String(r.Attrition).toLowerCase() === "yes").length;
  const attritionRate = total ? (attritionCount / total) * 100 : 0;

  // Avg salary
  const incomes = rows.map(r => Number(
  Number(r.MonthlyIncome) ||
  Number(r.MonthlyRate) ||
  (Number(r.DailyRate) * 22) ||
  (Number(r.HourlyRate) * 160) ||
  0
  )).filter(Number.isFinite);
  
  const salarySlabs=rows.map(r => Number(r.salarySlabs || r.salaryslabs || 0 )).filter(Number.isFinite);
  const avgIncome = incomes.length ? (incomes.reduce((a,b)=>a+b,0)/incomes.length) : 0;

  // Age buckets
  const ageBuckets = {};
  rows.forEach(r => {
    const age = Number(r.Age || r.age);
    if (!Number.isFinite(age)) return;
    const bucket = `${Math.floor(age/10)*10}s`; // "20s", "30s"
    ageBuckets[bucket] = ageBuckets[bucket] || { yes: 0, no: 0, total: 0 };
    const isYes = String(r.Attrition).toLowerCase() === "yes";
    if (isYes) ageBuckets[bucket].yes++;
    else ageBuckets[bucket].no++;
    ageBuckets[bucket].total++;
  });

  // JobRole counts for attrition
  const jobRole = {};
  rows.forEach(r => {
    const role = r.JobRole || r.jobrole || "Unknown";
    if (!jobRole[role]) jobRole[role] = { yes:0, no:0, total:0 };
    const isYes = String(r.Attrition).toLowerCase() === "yes";
    if (isYes) jobRole[role].yes++; else jobRole[role].no++;
    jobRole[role].total++;
  });

  // OverTime counts
  const overtime = { Yes: 0, No: 0 };
  rows.forEach(r => {
    const ot = (r.OverTime || r.overtime || "No") ;
    const key = String(ot).toLowerCase().startsWith("y") ? "Yes" : "No";
    if (String(r.Attrition).toLowerCase() === "yes") overtime[key]++;
  });

  // JobSatisfaction distribution
  const jobSatisfaction = {};
  rows.forEach(r => {
    const js = r.JobSatisfaction ?? r.jobsatisfaction ?? null;
    if (js === null || js === undefined) return;
    jobSatisfaction[js] = jobSatisfaction[js] ? jobSatisfaction[js] + 1 : 1;
  });

  // WorkLifeBalance distribution
  const workLife = {};
  rows.forEach(r => {
    const w = r.WorkLifeBalance ?? r.worklifebalance ?? null;
    if (w === null || w === undefined) return;
    workLife[w] = workLife[w] ? workLife[w] + 1 : 1;
  });
 const department = {};
  rows.forEach(r => {
    const dept = r.Department || r.department || "Unknown";
    if (!department[dept]) department[dept] = { yes: 0, no: 0, total: 0 };
    const isYes = String(r.Attrition).toLowerCase() === "yes";
    if (isYes) department[dept].yes++;
    else department[dept].no++;
    department[dept].total++;
  });
  // Salary Distribution Buckets
const salaryBands = { "<3k": 0, "3k-6k": 0, "6k-10k": 0, "10k+": 0 };
const salarySlabCounts = {};

rows.forEach(r => {
  const { income, slab, isSlab } = extractIncome(r);

  if (isSlab) {
    salarySlabCounts[slab] = (salarySlabCounts[slab] || 0) + 1;
    return;
  }

  if (!Number.isFinite(income)) return;

  if (income < 3000) salaryBands["<3k"]++;
  else if (income < 6000) salaryBands["3k-6k"]++;
  else if (income < 10000) salaryBands["6k-10k"]++;
  else salaryBands["10k+"]++;
});


 
  const education = {};
  rows.forEach(r => {
    const edu = r.EducationField || r.educationfield || "Unknown";
    education[edu] = (education[edu] || 0) + 1;
  });


  const tenure = {};
  rows.forEach(r => {
    const yrs = Number(r.YearsAtCompany || r.yearsatcompany);
    if (!Number.isFinite(yrs)) return;

    const bucket =
      yrs < 2 ? "0-1" :
      yrs < 5 ? "2-4" :
      yrs < 10 ? "5-9" :
      yrs < 15 ? "10-14" : "15+";

    tenure[bucket] = (tenure[bucket] || 0) + 1;
  });
  return {
    total,
    attritionCount,
    attritionRate,
    avgIncome,
    ageBuckets,
    jobRole,
    overtime,
    jobSatisfaction,
    workLife,
     department,
    education,
    tenure,
    salarySlabs,
    salaryBands,
    salarySlabCounts
  };
}

const analyzeDataset = async (req, res) => {
  try {
    const userId = req.user.id;
    const dataset = await Dataset.findOne({ userId });
    if (!dataset) return res.status(404).json({ message: "No dataset found" });

    const fileResponse = await axios.get(dataset.firebaseURL, { responseType: "arraybuffer" });
    const buffer = fileResponse.data;
    let rows = [];

    if (dataset.fileName.toLowerCase().endsWith(".csv")) {
      const csvText = Buffer.from(buffer).toString("utf-8");
      rows = Papa.parse(csvText, { header: true, dynamicTyping: true }).data;
    } else {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, defval: null });
    }

    if (!rows || rows.length === 0) return res.status(400).json({ message: "Dataset empty" });

    const columns = Object.keys(rows[0]);
    const summary = computeSummary(rows);

    return res.status(200).json({
      message: "Analyzed",
      analysis: {
        columns,
        totalRows: rows.length,
        totalColumns: columns.length,
        sample: rows.slice(0, 10),
        summary
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
// --- Robust Salary Extraction ---
function extractIncome(r) {
  const monthlyIncome = Number(r.MonthlyIncome || r.monthlyincome || 0);
  const monthlyRate = Number(r.MonthlyRate || r.monthlyrate || 0);
  const dailyRate = Number(r.DailyRate || r.dailyrate || 0);
  const hourlyRate = Number(r.HourlyRate || r.hourlyrate || 0);
  const salarySlab = r.salarySlabs || r.salaryslabs || null;

  // Case 1: Dataset has salary slab categories
  if (salarySlab) {
    return {
      slab: String(salarySlab).trim(),
      income: null,
      isSlab: true,
    };
  }

  // Case 2: dataset has numeric salary
  if (monthlyIncome > 0) {
    return { income: monthlyIncome, slab: null, isSlab: false };
  }

  // Case 3: dataset only has rates → convert to realistic monthly estimate
  const estimated =
    monthlyRate * 1.5 +
    dailyRate * 22 * 0.35 +
    hourlyRate * 160 * 0.25;

  return {
    income: estimated,
    slab: null,
    isSlab: false,
  };
}




module.exports = {
  uploadDataset,
  getMyDataset,
  deleteMyDataset,
  analyzeDataset
};