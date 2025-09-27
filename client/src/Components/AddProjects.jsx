import React, { useState, useEffect } from "react";

const ProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch('https://hrms-1-2jfq.onrender.com/api/project', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add or Update project
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing project
        await fetch(`https://hrms-1-2jfq.onrender.com/api/project/${editingId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(form),
        });
      } else {
        // Create new project
        await fetch('https://hrms-1-2jfq.onrender.com/api/project', {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  // Edit project
  const handleEdit = (project) => {
    setForm({ name: project.name, description: project.description || "" });
    setEditingId(project._id);
  };

  // Delete project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await fetch(`http://localhost:5000/api/project/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProjects(); // Refresh the list
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 bg-gray-50 h-screen mt-32">
      <h1 className="text-3xl font-bold mb-6">Projects Table</h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="flex gap-3    mb-6">
        <input
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded flex-1 border border-black"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded flex-1 border-black"
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", description: "" });
              setEditingId(null);
            }}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Projects Table */}
      <table className="min-w-full border-collapse border border-gray-300 ">
        <thead>
          <tr className="bg-amber-100 border ">
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project._id} className="hover:bg-gray-50">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.description}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No projects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
