/**
 * RARE 4N - Expo EAS Build Service
 * Real Expo builds using EAS CLI and API
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const execAsync = promisify(exec);

const EXPO_TOKEN = process.env.EXPO_TOKEN;
const EXPO_PROJECT_ID = process.env.EXPO_PROJECT_ID;
const EAS_API_URL = 'https://api.expo.dev/v2';

/**
 * Initialize Expo project
 */
export async function initExpoProject(projectName, template = 'blank') {
  const projectsDir = path.join(process.cwd(), 'server/projects');
  const projectPath = path.join(projectsDir, projectName);

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  try {
    const { stdout, stderr } = await execAsync(
      `npx create-expo-app@latest ${projectName} --template ${template}`,
      { cwd: projectsDir, timeout: 300000 }
    );

    return {
      success: true,
      projectPath,
      output: stdout,
      message: `تم إنشاء مشروع ${projectName} بنجاح`
    };
  } catch (error) {
    console.error('Expo init error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Build with EAS using API
 */
export async function buildWithEAS(projectName, platform = 'all', profile = 'production') {
  if (!EXPO_TOKEN) {
    throw new Error('EXPO_TOKEN not configured');
  }

  const projectPath = path.join(process.cwd(), 'server/projects', projectName);
  
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project not found: ${projectName}`);
  }

  const builds = [];
  const platforms = platform === 'all' ? ['ios', 'android'] : [platform];

  for (const plat of platforms) {
    try {
      const buildResult = await triggerEASBuild(projectPath, plat, profile);
      builds.push({
        platform: plat,
        buildId: buildResult.id,
        status: buildResult.status,
        url: buildResult.buildDetailsPageUrl
      });
    } catch (error) {
      console.error(`EAS build error for ${plat}:`, error);
      builds.push({
        platform: plat,
        error: error.message
      });
    }
  }

  return {
    success: builds.some(b => !b.error),
    builds,
    message: `تم بدء البناء لـ ${platforms.join(', ')}`
  };
}

/**
 * Trigger EAS build via CLI
 */
async function triggerEASBuild(projectPath, platform, profile) {
  try {
    const { stdout } = await execAsync(
      `EXPO_TOKEN=${EXPO_TOKEN} npx eas-cli build --platform ${platform} --profile ${profile} --non-interactive --json`,
      { cwd: projectPath, timeout: 600000 }
    );

    const result = JSON.parse(stdout);
    return result;
  } catch (error) {
    const response = await axios.post(
      `${EAS_API_URL}/builds`,
      {
        projectId: EXPO_PROJECT_ID,
        platform,
        profile,
        workflowId: `rare4n-${platform}-build`
      },
      {
        headers: {
          'Authorization': `Bearer ${EXPO_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
}

/**
 * Get build status from EAS
 */
export async function getBuildStatus(buildId) {
  if (!EXPO_TOKEN) {
    throw new Error('EXPO_TOKEN not configured');
  }

  try {
    const response = await axios.get(
      `${EAS_API_URL}/builds/${buildId}`,
      {
        headers: {
          'Authorization': `Bearer ${EXPO_TOKEN}`
        }
      }
    );

    const build = response.data;
    
    return {
      success: true,
      buildId: build.id,
      status: build.status,
      platform: build.platform,
      artifacts: build.artifacts,
      downloadUrl: build.artifacts?.buildUrl || null,
      qrCodeUrl: build.artifacts?.buildQRCodeUrl || null,
      completedAt: build.completedAt,
      error: build.error
    };
  } catch (error) {
    console.error('Get build status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * List all builds for project
 */
export async function listBuilds(limit = 10) {
  if (!EXPO_TOKEN || !EXPO_PROJECT_ID) {
    throw new Error('Expo credentials not configured');
  }

  try {
    const response = await axios.get(
      `${EAS_API_URL}/projects/${EXPO_PROJECT_ID}/builds?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${EXPO_TOKEN}`
        }
      }
    );

    return {
      success: true,
      builds: response.data.data.map(build => ({
        id: build.id,
        platform: build.platform,
        status: build.status,
        profile: build.profile,
        createdAt: build.createdAt,
        completedAt: build.completedAt,
        downloadUrl: build.artifacts?.buildUrl,
        qrCodeUrl: build.artifacts?.buildQRCodeUrl
      }))
    };
  } catch (error) {
    console.error('List builds error:', error);
    return {
      success: false,
      error: error.message,
      builds: []
    };
  }
}

/**
 * Download build artifact
 */
export async function downloadBuildArtifact(buildId, outputDir) {
  const status = await getBuildStatus(buildId);
  
  if (!status.success || !status.downloadUrl) {
    throw new Error('Build not ready or no download URL');
  }

  const response = await axios.get(status.downloadUrl, {
    responseType: 'arraybuffer'
  });

  const extension = status.platform === 'ios' ? 'ipa' : 'apk';
  const filename = `build_${buildId}.${extension}`;
  const filePath = path.join(outputDir, filename);

  fs.writeFileSync(filePath, response.data);

  return {
    success: true,
    filePath,
    filename,
    size: response.data.length,
    qrCodeUrl: status.qrCodeUrl
  };
}

/**
 * Create EAS config for project
 */
export async function setupEASConfig(projectPath, projectName) {
  const easConfig = {
    cli: { version: ">= 5.0.0" },
    build: {
      development: {
        developmentClient: true,
        distribution: "internal"
      },
      preview: {
        distribution: "internal"
      },
      production: {
        autoIncrement: true
      }
    },
    submit: {
      production: {}
    }
  };

  const configPath = path.join(projectPath, 'eas.json');
  fs.writeFileSync(configPath, JSON.stringify(easConfig, null, 2));

  const appConfig = {
    expo: {
      name: projectName,
      slug: projectName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: "1.0.0",
      orientation: "portrait",
      owner: "rare4n",
      extra: {
        eas: {
          projectId: EXPO_PROJECT_ID
        }
      },
      ios: {
        bundleIdentifier: `app.zien.${projectName.toLowerCase()}`
      },
      android: {
        package: `app.zien.${projectName.toLowerCase()}`
      }
    }
  };

  const appConfigPath = path.join(projectPath, 'app.json');
  fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));

  return {
    success: true,
    easConfigPath: configPath,
    appConfigPath,
    message: 'تم إعداد EAS config'
  };
}

export default {
  initExpoProject,
  buildWithEAS,
  getBuildStatus,
  listBuilds,
  downloadBuildArtifact,
  setupEASConfig
};
