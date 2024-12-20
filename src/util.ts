import { SavedForm } from "./forms/getCreateForms";


export const getSavedForm = (id: string): SavedForm | undefined => {
  const savedFormsFromLocalStorage = localStorage.getItem('savedForms');
  
  // Parse only once if the value exists
  const savedForms = savedFormsFromLocalStorage 
    ? JSON.parse(savedFormsFromLocalStorage) as SavedForm[]
    : [];

  const myForm = savedForms.find((form) => form.id === id);
  return myForm;
};

export const saveUpdateForm = (
  id: string, snapShotJson: any, lastStep: number
): void => {
  const savedFormsFromLocalStorage = localStorage.getItem('savedForms');
  
  // Parse only once if the value exists
  const savedForms = savedFormsFromLocalStorage 
    ? JSON.parse(savedFormsFromLocalStorage) as SavedForm[]
    : [];
  const myForm = savedForms.find((form) => form.id === id);
  if (myForm) {
    myForm.snapShot = snapShotJson;
    myForm.updatedAt = new Date().toISOString();
    myForm.lastStep = lastStep;
    localStorage.setItem('savedForms', JSON.stringify(savedForms, (_, value) => typeof value === 'function' ? value.toString() : value));
  } else {
    savedForms.push({
      id,
      name: "New Form",
      lastStep: lastStep,
      updatedAt: new Date().toISOString(),
      snapShot: snapShotJson,
    });
    localStorage.setItem('savedForms', JSON.stringify(savedForms, (_, value) => typeof value === 'function' ? value.toString() : value));
  }
};

export const clearSnapShot = () => {
  localStorage.removeItem("savedForms");
};
