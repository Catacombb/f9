
// Helper functions for the Architecture section

export const getExternalMaterials = (materialPreferences: string[] | undefined, externalMaterialOptions: {value: string, label: string}[]) => {
  if (!materialPreferences) return [];
  
  return materialPreferences.filter(p => 
    externalMaterialOptions.some(o => o.value === p)
  );
};

export const getInternalMaterials = (materialPreferences: string[] | undefined, internalMaterialOptions: {value: string, label: string}[]) => {
  if (!materialPreferences) return [];
  
  return materialPreferences.filter(p => 
    internalMaterialOptions.some(o => o.value === p)
  );
};

export const handleFileUpload = (
  files: FileList | null,
  currentUploadedImages: File[],
  onSuccess: (newImages: File[]) => void
) => {
  if (!files) return;

  // Process each file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const newImages = [...currentUploadedImages];
  let hasErrors = false;
  let errorMessage = '';

  Array.from(files).forEach(file => {
    if (!allowedTypes.includes(file.type)) {
      errorMessage = `${file.name} is not a supported file type`;
      hasErrors = true;
      return;
    }

    if (file.size > maxSize) {
      errorMessage = `${file.name} exceeds the 5MB size limit`;
      hasErrors = true;
      return;
    }

    // Add the file to the list
    newImages.push(file);
  });

  if (!hasErrors) {
    onSuccess(newImages);
    return { success: true, message: `${files.length} file(s) uploaded successfully` };
  }
  
  return { success: false, message: errorMessage };
};
