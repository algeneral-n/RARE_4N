/**
 * RARE 4N - Auto Builder Service
 * خدمة Auto Builder الكاملة - Integration مع النظام الحالي
 */

import { AutoBuilderKernel } from './autobuilder/AutoBuilderKernel.js';

/**
 * معالجة طلب العميل وإنشاء المشروع تلقائياً
 */
export async function processClientRequest(request) {
  try {
    const kernel = AutoBuilderKernel.getInstance();

    const buildRequest = {
      text: request.description || request.text || '',
      clientId: request.clientId,
      clientName: request.clientName,
      clientEmail: request.clientEmail,
      requestId: request.requestId || request.id,
      projectType: request.projectType,
      platforms: request.platforms,
      features: request.features,
    };

    const result = await kernel.run(buildRequest);

    return result;
  } catch (error) {
    console.error('[AutoBuilderService] Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process request',
    };
  }
}

/**
 * الحصول على حالة البناء
 */
export async function getBuildStatus(requestId) {
  try {
    const kernel = AutoBuilderKernel.getInstance();
    return await kernel.getBuildStatus(requestId);
  } catch (error) {
    console.error('[AutoBuilderService] Get status error:', error);
    return null;
  }
}

/**
 * الحصول على جميع المشاريع
 */
export async function getAllProjects() {
  try {
    const kernel = AutoBuilderKernel.getInstance();
    return await kernel.getAllProjects();
  } catch (error) {
    console.error('[AutoBuilderService] Get all projects error:', error);
    return [];
  }
}

export default {
  processClientRequest,
  getBuildStatus,
  getAllProjects,
};























