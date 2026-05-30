import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    email: "",
    glucose: "",
    haemoglobin: "",
    cholesterol: ""
  });

  const [patients, setPatients] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/patients"
      );

      setPatients(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const editPatient = (patient) => {

    setFormData({
      full_name: patient.full_name,
      dob: patient.dob,
      email: patient.email,
      glucose: patient.glucose,
      haemoglobin: patient.haemoglobin,
      cholesterol: patient.cholesterol
    });

    setEditId(patient.id);
  };

  const updatePatient = async () => {

    try {

      await axios.put(
        `http://127.0.0.1:5000/patients/${editId}`,
        {
          ...formData,
          glucose: Number(formData.glucose),
          haemoglobin: Number(formData.haemoglobin),
          cholesterol: Number(formData.cholesterol)
        }
      );

      alert("Patient Updated Successfully");

      fetchPatients();

      setEditId(null);

      setFormData({
        full_name: "",
        dob: "",
        email: "",
        glucose: "",
        haemoglobin: "",
        cholesterol: ""
      });

    } catch (error) {

      console.log(error);
      alert("Error Updating Patient");

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.dob ||
      !formData.email ||
      !formData.glucose ||
      !formData.haemoglobin ||
      !formData.cholesterol
    ) {
      alert("Please fill all fields");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (formData.dob > today) {
      alert("Date of Birth cannot be a future date");
      return;
    }

    if (editId) {
      updatePatient();
      return;
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/patients",
        {
          ...formData,
          glucose: Number(formData.glucose),
          haemoglobin: Number(formData.haemoglobin),
          cholesterol: Number(formData.cholesterol)
        }
      );

      alert(response.data.message);

      fetchPatients();

      setFormData({
        full_name: "",
        dob: "",
        email: "",
        glucose: "",
        haemoglobin: "",
        cholesterol: ""
      });

    } catch (error) {

      console.log(error);
      alert("Error Saving Patient");

    }
  };

  const deletePatient = async (id) => {

    try {

      await axios.delete(
        `http://127.0.0.1:5000/patients/${id}`
      );

      fetchPatients();

    } catch (error) {

      console.log(error);
      alert("Error Deleting Patient");

    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>Health Prediction App</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="glucose"
          placeholder="Glucose"
          value={formData.glucose}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="haemoglobin"
          placeholder="Haemoglobin"
          value={formData.haemoglobin}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="cholesterol"
          placeholder="Cholesterol"
          value={formData.cholesterol}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          {editId ? "Update Patient" : "Save Patient"}
        </button>

      </form>

      <hr />

      <h2>Patient Records</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Email</th>
            <th>Glucose</th>
            <th>Haemoglobin</th>
            <th>Cholesterol</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr key={patient.id}>

              <td>{patient.full_name}</td>
              <td>{patient.dob}</td>
              <td>{patient.email}</td>
              <td>{patient.glucose}</td>
              <td>{patient.haemoglobin}</td>
              <td>{patient.cholesterol}</td>
              <td>{patient.remarks}</td>

              <td>

                <button
                  onClick={() => editPatient(patient)}
                >
                  Edit
                </button>

                {" "}

                <button
                  onClick={() => deletePatient(patient.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;