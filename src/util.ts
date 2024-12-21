import { AnyActor, SnapshotFrom } from "xstate";
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
  id: string, snapShotJson: SnapshotFrom<AnyActor>, lastStep: number
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

export function generateCaptcha() {
  const operators = ['+', '-', '*']; // Supported operators
  const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const num1 = randomNumber(1, 20); // Generate the first number (1-20)
  const num2 = randomNumber(1, 20); // Generate the second number (1-20)
  const operator = operators[randomNumber(0, operators.length - 1)]; // Randomly pick an operator

  const question: string = `${num1} ${operator} ${num2}`;
  let answer: number = 0;

  // Calculate the answer based on the operator
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
  }

  return { question, answer };
}
