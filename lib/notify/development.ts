import {
  NotificationMeta,
  NotificationResult,
  NotificationType,
  Notifier,
} from "./types";

export default class DevelopmentConsoleNotifier implements Notifier {
  id = "DEVELOPMENT";

  buildTemplate(
    type: NotificationType,
    meta: NotificationMeta[NotificationType]
  ): string {
    const { email, ...otherMeta } = meta;
    return `
To: ${email}
Message Type: ${type}
---------------------------------------
${JSON.stringify(otherMeta)}
`;
  }

  async setup(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log("[dev-notify] setup called");
  }

  async sendNotification<T extends NotificationType>(
    type: T,
    meta: NotificationMeta[T]
  ): Promise<NotificationResult> {
    // eslint-disable-next-line no-console
    console.log(this.buildTemplate(type, meta));
    return { ok: true };
  }
}
