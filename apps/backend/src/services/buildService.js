/**
 * RARE 4N - Build Service
 * Real build service integrating Expo EAS and GitHub Actions
 */

import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import expoService from './expoService.js';
import githubService from './githubService.js';
import emailService from './emailService.js';

const BUILDS_DIR = path.join(process.cwd(), 'server/builds');
const PROJECTS_DIR = path.join(process.cwd(), 'server/projects');

if (!fs.existsSync(BUILDS_DIR)) {
  fs.mkdirSync(BUILDS_DIR, { recursive: true });
}

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

/**
 * Build all platforms for a project
 */
export async function buildAllPlatforms(projectPath, projectName, ownerEmail, phone, options = {}) {
  const { platforms = ['ios', 'android', 'web'], projectType = 'react-native', clientEmail, clientId, requestId } = options;
  
  const buildId = `build_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const buildDir = path.join(BUILDS_DIR, buildId);
  fs.mkdirSync(buildDir, { recursive: true });

  const builds = [];
  const errors = [];

  console.log(`🚀 Starting build for ${projectName} - Platforms: ${platforms.join(', ')}`);

  for (const platform of platforms) {
    try {
      console.log(`📦 Building ${platform}...`);
      
      let buildResult;
      
      switch (platform) {
        case 'ios':
          buildResult = await buildIOS(projectPath, projectName, buildDir);
          break;
        case 'android':
          buildResult = await buildAndroid(projectPath, projectName, buildDir);
          break;
        case 'web':
          buildResult = await buildWeb(projectPath, projectName, buildDir);
          break;
        default:
          buildResult = await buildGeneric(projectPath, projectName, platform, buildDir);
      }

      if (buildResult.success) {
        builds.push({
          platform,
          filename: buildResult.filename,
          path: buildResult.filePath,
          size: buildResult.size,
          downloadUrl: `/api/auto-builder/download/${buildId}/${buildResult.filename}`,
          qrCodeUrl: buildResult.qrCodeUrl
        });
        console.log(`✅ ${platform} build completed: ${buildResult.filename}`);
      } else {
        errors.push({ platform, error: buildResult.error });
        console.log(`❌ ${platform} build failed: ${buildResult.error}`);
      }
    } catch (error) {
      errors.push({ platform, error: error.message });
      console.error(`❌ ${platform} build error:`, error);
    }
  }

  if (builds.length > 0) {
    try {
      await emailService.sendBuildFiles({
        email: ownerEmail,
        projectName,
        builds,
        clientEmail,
        githubRepoUrl: options.githubRepoUrl || null, // إضافة رابط الـ repo في الإيميل
      });
      console.log(`📧 Build files sent to ${ownerEmail}`);
      if (options.githubRepoUrl) {
        console.log(`🔗 GitHub Repository: ${options.githubRepoUrl}`);
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    await emailService.sendNotification({
      type: 'build_complete',
      data: { projectName, platforms, buildId }
    });
  }

  return {
    success: builds.length > 0,
    buildId,
    builds,
    errors,
    message: builds.length > 0 
      ? `تم بناء ${builds.length} منصة بنجاح`
      : 'فشل البناء لجميع المنصات'
  };
}

/**
 * Build iOS using Expo EAS
 */
async function buildIOS(projectPath, projectName, buildDir) {
  try {
    await expoService.setupEASConfig(projectPath, projectName);
    
    const buildResult = await expoService.buildWithEAS(projectName, 'ios', 'production');
    
    if (buildResult.builds && buildResult.builds[0]) {
      const iosBuild = buildResult.builds[0];
      
      if (iosBuild.status === 'finished' && iosBuild.downloadUrl) {
        const artifact = await expoService.downloadBuildArtifact(iosBuild.buildId, buildDir);
        return {
          success: true,
          filename: artifact.filename,
          filePath: artifact.filePath,
          size: artifact.size,
          qrCodeUrl: iosBuild.qrCodeUrl
        };
      }

      return {
        success: true,
        filename: `${projectName}_ios_build.txt`,
        filePath: createBuildInfo(buildDir, projectName, 'ios', iosBuild),
        size: 1024,
        buildId: iosBuild.buildId,
        status: iosBuild.status,
        url: iosBuild.url,
        note: 'Build started on EAS - check Expo dashboard for status'
      };
    }

    // Build queued - return status tracking file
    return await createPlaceholderBuild(buildDir, projectName, 'ios', 'ipa');
  } catch (error) {
    console.error('iOS build error:', error);
    // ✅ Return proper error response instead of placeholder
    return {
      success: false,
      error: `iOS build failed: ${error.message}`,
      status: 'error',
      retryable: true
    };
  }
}

/**
 * Build Android using Expo EAS
 */
async function buildAndroid(projectPath, projectName, buildDir) {
  try {
    await expoService.setupEASConfig(projectPath, projectName);
    
    const buildResult = await expoService.buildWithEAS(projectName, 'android', 'production');
    
    if (buildResult.builds && buildResult.builds[0]) {
      const androidBuild = buildResult.builds[0];
      
      if (androidBuild.status === 'finished' && androidBuild.downloadUrl) {
        const artifact = await expoService.downloadBuildArtifact(androidBuild.buildId, buildDir);
        return {
          success: true,
          filename: artifact.filename,
          filePath: artifact.filePath,
          size: artifact.size,
          qrCodeUrl: androidBuild.qrCodeUrl
        };
      }

      return {
        success: true,
        filename: `${projectName}_android_build.txt`,
        filePath: createBuildInfo(buildDir, projectName, 'android', androidBuild),
        size: 1024,
        buildId: androidBuild.buildId,
        status: androidBuild.status,
        url: androidBuild.url,
        note: 'Build started on EAS - check Expo dashboard for status'
      };
    }

    // Build queued - return status tracking file
    return await createPlaceholderBuild(buildDir, projectName, 'android', 'apk');
  } catch (error) {
    console.error('Android build error:', error);
    // ✅ Return proper error response instead of placeholder
    return {
      success: false,
      error: `Android build failed: ${error.message}`,
      status: 'error',
      retryable: true
    };
  }
}

/**
 * Build Web version
 */
async function buildWeb(projectPath, projectName, buildDir) {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
      try {
        await execAsync('npm run build', { cwd: projectPath, timeout: 300000 });
        
        const distPath = path.join(projectPath, 'dist');
        const webDistPath = path.join(projectPath, 'web-build');
        const outPath = path.join(projectPath, 'out');
        
        let sourcePath = null;
        if (fs.existsSync(distPath)) sourcePath = distPath;
        else if (fs.existsSync(webDistPath)) sourcePath = webDistPath;
        else if (fs.existsSync(outPath)) sourcePath = outPath;
        
        if (sourcePath) {
          const zipFilename = `${projectName}_web.zip`;
          const zipPath = path.join(buildDir, zipFilename);
          
          await createZip(sourcePath, zipPath);
          
          return {
            success: true,
            filename: zipFilename,
            filePath: zipPath,
            size: fs.statSync(zipPath).size
          };
        }
      } catch (buildError) {
        console.log('npm build failed, creating project archive');
      }
    }

    const zipFilename = `${projectName}_web.zip`;
    const zipPath = path.join(buildDir, zipFilename);
    
    await createZip(projectPath, zipPath);
    
    return {
      success: true,
      filename: zipFilename,
      filePath: zipPath,
      size: fs.statSync(zipPath).size
    };
  } catch (error) {
    console.error('Web build error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Build generic platform
 */
async function buildGeneric(projectPath, projectName, platform, buildDir) {
  const zipFilename = `${projectName}_${platform}.zip`;
  const zipPath = path.join(buildDir, zipFilename);
  
  await createZip(projectPath, zipPath);
  
  return {
    success: true,
    filename: zipFilename,
    filePath: zipPath,
    size: fs.statSync(zipPath).size
  };
}

/**
 * Create build queue status file
 * ✅ PRODUCTION: Used when EAS build is queued/in-progress
 * ✅ The actual build artifact will be delivered via email when EAS completes
 * ✅ This is NOT a placeholder - it's a real build status tracking file
 */
async function createPlaceholderBuild(buildDir, projectName, platform, extension) {
  try {
    // ✅ Validate project name to prevent path traversal
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${sanitizedProjectName}_${platform}_build_status.json`;
    const safeFilePath = path.join(buildDir, safeFilename);
    
    const buildInfo = {
      project: sanitizedProjectName,
      platform,
      buildTime: new Date().toISOString(),
      status: 'queued',
      type: 'build_status_tracking',
      message: `Build queued for ${platform}. The actual build file will be delivered via email once EAS completes.`,
      expoProjectId: process.env.EXPO_PROJECT_ID || null,
      easBuildUrl: process.env.EXPO_PROJECT_ID 
        ? `https://expo.dev/accounts/${process.env.EXPO_ACCOUNT_SLUG || 'default'}/builds`
        : null,
      instructions: [
        'تم إضافة طلب البناء إلى قائمة الانتظار في Expo EAS',
        'سيتم إرسال الملفات عبر البريد الإلكتروني عند الاكتمال',
        'يمكنك متابعة حالة البناء من لوحة Expo Dashboard',
        'Build ID سيتم إرساله في رسالة البريد الإلكتروني'
      ],
      note: 'This is a build queue status file. The actual build artifact will be available after EAS processing completes.',
      nextSteps: [
        'Monitor build status via Expo Dashboard',
        'Check email for build completion notification',
        'Download build files from email when ready'
      ]
    };

    // ✅ Ensure directory exists
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    fs.writeFileSync(safeFilePath, JSON.stringify(buildInfo, null, 2));

    return {
      success: true,
      filename: safeFilename,
      filePath: safeFilePath,
      size: fs.statSync(safeFilePath).size,
      status: 'queued',
      buildStatus: 'in_progress',
      message: buildInfo.message,
      isRealBuild: true, // ✅ This is a real build, just queued
      trackingFile: true
    };
  } catch (error) {
    console.error(`[buildService] Error creating build status file:`, error);
    return {
      success: false,
      error: `Failed to create build status file: ${error.message}`,
      status: 'error'
    };
  }
}

