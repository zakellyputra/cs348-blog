import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../models/models';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1>Projects</h1>

    @for (section of sections; track section.key) {
      @if (grouped[section.key]?.length) {
        <h2>{{ section.label }}</h2>
        @for (project of grouped[section.key]; track project.projectId) {
          <div class="item-card">
            <strong>{{ project.title }}</strong>
            @if (project.techStack) {
              <span class="muted"> &middot; {{ project.techStack }}</span>
            }
            @if (project.description) {
              <p>{{ project.description }}</p>
            }
            <div class="item-actions">
              @if (project.repoUrl) {
                <a [href]="project.repoUrl" target="_blank">repo</a>
              }
              @if (project.liveUrl) {
                <a [href]="project.liveUrl" target="_blank">live</a>
              }
              <a (click)="editProject(project)">edit</a>
              <a (click)="deleteProject(project.projectId)">delete</a>
            </div>
          </div>
        }
      }
    }

    <hr>
    <a (click)="showForm = !showForm">{{ showForm ? 'Cancel' : 'Add a project' }}</a>

    @if (showForm) {
      <div class="inline-form">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>Title <input formControlName="title" type="text"></label>
          <label>Description <textarea formControlName="description" rows="3"></textarea></label>
          <label>Repo URL <input formControlName="repoUrl" type="text"></label>
          <label>Live URL <input formControlName="liveUrl" type="text"></label>
          <label>Tech Stack <input formControlName="techStack" type="text" placeholder="e.g. Angular, Spring Boot, MySQL"></label>
          <label>
            Status
            <select formControlName="status">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div class="form-actions">
            <button type="submit">{{ editingId ? 'Save changes' : 'Add project' }}</button>
            @if (editingId) {
              <button type="button" (click)="cancelEdit()">Cancel edit</button>
            }
          </div>
        </form>
      </div>
    }
  `,
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  projects: Project[] = [];
  grouped: Record<string, Project[]> = {};
  sections = [
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'archived', label: 'Archived' }
  ];

  showForm = false;
  editingId: number | null = null;

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    repoUrl: new FormControl(''),
    liveUrl: new FormControl(''),
    techStack: new FormControl(''),
    status: new FormControl('active')
  });

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.grouped = {};
      for (const p of projects) {
        if (!this.grouped[p.status]) this.grouped[p.status] = [];
        this.grouped[p.status].push(p);
      }
      this.cdr.markForCheck();
    });
  }

  editProject(project: Project) {
    this.editingId = project.projectId;
    this.showForm = true;
    this.form.patchValue({
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      techStack: project.techStack,
      status: project.status
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ status: 'active' });
  }

  deleteProject(id: number) {
    if (!confirm('Delete this project?')) return;
    this.projectService.deleteProject(id).subscribe(() => this.loadProjects());
  }

  submit() {
    const val = this.form.value;
    const payload: Partial<Project> = {
      title: val.title || '',
      description: val.description || '',
      repoUrl: val.repoUrl || '',
      liveUrl: val.liveUrl || '',
      techStack: val.techStack || '',
      status: (val.status as Project['status']) || 'active',
      source: 'manual'
    };

    if (this.editingId) {
      this.projectService.updateProject(this.editingId, payload).subscribe(() => {
        this.editingId = null;
        this.showForm = false;
        this.form.reset({ status: 'active' });
        this.loadProjects();
      });
    } else {
      this.projectService.createProject(payload).subscribe(() => {
        this.showForm = false;
        this.form.reset({ status: 'active' });
        this.loadProjects();
      });
    }
  }
}
