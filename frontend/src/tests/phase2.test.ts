/**
 * Phase 2 Unit Tests: Adapter Mapping & Service Validation Tests
 * Run with: npx tsx src/tests/phase2.test.ts
 */

import assert from 'node:assert';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import {
  mapDbDomainToCategory,
  mapCategoryToDbDomain,
  mapDbStatusToUi,
  mapDbUrgencyToPriorityGroup,
  toUiTask,
  DbTask,
} from '../adapters/tasksAdapter';
import {
  mapDbStateToProjectStatus,
  mapCategoryToProjectDomain,
  generateProjectSlug,
  toUiProject,
  DbProject,
} from '../adapters/projectsAdapter';
import { tasksService } from '../services/tasksService';
import { projectsService } from '../services/projectsService';

console.log('--- RUNNING PHASE 2 ADAPTER & SERVICE TESTS ---');

// 1. Tasks Adapter Tests
{
  console.log('Test 1: Tasks domain mapping');
  assert.strictEqual(mapDbDomainToCategory('academics'), 'Academics');
  assert.strictEqual(mapDbDomainToCategory('toastmasters'), 'Toastmasters');
  assert.strictEqual(mapDbDomainToCategory('career'), 'Career');
  assert.strictEqual(mapDbDomainToCategory('creative'), 'Creative');
  assert.strictEqual(mapDbDomainToCategory('general'), 'Personal');

  assert.strictEqual(mapCategoryToDbDomain('Academics'), 'academics');
  assert.strictEqual(mapCategoryToDbDomain('Toastmasters'), 'toastmasters');
  assert.strictEqual(mapCategoryToDbDomain('Personal'), 'general');
  console.log('✓ Tasks domain mapping passed');
}

{
  console.log('Test 2: Tasks status & priority mapping');
  assert.strictEqual(mapDbStatusToUi('done', 'medium'), 'Done');
  assert.strictEqual(mapDbStatusToUi('inbox', 'critical'), 'Urgent');
  assert.strictEqual(mapDbStatusToUi('in_progress', 'low'), 'Preparing');
  assert.strictEqual(mapDbStatusToUi('scheduled', 'medium'), 'Upcoming');
  assert.strictEqual(mapDbStatusToUi('blocked', 'medium'), 'Failed');
  assert.strictEqual(mapDbStatusToUi('inbox', 'low'), 'Pending');

  assert.strictEqual(mapDbUrgencyToPriorityGroup('critical'), 'Must Do');
  assert.strictEqual(mapDbUrgencyToPriorityGroup('high'), 'Must Do');
  assert.strictEqual(mapDbUrgencyToPriorityGroup('medium'), 'Should Do');
  assert.strictEqual(mapDbUrgencyToPriorityGroup('low'), 'If Time Permits');
  console.log('✓ Tasks status & priority mapping passed');
}

{
  console.log('Test 3: Full toUiTask transformation');
  const sampleDbTask: DbTask = {
    id: 'b5a0cb08-0123-4567-89ab-cdef01234567',
    user_id: '12345678-1234-1234-1234-123456789012',
    project_id: null,
    goal_id: null,
    domain: 'academics',
    title: 'Complete Neural Networks Assignment',
    description: 'Implement backprop from scratch',
    urgency: 'high',
    status: 'in_progress',
    due_at: '2026-10-20T17:00:00.000Z',
    allocated_minutes: 90,
    completed_at: null,
    metadata: { source: 'VTOP Assignment' },
    created_at: '2026-10-16T12:00:00.000Z',
    updated_at: '2026-10-16T12:00:00.000Z',
  };

  const uiTask = toUiTask(sampleDbTask);
  assert.strictEqual(uiTask.id, sampleDbTask.id);
  assert.strictEqual(uiTask.title, 'Complete Neural Networks Assignment');
  assert.strictEqual(uiTask.category, 'Academics');
  assert.strictEqual(uiTask.status, 'Preparing');
  assert.strictEqual(uiTask.priorityGroup, 'Must Do');
  assert.strictEqual(uiTask.duration, '90m');
  assert.strictEqual(uiTask.completed, false);
  assert.strictEqual(uiTask.source, 'VTOP Assignment');
  console.log('✓ Full toUiTask transformation passed');
}

// 2. Projects Adapter Tests
{
  console.log('Test 4: Projects slug generation and status mapping');
  assert.strictEqual(generateProjectSlug('GOWRISH OS — Life Command!'), 'gowrish-os-life-command');
  assert.strictEqual(generateProjectSlug('  AI/ML Research 2026  '), 'ai-ml-research-2026');

  assert.strictEqual(mapDbStateToProjectStatus('active'), 'Active Build');
  assert.strictEqual(mapDbStateToProjectStatus('draft'), 'Planning');
  assert.strictEqual(mapDbStateToProjectStatus('completed'), 'In Progress');

  assert.strictEqual(mapCategoryToProjectDomain('Academics'), 'academics');
  assert.strictEqual(mapCategoryToProjectDomain('Toastmasters Club'), 'toastmasters');
  assert.strictEqual(mapCategoryToProjectDomain('Creative Design'), 'creative');
  console.log('✓ Projects slug generation and status mapping passed');
}

{
  console.log('Test 5: Derived project progress calculation');
  const sampleDbProject: DbProject = {
    id: 'f1a0cb08-0123-4567-89ab-cdef01234567',
    user_id: '12345678-1234-1234-1234-123456789012',
    slug: 'neural-engine',
    title: 'Neural Engine V2',
    description: 'Autonomous agents core',
    domain: 'career',
    state: 'active',
    metadata: { version: 'v2.1', due_date: 'Nov 30, 2026' },
    created_at: '2026-10-16T12:00:00.000Z',
    updated_at: '2026-10-16T12:00:00.000Z',
  };

  // With 3 out of 4 tasks completed -> 75%
  const uiProject75 = toUiProject(sampleDbProject, { total: 4, completed: 3 });
  assert.strictEqual(uiProject75.progress, 75);
  assert.strictEqual(uiProject75.name, 'Neural Engine V2');
  assert.strictEqual(uiProject75.category, 'Career');
  assert.strictEqual(uiProject75.status, 'Active Build');
  assert.strictEqual(uiProject75.version, 'v2.1');
  assert.strictEqual(uiProject75.dueDate, 'Nov 30, 2026');

  // Without tasks -> 0% (documented derived value, no invented progress)
  const uiProjectZero = toUiProject(sampleDbProject);
  assert.strictEqual(uiProjectZero.progress, 0);
  console.log('✓ Derived project progress calculation passed');
}

// 3. Service Security & Validation Tests
{
  console.log('Test 6: Services reject unauthenticated calls gracefully');
  // Without an active user session in node test environment
  const taskResult = await tasksService.fetchTasks();
  assert(taskResult.error !== null);
  assert(taskResult.error.message.includes('Unauthorized') || taskResult.error.message.includes('session'));

  const createResult = await tasksService.createTask({ title: '' });
  assert(createResult.error !== null);

  const projectResult = await projectsService.fetchProjects();
  assert(projectResult.error !== null);
  assert(projectResult.error.message.includes('Unauthorized') || projectResult.error.message.includes('session'));

  console.log('✓ Services reject unauthenticated calls gracefully');
}

console.log('--- ALL 6 PHASE 2 ADAPTER & SERVICE TESTS PASSED SUCCESSFULLY ---');
