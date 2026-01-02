import express from 'express';
import buildService from '../services/buildService.js';

const router = express.Router();

// بدء عملية بناء التطبيق (EAS Build)
router.post('/build', async (req, res) => {
  try {
    const { projectPath, projectName, email, platforms } = req.body;
    const result = await buildService.buildAllPlatforms(
      projectPath, 
      projectName, 
      email, 
      null, 
      { platforms: platforms || ['ios', 'android'] }
    );
    res.json(result);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// فحص حالة البناء (iOS/Android)
router.get('/status/:buildId', async (req, res) => {
  try {
    const status = await buildService.getBuildStatus(req.params.buildId);
    res.json(status);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;