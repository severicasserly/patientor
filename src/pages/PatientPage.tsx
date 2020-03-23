import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Patient, Entry } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient } from "../state";


const PatientEntries: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  const [{ diagnoses }, dispatch] = useStateValue();
  const getDiagnoses = (codes: string[] | undefined) => {
    if (!codes) { return null }

    return (codes.map(code => {
      const diagnosis = diagnoses[code];
      const description = diagnosis ? diagnosis.name : "";
      return (
        <li key={code}>
          {code} {description}
        </li>
      )
    })
    )
  }

  return (
    <div>
      <h3>entries</h3>
      {entries && entries.map(e => {
        return <div key={e.id}>
          <p>{e.date} {e.description}</p>
          <ul>
            {getDiagnoses(e.diagnosisCodes)}
          </ul>
        </div>
      })}
    </div>
  );
};


const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient: Patient = patients[id]
  if (!patient) {
    return null;
  }
  if (!patient.ssn) {
    const fetchPatient = async (id: string) => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(addPatient(patientFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient(id);
  }

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>{patient.gender}</p>
      <p>occupation: {patient.occupation}</p>
      {patient.ssn ? <p>ssn: {patient.ssn}</p> : ""}
      {patient.dateOfBirth ? <p>date of birth: {patient.dateOfBirth}</p> : ""}

      <PatientEntries entries={patient.entries} />
    </div>
  );
};

export default PatientPage;
