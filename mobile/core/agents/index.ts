/**
 * RARE 4N - Agents Registry
 * Centralized export point for all autonomous agents within the RARE OS.
 * Facilitates clean imports for the RAREKernel and Cognitive Loop.
 */

// Base Class
export { BaseAgent } from './BaseAgent';

// Core Functionality Agents
export { BuilderAgent } from './BuilderAgent';
export { VoiceAgent } from './VoiceAgent';
export { FilingAgent } from './FilingAgent';
export { VaultAgent } from './VaultAgent';

// Integrated Services Agents
export { PortalAgent } from './PortalAgent';
export { LoyaltyAgent } from './LoyaltyAgent';
export { MapsAgent } from './MapsAgent';
export { CommunicationAgent } from './CommunicationAgent';

// Decision Support Agents
export { CouncilAgent } from './CouncilAgent';
export { UltimateAssistant } from './UltimateAssistant';

// Platform Specific Agents
export { CarPlayAgent } from './CarPlayAgent';
export { ServiceAgent } from './ServiceAgent';