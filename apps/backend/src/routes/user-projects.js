/**
 * User Projects Routes
 * Multi-user project management
 */

import express from 'express';
import { DB } from '../database/localDB.js';
import { requireAuth, getUserIdFromRequest } from '../middleware/userIsolation.js';
import crypto from 'crypto';

const router = express.Router();

// Get user projects
router.get('/', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const projects = DB.projects.findByUser(userId);
    
    // Parse config JSON
    const parsedProjects = projects.map(p => ({
      ...p,
      config: p.config ? JSON.parse(p.config) : {},
    }));

    res.json({
      success: true,
      projects: parsedProjects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// Create project
router.post('/', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, templateId, config } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error: 'Name and type are required',
      });
    }

    const projectId = `project_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    DB.projects.create({
      id: projectId,
      userId,
      name,
      type,
      templateId,
      status: 'draft',
      config: config || {},
    });

    res.json({
      success: true,
      project: {
        id: projectId,
        userId,
        name,
        type,
        templateId,
        status: 'draft',
        config: config || {},
      },
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
    });
  }
});

// Get project by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const project = DB.projects.findById(id, userId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    // Parse config JSON
    project.config = project.config ? JSON.parse(project.config) : {};

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// Update project
router.put('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const project = DB.projects.findById(id, userId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    DB.projects.update(id, userId, updates);

    res.json({
      success: true,
      message: 'Project updated',
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

// Delete project
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verify ownership
    const project = DB.projects.findById(id, userId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    DB.projects.delete(id, userId);

    res.json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
    });
  }
});

export default router;




