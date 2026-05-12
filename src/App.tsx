import { useState, useEffect } from "react";
import * as CaregiverService from "./services/CaregiverService";
import * as PatientService from "./services/PatientService";
import * as ShiftService from "./services/ShiftService";
import type {
  Caregiver,
  Patient,
  Shift,
  CreateShiftInput,
  BackendError,
} from "./types";
import { Bounce, toast, ToastContainer } from "react-toastify";
import styles from "./App.module.css";

function App() {
  // database data
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  // caregiver form data
  const [caregiverName, setCaregiverName] = useState("");

  // patient form data
  const [patientName, setPatientName] = useState("");

  // shift form data
  const [shiftForm, setShiftForm] = useState<CreateShiftInput>({
    start_time: new Date(),
    end_time: new Date(),
    patient_id: 0,
    caregiver_id: 0,
  });

  // load all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [c, p, s] = await Promise.all([
        CaregiverService.getAll(),
        PatientService.getAll(),
        ShiftService.getAll(),
      ]);
      setCaregivers(c);
      setPatients(p);
      setShifts(s);
    } catch (error: unknown) {
      console.error(error);
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  // caregiver handlers
  async function handleCreateCaregiver() {
    try {
      await CaregiverService.create(caregiverName);
      setCaregiverName("");
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  async function handleDeleteCaregiver(id: number) {
    try {
      await CaregiverService.remove(id);
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  // patient handlers
  async function handleCreatePatient() {
    try {
      await PatientService.create(patientName);
      setPatientName("");
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  async function handleDeletePatient(id: number) {
    try {
      await PatientService.remove(id);
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  // shift handlers
  async function handleCreateShift() {
    try {
      await ShiftService.create(shiftForm);
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  async function handleDeleteShift(id: number) {
    try {
      await ShiftService.remove(id);
      fetchAll();
    } catch (error: unknown) {
      const backendError = error as BackendError;
      toast.error(backendError.message);
    }
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: "100%" }}>
      <h1>Scheduling Shifts</h1>
      <section style={{ marginBottom: 32 }}>
        <h2>Caregivers</h2>
        <div className={styles.inputLabelWrapper}>
          <input
            placeholder="Name"
            value={caregiverName}
            onChange={(e) => setCaregiverName(e.target.value)}
          />
          <button className="button" onClick={handleCreateCaregiver}>
            Create
          </button>
        </div>
        {caregivers.length > 0 && (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caregivers.map((c) => (
                <tr key={c.id}>
                  <td className={styles.tableCell}>{c.id}</td>
                  <td className={styles.tableCell}>{c.name}</td>
                  <td className={styles.tableCell}>
                    <button
                      className="button"
                      onClick={() => handleDeleteCaregiver(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Patients</h2>
        <div className={styles.inputLabelWrapper}>
          <input
            placeholder="Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
          <button className="button" onClick={handleCreatePatient}>
            Create
          </button>
        </div>
        {patients.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td className={styles.tableCell}>{p.id}</td>
                  <td className={styles.tableCell}>{p.name}</td>
                  <td className={styles.tableCell}>
                    <button
                      className="button"
                      onClick={() => handleDeletePatient(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Shifts</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            maxWidth: 360,
          }}
        >
          <label className={styles.formLabel}>
            Patient
            <select
              value={shiftForm.patient_id}
              onChange={(e) =>
                setShiftForm({
                  ...shiftForm,
                  patient_id: Number(e.target.value),
                })
              }
            >
              <option value={0}>-- select --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.formLabel}>
            Caregiver
            <select
              value={shiftForm.caregiver_id}
              onChange={(e) =>
                setShiftForm({
                  ...shiftForm,
                  caregiver_id: Number(e.target.value),
                })
              }
            >
              <option value={0}>-- select --</option>
              {caregivers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.formLabel}>
            Start time
            <input
              type="datetime-local"
              onChange={(e) =>
                setShiftForm({
                  ...shiftForm,
                  start_time: new Date(e.target.value),
                })
              }
            />
          </label>
          <label className={styles.formLabel}>
            End time
            <input
              type="datetime-local"
              onChange={(e) =>
                setShiftForm({
                  ...shiftForm,
                  end_time: new Date(e.target.value),
                })
              }
            />
          </label>
          <button className="button" onClick={handleCreateShift}>
            Create Shift
          </button>
        </div>
        {shifts.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Patient</th>
                <th className={styles.tableHeader}>Caregiver</th>
                <th className={styles.tableHeader}>Start</th>
                <th className={styles.tableHeader}>End</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => (
                <tr key={s.id}>
                  <td className={styles.tableCell}>{s.id}</td>
                  <td className={styles.tableCell}>
                    {patients.find((p) => p.id === s.patient_id)?.name ??
                      s.patient_id}
                  </td>
                  <td className={styles.tableCell}>
                    {caregivers.find((c) => c.id === s.caregiver_id)?.name ??
                      s.caregiver_id}
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(s.start_time).toLocaleString()}
                  </td>
                  <td className={styles.tableCell}>
                    {new Date(s.end_time).toLocaleString()}
                  </td>
                  <td className={styles.tableCell}>
                    <button
                      className="button"
                      onClick={() => handleDeleteShift(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        style={{ zIndex: 10000 }}
      />
    </div>
  );
}

export default App;
