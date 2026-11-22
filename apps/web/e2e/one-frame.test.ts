import { test } from '@playwright/test';

test.use({ viewport: { width: 1024, height: 1366 } });

import './one-frame';
