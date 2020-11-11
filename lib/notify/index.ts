import DevelopmentConsoleNotifier from "./development";
import SendgridNotifier from "./sendgrid";
import { Notifier } from "./types";

const notifier: Notifier = process.env.SENDGRID_API_KEY
  ? new SendgridNotifier()
  : new DevelopmentConsoleNotifier();

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
