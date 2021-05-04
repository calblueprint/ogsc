import sendgrid from "@sendgrid/mail";
import {
  NotificationMeta,
  NotificationResult,
  NotificationType,
  Notifier,
} from "./types";

export default class SendgridNotifier implements Notifier {
  id = "SENDGRID";

  stagingTemplates: Record<NotificationType, string> = {
    [NotificationType.ForgotPassword]: "d-9e3ecf30ca4846a68e1e879db5105974",
    [NotificationType.SignUpInvitation]: "d-3ad525e2c11840e59dce1a51d1d89004",
    [NotificationType.RequestAccepted]: "d-d3d3822022b548589003f1a005227616",
  };

  productionTemplates: Record<NotificationType, string> = {
    [NotificationType.ForgotPassword]: "d-3ab72f8086884b51aa1e80e8e51b81bc",
    [NotificationType.SignUpInvitation]: "d-86dc53c3c7a9457588b63e5491c7b13f",
    [NotificationType.RequestAccepted]: "d-9d5cead29a7444198173ee3c74b39fc9",
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
      from:
        process.env.VERCEL_ENV === "production"
          ? "youth@oaklandgenesis.org"
          : "ogsc@calblueprint.org",
      templateId: (process.env.VERCEL_ENV === "production"
        ? this.productionTemplates
        : this.stagingTemplates)[type],
      dynamicTemplateData: meta,
    });

    return { ok: true };
  }
}
