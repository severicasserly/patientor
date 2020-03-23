import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Table, Button } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient } from "../state";



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
        console.log(patientFromApi);
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
    </div>
  );
};

export default PatientPage;