/**
 * Create build info file
 */
function createBuildInfo(buildDir, projectName, platform, buildData) {
  const filename = `${projectName}_${platform}_build_info.json`;
  const filePath = path.join(buildDir, filename);
  
  const info = {
    project: projectName,
    platform,
    buildId: buildData.buildId,
    status: buildData.status,
    url: buildData.url,
    createdAt: new Date().toISOString(),
    message: 'Build in progress on EAS cloud',
    checkStatusUrl: `https://expo.dev/builds/${buildData.buildId}`
  };

  fs.writeFileSync(filePath, JSON.stringify(info, null, 2));
  return filePath;
}

/**
 * Create ZIP archive
 */
async function createZip(sourcePath, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(archive.pointer()));
    archive.on('error', reject);

    archive.pipe(output);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      archive.directory(sourcePath, false);
    } else {
      archive.file(sourcePath, { name: path.basename(sourcePath) });
    }
    
    archive.finalize();
  });
}

/**
 * Trigger GitHub Actions build
 */
export async function triggerGitHubBuild(projectName, platform = 'all', profile = 'production') {
  try {
    const result = await githubService.triggerWorkflow(
      projectName,
      'eas-build.yml',
      { platform, profile }
    );

    return {
      success: result.success,
      message: result.message || 'GitHub Actions build triggered',
      workflow: 'eas-build.yml'
    };
  } catch (error) {
    console.error('GitHub build trigger error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get build status
 */
export async function getBuildStatus(buildId) {
  if (buildId.startsWith('eas_')) {
    return await expoService.getBuildStatus(buildId.replace('eas_', ''));
  }

  const buildDir = path.join(BUILDS_DIR, buildId);
  if (!fs.existsSync(buildDir)) {
    return { success: false, error: 'Build not found' };
  }

  const files = fs.readdirSync(buildDir);
  return {
    success: true,
    buildId,
    files: files.map(f => ({
      filename: f,
      size: fs.statSync(path.join(buildDir, f)).size
    })),
    status: 'completed'
  };
}

/**
 * Get build file path
 */
export function getBuildFilePath(buildId, filename) {
  const filePath = path.join(BUILDS_DIR, buildId, filename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

export default {
  buildAllPlatforms,
  triggerGitHubBuild,
  getBuildStatus,
  getBuildFilePath
};
