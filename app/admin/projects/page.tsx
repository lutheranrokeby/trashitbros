'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, X } from 'lucide-react';
import { ProjectItem } from '@/lib/cms/types';
import { BeforeAfterSlider } from '@/components/public/BeforeAfterSlider';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/cms/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const res = await fetch('/api/cms/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        await fetchProjects();
        setEditingProject(null);
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/cms/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-steel-grey/60">
        <div>
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-safety-orange">
            PORTFOLIO SHOWCASE
          </span>
          <h1 className="font-bebas text-4xl sm:text-5xl text-white tracking-wide mt-1">
            MANAGE PROJECTS ({projects.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingProject({
              id: '',
              title: '',
              category: 'Construction',
              location: 'Sunshine Coast, QLD',
              beforeImage: '/images/project-before.jpg',
              afterImage: '/images/project-after.jpg',
              description: '',
              wasteType: 'Timber, packaging, rubble',
              featured: false,
              published: true,
              order: projects.length + 1,
            });
          }}
          className="flex items-center gap-2 bg-safety-orange hover:bg-orange-hover text-white font-montserrat font-bold text-xs uppercase px-5 py-2.5 rounded transition-colors shadow"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-charcoal border border-steel-grey rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="p-4 bg-near-black">
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
              />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-bebas text-2xl text-white">{project.title}</h3>
                <span className="text-[10px] font-bold uppercase bg-safety-orange/20 text-safety-orange px-2 py-0.5 rounded">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{project.location}</p>
              <p className="text-xs text-gray-300 line-clamp-2 mb-4">{project.description}</p>

              <div className="flex items-center justify-between border-t border-steel-grey/60 pt-4">
                <span className="text-[11px] text-gray-400">
                  {project.featured ? '★ Featured on Homepage' : 'Standard Gallery'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(project);
                    }}
                    className="p-1.5 rounded bg-near-black hover:bg-steel-grey text-gray-300 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded bg-near-black hover:bg-red-950 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="bg-charcoal border border-steel-grey rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-steel-grey pb-3">
              <h3 className="font-bebas text-3xl text-white">
                {isCreating ? 'ADD NEW PROJECT' : 'EDIT PROJECT'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={editingProject.title}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={editingProject.category}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                >
                  <option value="Construction">Construction</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Location / Suburb
                </label>
                <input
                  type="text"
                  value={editingProject.location}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, location: e.target.value })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  Before Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.beforeImage}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, beforeImage: e.target.value })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                  After Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.afterImage}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, afterImage: e.target.value })
                  }
                  className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold uppercase text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={editingProject.description}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    description: e.target.value,
                  })
                }
                className="w-full bg-near-black border border-steel-grey rounded p-2.5 text-xs text-white focus:outline-none focus:border-safety-orange"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-200">
                <input
                  type="checkbox"
                  checked={editingProject.featured}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="accent-safety-orange"
                />
                Feature on Homepage Slider
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-200">
                <input
                  type="checkbox"
                  checked={editingProject.published}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, published: e.target.checked })
                  }
                  className="accent-safety-orange"
                />
                Published Live
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-steel-grey">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 text-xs font-montserrat font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-safety-orange hover:bg-orange-hover text-white px-5 py-2 rounded text-xs font-montserrat font-bold uppercase"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
