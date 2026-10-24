import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployees() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`The employee list could not be loaded (HTTP ${response.status}).`);
        }

        const users = await response.json();
        setEmployees(users);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'The employee list could not be loaded.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEmployees();
    return () => controller.abort();
  }, []);

  return (
    <section className="page-card">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PEOPLE OVERVIEW</p>
          <h1>Employee dashboard</h1>
          <p className="heading-description">
            A quick look at the people in your organization.
          </p>
        </div>
        <div className="employee-count" aria-live="polite">
          <span className="count-number">{loading ? '—' : employees.length}</span>
          <span className="count-label">team members</span>
        </div>
      </div>

      <div className="table-responsive employee-table-wrap">
        <table className="table employee-table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email address</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="table-message">
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Loading employees…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan="3" className="table-message text-danger" role="alert">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && employees.length === 0 && (
              <tr>
                <td colSpan="3" className="table-message">No employees found.</td>
              </tr>
            )}
            {!loading && !error && employees.map((employee) => (
              <tr key={employee.id}>
                <td><span className="id-badge">{employee.id}</span></td>
                <td className="employee-name">{employee.name}</td>
                <td>
                  <a className="email-link" href={`mailto:${employee.email}`}>
                    {employee.email}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="data-source">Showing employee details from the JSONPlaceholder API.</p>
    </section>
  );
}

function EmployeeForm() {
  const [notice, setNotice] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setNotice('This demo form does not send or save employee data.');
  }

  return (
    <section className="page-card form-card">
      <div className="page-heading">
        <div>
          <p className="eyebrow">TEAM DIRECTORY</p>
          <h1>Employee form</h1>
          <p className="heading-description">
            Enter employee details below. This demo does not submit data to a server.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label" htmlFor="employee-name">Name</label>
            <input
              className="form-control"
              id="employee-name"
              name="name"
              type="text"
              placeholder="e.g. Alex Morgan"
              autoComplete="name"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="employee-designation">Designation</label>
            <input
              className="form-control"
              id="employee-designation"
              name="designation"
              type="text"
              placeholder="e.g. Product Designer"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="employee-location">Location</label>
            <input
              className="form-control"
              id="employee-location"
              name="location"
              type="text"
              placeholder="e.g. New York"
              autoComplete="address-level2"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="employee-salary">Salary</label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">$</span>
              <input
                className="form-control"
                id="employee-salary"
                name="salary"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 65000"
                required
              />
            </div>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-primary submit-button" type="submit">
            Review details
          </button>
          {notice && <p className="form-notice mb-0" role="status">{notice}</p>}
        </div>
      </form>
    </section>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="navbar-shell">
        <nav className="navbar navbar-expand navbar-light container app-navbar" aria-label="Main navigation">
          <NavLink className="navbar-brand brand" to="/">
            <span className="brand-mark" aria-hidden="true">P</span>
            PeopleDesk
          </NavLink>
          <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/" end>Home</NavLink>
            <NavLink className="nav-link" to="/employee-form">Employee form</NavLink>
          </div>
        </nav>
      </header>

      <main className="container main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employee-form" element={<EmployeeForm />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="container app-footer">PeopleDesk <span>·</span> Employee directory</footer>
    </div>
  );
}
