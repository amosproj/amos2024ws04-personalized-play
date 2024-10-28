import { registerRootComponent } from 'expo';
import { App } from './App';

/**
 * Registers `App` as the root component of the application.
 *
 * - Essential for proper app rendering and functionality.
 * - Must not be removed, as it's referenced in `package.json > main`.
 */
registerRootComponent(App);
