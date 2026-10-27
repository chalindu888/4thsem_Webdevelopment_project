import Navbar from '../components/Navbar'

function Admin() {
  return (
    <div className="simple-page">
      <Navbar />

      <main className="placeholder-page">
        <div className="placeholder-icon">
          ⚙️
        </div>

        <span className="section-tag">
          ADMINISTRATION
        </span>

        <h1>Admin Dashboard</h1>

        <p>
          Administrators will manage users, assessment questions, learning
          modules and platform statistics here.
        </p>
      </main>
    </div>
  )
}

export default Admin