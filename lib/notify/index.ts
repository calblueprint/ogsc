import DevelopmentConsoleNotifier from "./development";
import { Notifier } from "./types";

// TODO: Add additional logic here to select the right notifier
const notifier: Notifier = new DevelopmentConsoleNotifier();

async function setupNotifier(): Promise<void> {
  try {
    await notifier.setup();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`The ${notifier.id} notifier failed to setup`, err);
  }
}

setupNotifier();

export default notifier;
