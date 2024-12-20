import React, { useEffect } from 'react';
import './SavedForms.css'; // Create this file for styles

import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


export type SavedForm = {
  id: string; // Unique identifier for the form
  name: string; // Name of the form
  lastStep: number; // Last step completed
  updatedAt: string; // Timestamp of last update
  snapShot: any;
};

type SavedFormsProps = {
  savedForms: SavedForm[]; // List of saved forms
  onStartNew: () => void; // Function to handle starting a new form
};

const SavedForms: React.FC<SavedFormsProps> = ({ savedForms, onStartNew }) => {
  const navigate = useNavigate();
  const onResume = (id: string, snapShot: any) => navigate(`/create/${id}/${snapShot.context.step}`, { state: { snapShot } });

  return (
    <div className="saved-forms-container">
      <header className="header">
        <h1>Saved Forms</h1>
        <button className="new-form-button" onClick={onStartNew}>
          + Start New Form
        </button>
      </header>

      <div className="cards-container">
        {savedForms.length > 0 ? (
          savedForms.map((form) => (
            <div key={form.id} className={`form-card ${form.snapShot.status === "done" ? "done": ""}`}>
              <h2 className="form-name">{form.name} : {form.id}</h2>
              <p className="form-step">Last Step: {form.lastStep}</p>
              {form.snapShot.status === "done" && <p><b>Done!</b></p>}
              <p className="form-date">Updated At: {new Date(form.updatedAt).toLocaleString()}</p>
              <button
                className="resume-button"
                onClick={() => onResume(form.id, form.snapShot)}
              >
                {form.snapShot.status === "done" ? "View" : "Resume"}
              </button>
            </div>
          ))
        ) : (
          <p className="no-forms">No saved forms found. Start a new form!</p>
        )}
      </div>
    </div>
  );
};

const GetCreateForms = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = React.useState<SavedForm[]>([]);
  useEffect(() => {
    const savedFormsFromLocalStorage = localStorage.getItem('savedForms');
    if (savedFormsFromLocalStorage) {
      setSavedForms(JSON.parse(savedFormsFromLocalStorage));
    }
  }, []);
  return <SavedForms savedForms={savedForms} onStartNew={() => navigate(`/create/${uuidv4()}`)} />;
};

export default GetCreateForms;
