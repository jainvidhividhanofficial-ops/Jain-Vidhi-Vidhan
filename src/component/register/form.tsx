"use client";

import { supabase } from "@/supabaseclient";
import {
  CheckCircle,
  DollarSign,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Select = dynamic(() => import("react-select"), { ssr: false });
const AsyncPaginate = dynamic(
  () => import("react-select-async-paginate").then((mod) => mod.AsyncPaginate),
  { ssr: false }
);

// GeoNames API configuration
const GEONAMES_USERNAME = "pratzzzam";

const providerTypeOptions = [
  { value: "Pooja & Vidhan", label: "Pooja & Vidhan (पूजा एवं विधान)" },
  { value: "Bhajan Sandhya", label: "Bhajan Sandhya (भजन संध्या)" },
  { value: "Chakravarty Vivah", label: "Chakravarty Vivah (चक्रवर्ती विवाह)" },
  { value: "Panchkalyanak", label: "Panchkalyanak (पंचकल्याणक)" },
  { value: "Graha Pravesh", label: "Graha Pravesh (गृह प्रवेश)" },
  { value: "Bhumi Poojan", label: "Bhumi Poojan (भूमि पूजन)" },
  { value: "Shilanayas", label: "Shilanayas (शिलान्यास)" },
  { value: "Musical Phere", label: "Musical Phere (म्यूज़िकल फेरे)" },
  { value: "Anchor", label: "Anchor (एंकर)" },
  { value: "Singer", label: "Singer (गायक/गायिका)" },
];

async function loadCityOptions(
  search: string,
  prevOptions: any,
  { page }: any
) {
  if (!search || search.length < 2) {
    return { options: [], hasMore: false };
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
        search
      )}&country=IN&maxRows=20&startRow=${
        (page - 1) * 20
      }&username=${GEONAMES_USERNAME}&featureClass=P&orderby=population`
    );

    const data = await response.json();

    if (data.status) {
      console.error("GeoNames API Error:", data.status.message);
      return { options: [], hasMore: false };
    }

    const options =
      data.geonames?.map((city: any) => ({
        value: city.name,
        label: `${city.name}, ${city.adminName1}`,
      })) || [];

    return {
      options,
      hasMore: data.geonames?.length === 20,
      additional: { page: page + 1 },
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { options: [], hasMore: false };
  }
}

export default function ProviderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    providerName: "",
    qualification: "",
    institute: "",
    providerType: [] as string[],
    contactEmail: "",
    contactPhone: "",
    serviceArea: "", // Changed from 'city' to match DB
    yearsExperience: "",
    shortDescription: "",
    servicesOffered: "",
    servicesPricing: {
      individual: [] as { service: string; price: string }[],
      group: [] as { service: string; price: string;}[],
    },
    profileImage: null as File | null,
    profileImagePreview: "",
    videos: [] as File[],
    videoPreviews: [] as string[],
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.providerName.trim())
        newErrors.providerName = "यह फ़ील्ड आवश्यक है";
      if (!formData.qualification.trim())
        newErrors.qualification = "यह फ़ील्ड आवश्यक है";
      if (!formData.institute.trim())
        newErrors.institute = "यह फ़ील्ड आवश्यक है";

      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = "यह फ़ील्ड आवश्यक है";
      } else if (!validateEmail(formData.contactEmail)) {
        newErrors.contactEmail = "कृपया मान्य ईमेल दर्ज करें";
      }

      if (!formData.contactPhone.trim()) {
        newErrors.contactPhone = "यह फ़ील्ड आवश्यक है";
      } else if (!validatePhone(formData.contactPhone)) {
        newErrors.contactPhone =
          "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें";
      }

      if (!formData.serviceArea.trim())
        newErrors.serviceArea = "यह फ़ील्ड आवश्यक है";
      if (!formData.yearsExperience.trim())
        newErrors.yearsExperience = "यह फ़ील्ड आवश्यक है";
      if (formData.providerType.length === 0)
        newErrors.providerType = "कृपया कम से कम एक प्रकार चुनें";
    }

    const validateStep = (step: number) => {
  const newErrors: Record<string, string> = {};

  // Step 2 (Service type & pricing)
  if (step === 2) {
    if (!formData.providerType.length)
      newErrors.providerType = "कृपया अपनी सेवा श्रेणी चुनें";

    // validate both individual & group pricing
    formData.providerType.forEach((service) => {
      const foundIndividual = formData.servicesPricing.individual.find(
        (p) => p.service === service
      );
      const foundGroup = formData.servicesPricing.group.find(
        (p) => p.service === service
      );

      // Individual pricing validation
      if (!foundIndividual || !foundIndividual.price.trim()) {
        newErrors[`price_individual_${service}`] =
          "कृपया व्यक्तिगत सेवा शुल्क दर्ज करें";
      }

      // Group pricing validation
      if (!foundGroup || !foundGroup.price.trim()) {
        newErrors[`price_group_${service}`] =
          "कृपया समूह सेवा शुल्क दर्ज करें";
      }
    });
  }

  // ✅ Add any other step-specific checks if needed

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => Math.min(p + 1, 4));
  };

  const handlePrevious = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "contactPhone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

const handleMultiSelectChange = (selected: any) => {
  const values = selected ? selected.map((o: any) => o.value) : [];

  setFormData((prev) => {
    // Filter old ones that still exist
    const individual = prev.servicesPricing.individual.filter((p) =>
      values.includes(p.service)
    );
    const group = prev.servicesPricing.group.filter((p) =>
      values.includes(p.service)
    );

    // Add missing ones
    values.forEach((v: string) => {
      if (!individual.some((p) => p.service === v))
        individual.push({ service: v, price: "" });
      if (!group.some((p) => p.service === v))
        group.push({ service: v, price: ""});
    });

    return {
      ...prev,
      providerType: values,
      servicesPricing: { individual, group },
    };
  });

  setErrors((prev) => ({ ...prev, providerType: "" }));
};


const handlePriceChange = (
  type: "individual" | "group",
  service: string,
  field: "price" | "includes",
  value: string
) => {
  setFormData((prev) => {
    const pricing = prev.servicesPricing[type] || [];
    const idx = pricing.findIndex((p: any) => p.service === service);
    const updated = [...pricing];

    if (idx !== -1) {
      updated[idx] = { ...updated[idx], [field]: value };
    } else {
      const newItem =
        type === "group"
          ? { service, price: field === "price" ? value : "", includes: field === "includes" ? value : "" }
          : { service, price: value };
      updated.push(newItem);
    }

   
    return {
      ...prev,
      servicesPricing: { ...prev.servicesPricing, [type]: updated },
    };
  });
};


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log("📷 Image upload triggered");
    console.log("File selected:", file);

    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, GIF)");
      return;
    }

    try {
      const preview = URL.createObjectURL(file);
      console.log("✅ Preview created:", preview);
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      setFormData((prev) => {
        const updated = {
          ...prev,
          profileImage: file,
          profileImagePreview: preview,
        };
        console.log("Updated formData:", updated);
        return updated;
      });

      setErrors((prev) => ({ ...prev, profileImage: "" }));
      console.log("✅ Image state updated successfully");
    } catch (error) {
      console.error("❌ Error creating preview:", error);
      alert("Failed to preview image");
    }
  };

  const handleVideosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    console.log("🎥 Video upload triggered");
    console.log("Files selected:", files?.length);

    if (!files || files.length === 0) {
      console.log("❌ No files selected");
      return;
    }

    const fileArray = Array.from(files).slice(0, 3) as File[];
    console.log(
      "Processing files:",
      fileArray.map((f) => f.name)
    );

    // Validate files
    const validFiles = fileArray.filter((file) => {
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is 50MB`);
        return false;
      }
      if (!file.type.startsWith("video/")) {
        alert(`${file.name} is not a valid video file`);
        return false;
      }
      return true;
    });

    console.log("Valid files:", validFiles.length);

    if (validFiles.length > 0) {
      try {
        const previews = validFiles.map((f: File) => {
          const url = URL.createObjectURL(f);
          console.log(`Preview created for ${f.name}:`, url);
          return url;
        });

        setFormData((prev) => {
          const updated = {
            ...prev,
            videos: validFiles,
            videoPreviews: previews,
          };
          console.log("Updated video formData:", updated);
          return updated;
        });

        console.log("✅ Video state updated successfully");
      } catch (error) {
        console.error("❌ Error creating video previews:", error);
        alert("Failed to preview videos");
      }
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, bucket: string, folder: string) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      console.log(`⬆️ Uploading ${file.name} to ${bucket}/${fileName}`);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("❌ Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      console.log("✅ File uploaded successfully:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("❌ File upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);

    try {
      // -----------------------------
      // 1️⃣ Upload profile image first (if exists)
      // -----------------------------
      let profileImageUrl = "";
      if (formData.profileImage) {
        const imgForm = new FormData();
        imgForm.append("file", formData.profileImage);

        const imgRes = await fetch("/api/upload/image", {
          method: "POST",
          body: imgForm,
        });

        const imgResult = await imgRes.json();

        if (!imgRes.ok || !imgResult.success) {
          throw new Error(imgResult.message || "Image upload failed");
        }

        profileImageUrl = imgResult.url;
        console.log("✅ Image uploaded:", profileImageUrl);
      }

      // -----------------------------
      // 2️⃣ Upload videos concurrently (if any)
      // -----------------------------
      const videoUrls: string[] = [];

      if (formData.videos && formData.videos.length > 0) {
        const uploadPromises = formData.videos.map(async (video: File) => {
          const videoForm = new FormData();
          videoForm.append("file", video);

          const videoRes = await fetch("/api/upload/video", {
            method: "POST",
            body: videoForm,
          });

          const videoResult = await videoRes.json();

          if (!videoRes.ok || !videoResult.success) {
            console.error("❌ Video upload failed:", videoResult.message);
            return null;
          }

          console.log("✅ Video uploaded:", videoResult.url);
          return videoResult.url;
        });

        const results = await Promise.all(uploadPromises);
        results.forEach((url) => {
          if (url) videoUrls.push(url);
        });
      }

      // -----------------------------
      // 3️⃣ Prepare the final payload for DB
      // -----------------------------
      const payload = {
        providerName: formData.providerName || "",
        qualification: formData.qualification || "",
        institute: formData.institute || "",
        providerType: Array.isArray(formData.providerType)
          ? formData.providerType
          : formData.providerType
          ? [formData.providerType]
          : [],
        contactEmail: formData.contactEmail || "",
        contactPhone: formData.contactPhone || "",
        serviceArea: formData.serviceArea || "",
        yearsExperience: parseInt(formData.yearsExperience || "0", 10),
        shortDescription: formData.shortDescription || "",
        servicesOffered: formData.servicesOffered || "",
        servicesPricing: formData.servicesPricing || [],
        profileImageUrl: profileImageUrl || "",
        videoUrls: videoUrls || [],
      };

      console.log("📤 Final payload to /api/providers:", payload);

      // -----------------------------
      // 4️⃣ Submit to DB
      // -----------------------------
      const dbResponse = await fetch("/api/provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const dbResult = await dbResponse.json();

      if (!dbResponse.ok || !dbResult.success) {
        console.error("❌ DB insert failed:", dbResult.message);
        throw new Error(dbResult.message || "Failed to save provider");
      }

      console.log("✅ Provider inserted successfully:", dbResult);

      alert("✅ Provider registered successfully!");
      setCurrentStep(4);
    } catch (err: unknown) {
      console.error("❌ Submission error:", err);
      const message = err instanceof Error ? err.message : String(err);
      alert("त्रुटि: " + (message || "कुछ गलत हो गया"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full px-3 sm:px-4 py-6 sm:py-12 lg:py-16">
      {submitting && <FOMOLoadingOverlay />}

      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-10 border border-gray-100">
        {currentStep === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleMultiSelectChange={handleMultiSelectChange}
            loadCityOptions={loadCityOptions}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {currentStep === 2 && (
          <>
            <Step2
              formData={formData}
              handleInputChange={handleInputChange}
              handlePriceChange={handlePriceChange}
              handleImageUpload={handleImageUpload}
              handleVideosUpload={handleVideosUpload}
              errors={errors}
            />
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <p>
                <strong>Debug:</strong>
              </p>
              <p>
                Image:{" "}
                {formData.profileImage ? formData.profileImage.name : "None"}
              </p>
              <p>Preview: {formData.profileImagePreview ? "Yes" : "No"}</p>
              <p>Videos: {formData.videos.length}</p>
              <p>Video Previews: {formData.videoPreviews.length}</p>
            </div>
          </>
        )}
        {currentStep === 3 && <Step3 formData={formData} />}
        {currentStep === 4 && <Step4 />}

        {currentStep < 4 && (
          <div className="flex justify-between gap-3 mt-6 sm:mt-10">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50"
            >
              पिछला
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#a72c3e] text-white rounded-lg hover:bg-[#8b2433] transition"
              >
                अगला
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#a72c3e] text-white rounded-lg hover:bg-[#8b2433] transition disabled:opacity-50"
              >
                {submitting ? "भेजा जा रहा है..." : "सबमिट करें"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FOMOLoadingOverlay() {
  const [stat, setStat] = useState(0);
  const [earning, setEarning] = useState(45000);
  const [providers, setProviders] = useState(2847);
  const [uploadStatus, setUploadStatus] = useState(
    "Processing your registration..."
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStat((prev) => (prev + 1) % 3);
      setEarning((prev) => prev + Math.floor(Math.random() * 5000));
      setProviders((prev) => prev + 1);
    }, 2000);

    // Update status messages
    const statusInterval = setInterval(() => {
      const messages = [
        "Processing your registration...",
        "Uploading your files...",
        "Creating your profile...",
        "Almost done...",
      ];
      setUploadStatus(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  const stats = [
    {
      icon: DollarSign,
      label: "Monthly Earnings",
      value: `₹${(earning / 1000).toFixed(0)}K`,
      color: "text-green-500",
    },
    {
      icon: Users,
      label: "Active Providers",
      value: `${providers}+`,
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Growth",
      value: "247%",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative bg-white/95 rounded-2xl sm:rounded-3xl p-6 sm:p-12 max-w-2xl w-full border-2 border-[#a72c3e]/20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="w-16 h-16 sm:w-24 sm:h-24 border-4 sm:border-8 border-gray-200 border-t-[#a72c3e] rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
            <CheckCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#a72c3e] w-6 h-6 sm:w-10 sm:h-10" />
          </div>

          <h3 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            🎉 प्रोफ़ाइल बनाया जा रहा है!
          </h3>
          <p className="text-sm sm:text-lg text-gray-600">{uploadStatus}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-2xl p-3 sm:p-6 border-2 transition-all ${
                stat === idx ? "border-[#a72c3e] scale-105" : "border-gray-200"
              }`}
            >
              <item.icon
                className={`${item.color} w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 mx-auto`}
              />
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                {item.value}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#a72c3e]/10 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <p className="text-[#a72c3e] font-bold text-sm sm:text-lg mb-1 sm:mb-2">
            💰 Start Earning Today!
          </p>
          <p className="text-gray-700 text-xs sm:text-sm">
            Join <span className="font-bold">{providers}+ providers</span>{" "}
            earning{" "}
            <span className="font-bold text-green-600">
              ₹{(earning / 1000).toFixed(0)}K/month
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Step1({
  formData,
  setFormData,
  handleInputChange,
  handleMultiSelectChange,
  loadCityOptions,
  errors,
  setErrors,
}: any) {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: "#d1d5db",
      padding: "2px",
      minHeight: "42px",
    }),
  };

  const handleCityChange = (selectedOption: any) => {
    setFormData((prev: any) => ({
      ...prev,
      serviceArea: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prev: any) => ({ ...prev, serviceArea: "" }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#a72c3e] mb-1 sm:mb-2">
          Provider Registration
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Step 1: Basic Information
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Provider Name *
          </label>
          <input
            type="text"
            name="providerName"
            value={formData.providerName}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
            placeholder="Full name"
          />
          {errors.providerName && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.providerName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Qualification *
          </label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
            placeholder="e.g., M.A. in Sanskrit"
          />
          {errors.qualification && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.qualification}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Institute *
          </label>
          <input
            type="text"
            name="institute"
            value={formData.institute}
            onChange={handleInputChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
            placeholder="Institute name"
          />
          {errors.institute && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.institute}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Provider Type *
          </label>
          <Select
            isMulti
            options={providerTypeOptions}
            value={providerTypeOptions.filter((o) =>
              formData.providerType.includes(o.value)
            )}
            onChange={handleMultiSelectChange}
            placeholder="Select services"
            styles={customStyles}
          />
          {errors.providerType && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.providerType}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Email *
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="email@example.com"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
          />
          {errors.contactEmail && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.contactEmail}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="9876543210"
            maxLength={10}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            10-digit number
          </p>
          {errors.contactPhone && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.contactPhone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            City *
          </label>
          <AsyncPaginate
            value={
              formData.serviceArea
                ? { value: formData.serviceArea, label: formData.serviceArea }
                : null
            }
            loadOptions={loadCityOptions}
            onChange={handleCityChange}
            placeholder="Search cities..."
            additional={{ page: 1 }}
            debounceTimeout={300}
            styles={customStyles}
            isClearable
            cacheUniqs={[formData.serviceArea]}
          />
          {errors.serviceArea && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.serviceArea}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            name="yearsExperience"
            value={formData.yearsExperience}
            onChange={handleInputChange}
            min="0"
            placeholder="0"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
          />
          {errors.yearsExperience && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.yearsExperience}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({
  formData,
  handleInputChange,
  handlePriceChange,
  handleImageUpload,
  handleVideosUpload,
  errors,
}: any) {
  console.log("Step2 rendered with formData:", {
    hasImage: !!formData.profileImage,
    hasPreview: !!formData.profileImagePreview,
    videoCount: formData.videos?.length || 0,
    previewCount: formData.videoPreviews?.length || 0,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#a72c3e] mb-1 sm:mb-2">
          Service Details
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Step 2: About your services
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
            Short Description *
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows={3}
            placeholder="Brief description about yourself..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
          />
          {errors.shortDescription && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.shortDescription}
            </p>
          )}
        </div>

        {/* <div>
          <label className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Services Offered *</label>
          <textarea
            name="servicesOffered"
            value={formData.servicesOffered}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your services..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
          />
          {errors.servicesOffered && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.servicesOffered}</p>}
        </div> */}

       {/* ---------- Individual Service Charges ---------- */}
{formData.providerType.length > 0 && (
  <div>
    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-lg">Individual Service Charges *</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {formData.providerType.map((service: string) => {
        const found =
          formData.servicesPricing.individual.find(
            (p: any) => p.service === service
          ) || { service, price: "" };

        return (
          <div
            key={service}
            className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              {service}
            </label>
            <div className="relative">
              <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={found.price}
                onChange={(e) =>
                  handlePriceChange("individual", service, "price", e.target.value)
                }
                placeholder="Amount"
                className="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

     {/* ---------- Group Service Charges ---------- */}
{formData.providerType.length > 0 && (
  <div className="mt-6">
    <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-lg">Group Service Charges *</h4>
    <p className="text-xs text-gray-500 mb-3">
      Set your group rates and describe what’s included with your team (e.g., musicians, instruments, setup, etc.)
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {formData.providerType.map((service: string) => {
        const found =
          formData.servicesPricing.group.find(
            (p: any) => p.service === service
          ) || { service, price: "", includes: "" };

        return (
          <div
            key={service}
            className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              {service}
            </label>

            {/* Price */}
            <div className="relative mb-3">
              <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                value={found.price}
                onChange={(e) =>
                  handlePriceChange("group", service, "price", e.target.value)
                }
                placeholder="Group amount"
                className="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent"
              />
            </div>

            {/* Includes */}
            <textarea
              rows={2}
              placeholder="What’s included (e.g., 2 assistants, instruments, sound setup)"
              value={found.includes}
              onChange={(e) =>
                handlePriceChange("group", service, "includes", e.target.value)
              }
              className="w-full text-sm sm:text-base px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a72c3e] focus:border-transparent resize-none"
            />
          </div>
        );
      })}
    </div>
  </div>
)}


        <div>
          <label className="font-semibold block mb-2 text-sm sm:text-lg">
            Profile Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-[#a72c3e] transition">
            {formData.profileImagePreview ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <img
                    src={formData.profileImagePreview}
                    alt="Profile Preview"
                    className="max-h-32 sm:max-h-48 mx-auto rounded-lg shadow-md object-cover"
                    onError={(e) => {
                      console.error("Image preview error");
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Selected
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formData.profileImage?.name}
                </div>
                <label className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-500 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <Upload
                  className="mx-auto text-gray-400 mb-3 sm:mb-4"
                  size={32}
                />
                <label className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#a72c3e] text-white rounded-lg cursor-pointer hover:bg-[#8b2433] transition">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
                  JPG, PNG (max 5MB)
                </p>
              </>
            )}
            {errors.profileImage && (
              <p className="text-red-600 text-xs sm:text-sm mt-2">
                {errors.profileImage}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="font-semibold block mb-2 text-sm sm:text-lg">
            Videos - Optional
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center hover:border-[#a72c3e] transition">
            <Upload className="mx-auto text-gray-400 mb-3 sm:mb-4" size={32} />
            <label className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#a72c3e] text-white rounded-lg cursor-pointer hover:bg-[#8b2433] transition">
              {formData.videos.length > 0
                ? `${formData.videos.length} Video(s) Selected - Add More`
                : "Upload Videos"}
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideosUpload}
                className="hidden"
              />
            </label>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
              MP4, MOV (max 3 videos, 50MB each)
            </p>

            {formData.videoPreviews.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Videos ({formData.videos.length}):
                </p>
                <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
                  {formData.videoPreviews.map((videoUrl: string, i: number) => (
                    <div key={i} className="relative">
                      <video
                        src={videoUrl}
                        controls
                        className="w-28 h-20 sm:w-40 sm:h-24 rounded-lg shadow-md border-2 border-gray-200 object-cover"
                        onError={(e) => {
                          console.error(`Video ${i} preview error`);
                        }}
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate max-w-[112px] sm:max-w-[160px]">
                        {formData.videos[i]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3({ formData }: any) {
  const reviewItems = [
    { label: "Name", value: formData.providerName },
    { label: "Qualification", value: formData.qualification },
    { label: "Institute", value: formData.institute },
    { label: "Services", value: formData.providerType.join(", ") },
    { label: "Email", value: formData.contactEmail },
    { label: "Phone", value: formData.contactPhone },
    { label: "City", value: formData.serviceArea },
    { label: "Experience", value: `${formData.yearsExperience} years` },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#a72c3e] mb-1 sm:mb-2">
          Review Information
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Step 3: Verify details
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#a72c3e]">
            Basic Info
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {reviewItems.map((item) => (
              <div
                key={item.label}
                className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 sm:p-4 border border-gray-200"
              >
                <p className="font-semibold text-gray-700 mb-1 text-xs sm:text-sm">
                  {item.label}
                </p>
                <p className="text-gray-900 font-medium text-sm sm:text-base">
                  {item.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#a72c3e]">
            Description
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-gray-900 text-sm sm:text-base">
              {formData.shortDescription}
            </p>
          </div>
        </div>

        {formData.servicesPricing.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#a72c3e]">
              Charges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {formData.servicesPricing.map((sp: any, i: number) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-green-50 to-white rounded-lg p-4 sm:p-5 border border-green-200"
                >
                  <p className="font-semibold text-gray-700 mb-1 text-sm">
                    {sp.service}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    ₹ {sp.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.profileImagePreview && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#a72c3e]">
              Profile Photo
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-center">
              <img
                src={formData.profileImagePreview}
                alt="Profile"
                className="max-h-64 rounded-lg shadow-lg object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 text-center mt-2">
              {formData.profileImage?.name}
            </p>
          </div>
        )}

        {formData.videoPreviews.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#a72c3e]">
              Videos ({formData.videos.length})
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.videoPreviews.map((videoUrl: string, i: number) => (
                  <div key={i} className="space-y-2">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-40 rounded-lg shadow-md object-cover"
                    />
                    <p className="text-xs text-gray-600 truncate">
                      {formData.videos[i]?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#a72c3e]/10 to-orange-100 rounded-xl border-2 border-[#a72c3e]/20">
          <p className="text-center text-gray-700 font-medium text-sm sm:text-lg">
            ✅ Review carefully before submitting
          </p>
        </div>
      </div>
    </div>
  );
}

function Step4() {
  return (
    <div className="text-center py-10 sm:py-20">
      <div className="mb-6 sm:mb-8">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 sm:w-20 sm:h-20 text-green-600" />
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-[#a72c3e] mb-3 sm:mb-4">
        🎉 पंजीकरण सफल!
      </h2>

      <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 px-4">
        We'll contact you within <span className="font-bold">24-48 hours</span>
      </p>

      <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto mt-6 sm:mt-10 px-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-8 border-2 border-green-300">
          <DollarSign className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 mx-auto mb-2 sm:mb-4" />
          <p className="font-bold text-xl sm:text-3xl text-green-700 mb-1">
            Earn
          </p>
          <p className="text-[10px] sm:text-sm text-gray-700">Start today</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl p-4 sm:p-8 border-2 border-blue-300">
          <Users className="w-10 h-10 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-2 sm:mb-4" />
          <p className="font-bold text-xl sm:text-3xl text-blue-700 mb-1">
            2800+
          </p>
          <p className="text-[10px] sm:text-sm text-gray-700">Providers</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl p-4 sm:p-8 border-2 border-purple-300">
          <TrendingUp className="w-10 h-10 sm:w-16 sm:h-16 text-purple-600 mx-auto mb-2 sm:mb-4" />
          <p className="font-bold text-xl sm:text-3xl text-purple-700 mb-1">
            247%
          </p>
          <p className="text-[10px] sm:text-sm text-gray-700">Growth</p>
        </div>
      </div>

      <div className="mt-8 sm:mt-12">
        <a
          href="/"
          className="inline-block px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg bg-[#a72c3e] text-white rounded-lg font-semibold hover:bg-[#8b2433] transition shadow-lg"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
