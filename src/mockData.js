/**
 * TeamTask-Tracker Data Provider
 * Re-exports real enterprise models from dataStore.
 */

import { DEFAULT_ADMIN, ENTERPRISE_MEMBERS, INITIAL_ENTERPRISE_TASKS, CATEGORIES as DATASTORE_CATEGORIES } from './services/dataStore';

export const initialMembers = ENTERPRISE_MEMBERS;
export const initialTasks = INITIAL_ENTERPRISE_TASKS;
export const CATEGORIES = DATASTORE_CATEGORIES;
