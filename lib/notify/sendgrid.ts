import sendgrid from "@sendgrid/mail";
import {
  NotificationMeta,
  NotificationResult,
  NotificationType,
  Notifier,
} from "./types";

export default class SendgridNotifier implements Notifier {
  id = "SENDGRID";

  templates: Record<NotificationType, string> = {
    [NotificationType.ForgotPassword]: "d-9e3ecf30ca4846a68e1e879db5105974",
    [NotificationType.SignUpInvitation]: "d-3ad525e2c11840e59dce1a51d1d89004",
  };

  async setup(): Promise<void> {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error(
        "SENDGRID_API_KEY environment variable required to setup the SendgridNotifier"
      );
    }
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendNotification<T extends NotificationType>(
    type: T,
    meta: NotificationMeta[T]
  ): Promise<NotificationResult> {
    await sendgrid.send({
      to: meta.email,
      from: "ogsc@calblueprint.org",
      templateId: this.templates[type],
      dynamicTemplateData: meta,
    });

    return { ok: true };
  }
}
