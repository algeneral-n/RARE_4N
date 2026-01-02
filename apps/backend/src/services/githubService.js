/**
 * RARE 4N - GitHub Service
 * Real GitHub integration with Actions for CI/CD builds
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API = 'https://api.github.com';
const GITHUB_OWNER = 'rare4n-ai';

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json'
};

/**
 * Create GitHub repository
 */
export async function createRepo(name, description = '', isPrivate = true) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  try {
    const response = await axios.post(
      `${GITHUB_API}/user/repos`,
      {
        name,
        description: description || `RARE 4N - ${name}`,
        private: isPrivate,
        auto_init: true,
        has_issues: true,
        has_projects: true
      },
      { headers }
    );

    return {
      success: true,
      repo: response.data,
      repoUrl: response.data.html_url,
      cloneUrl: response.data.clone_url,
      message: `تم إنشاء المستودع: ${name}`
    };
  } catch (error) {
    if (error.response?.status === 422) {
      return {
        success: false,
        error: 'Repository already exists'
      };
    }
    throw error;
  }
}

/**
 * Push project to GitHub
 */
export async function pushProject(projectPath, repoName) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  const repoUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_OWNER}/${repoName}.git`;

  try {
    await execAsync('git init', { cwd: projectPath });
    await execAsync('git add .', { cwd: projectPath });
    await execAsync('git commit -m "Initial commit from RARE 4N Auto Builder"', { cwd: projectPath });
    await execAsync(`git remote add origin ${repoUrl}`, { cwd: projectPath }).catch(() => {});
    await execAsync('git branch -M main', { cwd: projectPath });
    await execAsync('git push -u origin main --force', { cwd: projectPath });

    return {
      success: true,
      message: `تم رفع المشروع إلى GitHub: ${repoName}`
    };
  } catch (error) {
    console.error('Git push error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create GitHub Actions workflow for Expo EAS builds
 */
export async function createBuildWorkflow(repoName, projectName) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const workflowContent = `name: EAS Build

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        default: 'all'
        type: choice
        options:
          - ios
          - android
          - all
      profile:
        description: 'Build profile'
        required: true
        default: 'production'
        type: choice
        options:
          - development
          - preview
          - production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build iOS
        if: github.event.inputs.platform == 'ios' || github.event.inputs.platform == 'all'
        run: eas build --platform ios --profile \${{ github.event.inputs.profile || 'production' }} --non-interactive

      - name: Build Android
        if: github.event.inputs.platform == 'android' || github.event.inputs.platform == 'all'
        run: eas build --platform android --profile \${{ github.event.inputs.profile || 'production' }} --non-interactive

      - name: Notify completion
        run: |
          curl -X POST "\${{ secrets.WEBHOOK_URL }}/api/auto-builder/build-complete" \\
            -H "Content-Type: application/json" \\
            -d '{"project": "${projectName}", "status": "completed"}'
`;

  const base64Content = Buffer.from(workflowContent).toString('base64');

  try {
    const response = await axios.put(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/contents/.github/workflows/eas-build.yml`,
      {
        message: 'Add EAS build workflow',
        content: base64Content
      },
      { headers }
    );

    return {
      success: true,
      workflowUrl: response.data.content.html_url,
      message: 'تم إنشاء GitHub Actions workflow للبناء'
    };
  } catch (error) {
    console.error('Create workflow error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Set repository secrets
 */
export async function setRepoSecrets(repoName, secrets) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  const results = [];

  for (const [name, value] of Object.entries(secrets)) {
    try {
      const keyResponse = await axios.get(
        `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/secrets/public-key`,
        { headers }
      );

      const sodium = await import('tweetnacl');
      const { seal } = await import('tweetnacl-sealedbox-js');
      
      const keyBytes = Buffer.from(keyResponse.data.key, 'base64');
      const messageBytes = Buffer.from(value);
      const encryptedBytes = seal(messageBytes, keyBytes);
      const encrypted = Buffer.from(encryptedBytes).toString('base64');

      await axios.put(
        `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/secrets/${name}`,
        {
          encrypted_value: encrypted,
          key_id: keyResponse.data.key_id
        },
        { headers }
      );

      results.push({ name, success: true });
    } catch (error) {
      results.push({ name, success: false, error: error.message });
    }
  }

  return {
    success: results.every(r => r.success),
    results
  };
}

/**
 * Trigger GitHub Actions workflow
 */
export async function triggerWorkflow(repoName, workflowFile, inputs = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  try {
    await axios.post(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/workflows/${workflowFile}/dispatches`,
      {
        ref: 'main',
        inputs
      },
      { headers }
    );

    return {
      success: true,
      message: `تم تشغيل workflow: ${workflowFile}`
    };
  } catch (error) {
    console.error('Trigger workflow error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get workflow runs
 */
export async function getWorkflowRuns(repoName, workflowFile = 'eas-build.yml') {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/workflows/${workflowFile}/runs`,
      { headers }
    );

    return {
      success: true,
      runs: response.data.workflow_runs.map(run => ({
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        createdAt: run.created_at,
        updatedAt: run.updated_at,
        url: run.html_url
      }))
    };
  } catch (error) {
    console.error('Get workflow runs error:', error);
    return {
      success: false,
      error: error.message,
      runs: []
    };
  }
}

/**
 * Get workflow run artifacts
 */
export async function getRunArtifacts(repoName, runId) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/runs/${runId}/artifacts`,
      { headers }
    );

    return {
      success: true,
      artifacts: response.data.artifacts.map(a => ({
        id: a.id,
        name: a.name,
        size: a.size_in_bytes,
        downloadUrl: a.archive_download_url,
        createdAt: a.created_at
      }))
    };
  } catch (error) {
    console.error('Get artifacts error:', error);
    return {
      success: false,
      error: error.message,
      artifacts: []
    };
  }
}

/**
 * Download artifact
 */
export async function downloadArtifact(repoName, artifactId, outputPath) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured');
  }

  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${repoName}/actions/artifacts/${artifactId}/zip`,
      {
        headers,
        responseType: 'arraybuffer'
      }
    );

    fs.writeFileSync(outputPath, response.data);

    return {
      success: true,
      filePath: outputPath,
      size: response.data.length
    };
  } catch (error) {
    console.error('Download artifact error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  createRepo,
  pushProject,
  createBuildWorkflow,
  setRepoSecrets,
  triggerWorkflow,
  getWorkflowRuns,
  getRunArtifacts,
  downloadArtifact
};
